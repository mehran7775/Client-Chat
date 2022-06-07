<template>
  <div class="2xl:container mx-auto bg-gray-900">
    <div class="grid grid-cols-1">
      <div v-if="items.length && user_id === 0" class="hidden md:block">
        <div class="absolute left-0 h-full w-2/3 flex justify-center items-center">
          <p class=" bg-gray-800 py-2 px-3 rounded-lg text-sm text-gray-200">برای شروع گفتوگو روی مخاطب ضربه بزنید</p>
        </div>
      </div>
      <div class="flex flex-wrap">
        <section id="users" class="w-full md:w-1/3 bg-gray-700 h-screen overflow-y-auto relative md:z-10">
          <nav class="h-full">
            <ul class="text-white p-9 h-full">
              <template v-if="items.length">
                <Contact v-for="user in items" :key="user.id" :user="user"
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
                <CahtRoom :user_id="user_id" :back="() => (isActiveConversation = false)" @delete_user="delete_user" />
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
      <section v-if="addConversationIcon" class="fixed bottom-6 left-10 md:left-auto  md:right-1/4 z-10 rounded-full bg-blue-700 w-12 h-12
      shadow-md flex items-center justify-center cursor-pointer hover:shadow-2xl hover:bg-blue-800"
        @click="trigger_show_modal()">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
          viewBox="0 0 24 24" class="w-7 h-7 fill-gray-300">
          <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
        </svg>
      </section>
    </div>
    <transition enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut">
      <Modal v-if="show_modal" @close="show_modal = false">
        <v-form class="bg-gray-900 rounded px-8 pt-6 mb-4" @submit="add_user">
          <div>
            <label class="block text-white text-sm font-bold mb-2" for="username">
              نام مخاطب
            </label>
            <v-field name="name" id="filed-name"  type="text" :rules="customValidate" placeholder="نام مخاطب خود را وارد کنید"
              class="w-full bg-gray-800 text-white rounded py-2 px-3 border-gray-800 mt-1">
            </v-field>
            <v-error-message name="name" class="w-full text-red-400 p-1 block text-xs text-right">
            </v-error-message>
            <small v-if="error" v-text="error" class="mt-1 text-red-400"></small>
          </div>
          <div class="bg-gray-900 mt-4">
            <button
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-700 text-base font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm">ثبت</button>
            <button type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="show_modal = false">انصراف</button>
          </div>
        </v-form>
      </Modal>
    </transition>
  </div>
</template>


<script lang="ts" setup>

import apiServices from '@/services/apiServices'
import userStore from '@/stores/user'
import usePromis from '@/composables/use-promis'
import Contact from "@/components/Contact.vue"
import UserId from '@/constants/types/UserId'
import { storeToRefs } from 'pinia'
// import { consume } from '@/composables/upload-able-file'

useHead({
  title: 'client chat',
  meta: [{ name: 'description', content: 'client chat of asre danesh afzar' }],
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon.png' }
  ]
})

//componentes 

const CahtRoom = defineAsyncComponent(() => {
  return import('@/components/ChatRoom.vue')
})



//datas

const { items } = storeToRefs(userStore())
let isActiveConversation = ref<boolean>(false)
let user_id = ref<UserId>(0)
const error = ref<any>(null)
let show_modal = ref<boolean>(false)


//computed

const addConversationIcon = computed<boolean>(() => {
  if (!isActiveConversation.value || window.innerWidth >= 768) {
    return true
  }
  return false
})



//hooks

onBeforeMount(async () => {
  await get_users()
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

async function get_users(): Promise<void> {
   const getUsers = usePromis(apiServices.getUsers)
  await getUsers.createPromis()
  if (getUsers.result) {
    // consume(getUsers.result.body)
    userStore().items = toRaw(getUsers.result)
  }
}

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
  const res = userStore().delete_user(id)
  if (res) {
    user_id.value = 0
    isActiveConversation.value = false
  }
}


function customValidate(value: any) {
  error.value = null
  if (!value) {
    return 'لطفا نام مخاطب را وراد کنید'
  }
  return true
}


async function add_user(value: any, { resetForm }: { resetForm: () => void }) {
  const user = JSON.stringify({
    name: value.name,
    thumbnail: "/img/default_profile.jpeg"
  })
  const add_user = usePromis(apiServices.addUser)
  await add_user.createPromis(user)
  if(add_user.result) {
    show_modal.value = false
    get_users()
  }else {
    error.value = add_user.error
  }


}


function trigger_show_modal(): void {
  show_modal.value= true
  nextTick(() => {
    const input = document.getElementById("filed-name") as HTMLInputElement
    input.focus()
  })
}

</script>


<style scoped lang="scss">
.animate__animated {
  --animate-duration: .2s;
}
</style>
