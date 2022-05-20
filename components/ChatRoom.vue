<template>
   <section id="header" class="bg-gray-900 py-5 px-2 shadow-2xl sticky top-0 z-0">
      <div class="flex justify-between items-center px-2 relative">
         <div class="flex">
            <svg @click="back" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
               version="1.1" viewBox="0 0 24 24"
               class="w-10 h-10 fill-gray-400 hover:fill-gray-100 md:hidden cursor-pointer mt-2">
               <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
            </svg>
            <div class="flex items-center mr-3">
               <img :src="user.value.thumbnail" class="avatar">
               <span v-text="user.value.name" class="text-white mr-3"></span>
            </div>
         </div>
         <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
            viewBox="0 0 24 24" class="w-10 h-10 fill-gray-400 hover:fill-gray-100 cursor-pointer" id="icon-option"
            @click="showOption = !showOption">
            <path
               d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" />
         </svg>
         <transition enter-active-class="animate__animated animate__zoomIn"
            leave-active-class="animate__animated animate__zoomOut">
            <div v-if="showOption" class="absolute left-10 top-3 rounded-md w-16 bg-gray-700 p-1">
               <ul class="w-full">
                  <li class="hover:bg-gray-600 text-white">
                     <button class="w-full py-2 px-1 hover:rounded-md" @click="delete_user()">حذف</button>
                  </li>
               </ul>
            </div>
         </transition>
      </div>
   </section>
   <section id="messages" class="overflow-y-auto pb-14">
      <nav>
         <ul class="messages flex flex-col p-3">
            <Pm v-for="(message, i) in messages" :key="i" :message="message" @delete_message="delete_message" />
         </ul>
      </nav>
   </section>
   <section id="footer" class="w-full md:w-2/3  fixed left-0 bottom-0 px-4 pb-4">
      <v-form class="w-full" @submit="onSubmit">
         <div class="flex justify-center items-center">
            <v-field name="pm" type="text" :rules="customValidate"
               class="w-2/3 bg-gray-800 text-white rounded-r-2xl rounded-bl-sm rounded-tl-2xl py-2 px-3 border-gray-800">
            </v-field>
            <button
               class="rounded-full mr-2 w-11 h-11 flex justify-center items-center pr-1 shadow-2xl cursor-pointer bg-gray-800">
               <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
                  width="28" height="28" viewBox="0 0 24 24" style=" transform: rotate(180deg);" fill="white">
                  <path
                     d="M4 6.03L11.5 9.25L4 8.25L4 6.03M11.5 14.75L4 17.97V15.75L11.5 14.75M2 3L2 10L17 12L2 14L2 21L23 12L2 3Z" />
               </svg>
            </button>
         </div>
         <!-- <v-error-message name="pm" class="w-full fixed text-gray-200 block text-xs bottom-2 text-right pr-20"></v-error-message> -->
      </v-form>
   </section>

</template>


<script lang="ts" setup>

import User from '@/constants/types/User'
import usePromis from '@/composables/use-promis'
import apiServices from '@/services/apiServices'
import Message from '@/constants/types/Message'
import UserId from '@/constants/types/UserId'
import Pm from '@/components/Pm.vue'
import messageStore from '@/stores/message'

//props

let props = defineProps<{
   user_id: UserId,
   back: () => void
}>()



//emits

const emit = defineEmits(['delete_user'])




//wathchs

watch(() => props.user_id, async() => {
   if (ws.readyState === state_ws.OPEN) ws.close()
   await get_user()
   test_websocket()
})



//data

let user = reactive({
   value: {} as User
})

let showOption = ref<boolean>(false)

let ws = ref<any>(null)


//computed

const messages = computed(() => {
  return messageStore().items.filter( item => item.user_id == props.user_id )
  
})





//enum

enum state_ws {
   OPEN = 1,
   CLOSE = 2
}


await get_user()
test_websocket()


//hooks

onMounted(() => {
   document.addEventListener('click', (e) => {
      hide_option(e)
   })
})

onUnmounted(() => {
   document.removeEventListener('click', hide_option)
   if (ws.readyState === state_ws.OPEN) {
      ws.close()
   }
})



//methods

async function get_user() {
   const getUser = usePromis(apiServices.getUser)
   await getUser.createPromis(props.user_id as string | number)
   if (getUser.result) {
      user.value = toRaw(getUser.result)[0]
   }

}


function test_websocket() {
   ws = connect_to_ws()
   ws.onopen = () => {
      console.log('connected to server successfully')
   }
   ws.onerror = (event: any) => {
      console.log(event)
   }
}


function connect_to_ws() {
   return new WebSocket('wss://demo.piesocket.com/v3/channel_1?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self')
}


function customValidate(value: any) {
   if (!value || /profanity/gi.test(value)) {
      return false
   }
   return true
}

async function onSubmit(value: any, { resetForm }: { resetForm: () => void }) {
   try {
      ws.send(value.pm)
   } catch (e) {
      console.log(e)
      return
   }
   push_message(value.pm, true)
   if (value.pm === 'restart') {
      if (ws.readyState === state_ws.OPEN) {
         ws.close()
         ws = connect_to_ws()
         ws.onopen = () => {
            console.log('reconnected to server successfully')
         }
      }
   }
   ws.onmessage = function (event: any) {
      push_message(event.data, false)
   }

   resetForm()

}

function delete_message(id: number): void {
   messageStore().delete_message(id)
}

let delete_user = async () => {
   const du = usePromis(apiServices.deleteUser)
   await du.createPromis(user.value.id)
   if (du.result) {
      emit('delete_user', user.value.id)
   }
}

function hide_option(e: any): void {
   if (!document.getElementById('icon-option')?.contains(e.target)) {
      showOption.value = false
   }
}
function push_message(content: string, self: boolean): void {
   const chatRoom = document.querySelector('#messages')!
   messageStore().push_message(content, props.user_id, self)
   chatRoom.scrollTo(0, chatRoom.scrollHeight)
}


</script>

<style lang="scss" scoped>
#messages {
   height: calc(100vh - 158px);
}

.animate__animated {
   --animate-duration: .2s;
}
</style>