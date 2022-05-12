<template>
  <div class="2xl:container mx-auto bg-gray-900">
    <div class="grid grid-cols-1">
      <div v-if="users.length && user_id === 0" class="hidden md:block">
        <div class="absolute left-0 h-full w-2/3 flex justify-center items-center">
          <p class=" bg-gray-800 py-2 px-3 rounded-lg text-sm text-gray-200">برای شروع گفتوگو روی مخاطب ضربه بزنید</p>
        </div>
      </div>
      <div class="flex flex-wrap">
        <section id="users" class="w-full md:w-1/3 bg-gray-700 h-screen overflow-y-auto relative md:z-10">
          <nav class="h-full">
            <ul class="text-white p-9 h-full">
              <template v-if="users.length">
                <Contact v-for="user in users" :key="user.id" :user="user"
                  @trigger_conversation="trigger_conversation" />
                <div class="h-6"></div>
              </template>
              <template v-else>
                <li class="text-center h-full flex items-center justify-center">
                  <p class=" bg-gray-800 py-2 px-3 rounded-lg text-sm">برای گفتو گو مخاطب خود را ایجاد کنید</p>
                </li>
              </template>
            </ul>
          </nav>
        </section>
        <transition enter-active-class="animate__animated animate__slideInRight"
          leave-active-class="animate__animated animate__slideOutRight">
          <section v-if="isActiveConversation && user_id != 0" id="chat-room"
            class="w-full md:w-2/3 h-screen overflow-y-auto absolute md:static top-0 right-0 bg-gray-900">
            <Suspense>
              <template #default>
                <CahtRoom :user_id="user_id" :back="() => (isActiveConversation = false)"
                  @delete_user="delete_user" />
              </template>
              <template #fallback>
                <div class="w-full h-full flex justify-center items-center">
                  <svg v-if="!error" role="status"
                    class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-700"
                    viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor" />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill" />
                  </svg>
                  <div v-else class="text-gray-200">{{ error }}</div>
                </div>
              </template>
            </Suspense>
          </section>
        </transition>
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>

import User from '@/constants/types/User';
import apiServices from '@/services/apiServices'
import usePromis from '@/composables/use-promis'
import Contact from "@/components/Contact.vue";
import UserId from '@/constants/types/UserId'



//componentes 
const CahtRoom = defineAsyncComponent(() => {
  return import('@/components/ChatRoom.vue')
})



//datas
let users = ref<User[]>([])
let isActiveConversation = ref<boolean>(false)
let user_id = ref<UserId>(0)
const error = ref<any>(null)


//computed

const addConversationIcon = computed<boolean>(() => {
  if (!isActiveConversation.value || window.innerWidth >= 768) {
    return true
  }
  return false
})



//hooks

onBeforeMount(async () => {
  const getUsers = usePromis(apiServices.getUsers)
  await getUsers.createPromis()
  if (getUsers.result) {
    users.value = toRaw(getUsers.result)
  }
})

onMounted(() => {
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

onErrorCaptured((e) => {
  error.value = e
  return true
})



//methods

function handleResize(): void {
  if (window.innerWidth <= 768) {
    isActiveConversation.value = false
  } else {
    isActiveConversation.value = true
  }
}
let trigger_conversation = (id: string | number): void => {
  user_id.value = id
  isActiveConversation.value = true
}


function delete_user(id: string | number) {
  const user = users.value.find(user => user.id == id)
  if (user) {
    const index = users.value.indexOf(user as User) as number
    if (index > -1) {
      users.value.splice(index, 1)
      user_id.value = 0
      isActiveConversation.value = false

    }
  }
}


</script>


<style scoped lang="scss">
.animate__animated {
  --animate-duration: .2s;
}
</style>
