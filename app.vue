<template>
  <div class="2xl:container mx-auto bg-gray-900">
    <div class="grid grid-cols-1">
      <div class="flex flex-wrap">
        <div id="users" class="w-full md:w-1/3 bg-gray-700 h-screen overflow-y-auto relative md:z-10">
          <nav class="h-full">
            <ul class="text-white p-9 h-full">
              <template v-if="users?.length">
                <Contact v-for="user in users" :key="user.id" :user="user"
                  @trigger_conversation="trigger_conversation" />
              </template>
              <template v-else>
                <li class="text-center h-full flex items-center justify-center">
                  <p class=" bg-gray-800 py-2 px-3 rounded-lg text-sm">برای گفتو گو مخاطب خود را ایجاد کنید</p>
                </li>
              </template>
            </ul>
          </nav>
        </div>
        <transition enter-active-class="animate__animated animate__slideInRight"
          leave-active-class="animate__animated animate__slideOutRight">
          <div v-if="isActiveConversation && user_id != 0" id="room-chat"
            class="w-full md:w-2/3 h-screen overflow-y-auto absolute md:static top-0 right-0 bg-gray-900">
            <!-- <CahtRoom :user_id="user_id" :back="() => (isActiveConversation = false)" 
                /> -->
            <Suspense>
              <template #default>
                <CahtRoom :user_id="user_id" :back="() => (isActiveConversation = false)" @delete_user="delete_user" />
              </template>
              <template #fallback>
                Loading...
              </template>
            </Suspense>
          </div>
        </transition>
      </div>
      <section v-if="addConversationIcon" class="fixed bottom-6 left-10 md:left-auto  md:right-1/4 z-10 rounded-full bg-blue-700 w-12 h-12
      shadow-md flex items-center justify-center cursor-pointer hover:shadow-2xl hover:bg-blue-800"
        @click="show_window_add_user()">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
          viewBox="0 0 24 24" class="w-7 h-7 fill-gray-300">
          <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
        </svg>
      </section>
    </div>

  </div>

</template>


<script lang="ts" setup>

import User from '@/constants/type/User';
import apiServices from '@/services/apiServices'
import usePromis from '@/composables/use-promis'
import Contact from "@/components/Contact.vue";
import UserId from '@/constants/type/UserId'



//componentes 
const CahtRoom = defineAsyncComponent(() => {
  return import('@/components/ChatRoom.vue')
})



//datas
let users = ref<User[]>([])
let isActiveConversation = ref<boolean>(false)
let user_id = ref<UserId>(0)
const error = ref<any>(null)

//props

const props = defineProps<{
  // conversations: Conversation[],
  // users: User[]
}>()



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

function show_window_add_user() {
  console.log('g')
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
