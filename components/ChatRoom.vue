<template>
   <section id="header" class="bg-gray-800 py-5 px-2 shadow-2xl sticky top-0 z-0">
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
         <div class="relative flex justify-center items-center w-100 md:w-3/4 m-auto">
            <v-field name="pm" type="text" :rules="customValidate"
               class="w-5/6 md:w-2/3 bg-gray-800 text-white rounded-r-2xl rounded-bl-sm rounded-tl-2xl py-2 px-3 border-gray-800">
            </v-field>
            <input type="file" class="hidden" ref="file" id="input-file" @change="uploadFile">
            <button v-if="!validInput" @click="selectFile()" class="absolute icon-upload">
               <svg class="fill-gray-300 hover:fill-gray-100 " xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="32" height="32" viewBox="0 0 24 24">
                  <path d="M7.5,18A5.5,5.5 0 0,1 2,12.5A5.5,5.5 0 0,1 7.5,7H18A4,4 0 0,1 22,11A4,4 0 0,1 18,15H9.5A2.5,2.5 0 0,1 7,12.5A2.5,2.5 0 0,1 9.5,10H17V11.5H9.5A1,1 0 0,0 8.5,12.5A1,1 0 0,0 9.5,13.5H18A2.5,2.5 0 0,0 20.5,11A2.5,2.5 0 0,0 18,8.5H7.5A4,4 0 0,0 3.5,12.5A4,4 0 0,0 7.5,16.5H17V18H7.5Z" />
               </svg>
            </button>
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
import MessagePack from 'what-the-pack'
import { Buffer } from 'buffer'
import { createInputFiles } from 'typescript'

//props

let props = defineProps<{
   user_id: UserId,
   back: () => void
}>()



//emits

const emit = defineEmits(['delete_user'])


//data

let user = reactive({
   value: {} as User
})

let showOption = ref<boolean>(false)

let ws = ref<any>(null)

const { encode, decode, register } = MessagePack.initialize(2 ^ 20)

let validInput = ref<string>('')


//enum

enum state_ws {
   OPEN = 1,
   CLOSE = 2
}


//computed

const messages = computed(() => {
   return messageStore().items.filter(item => item.user_id == props.user_id)
})



//wathchs

watch(() => props.user_id, async () => {
   if (ws.readyState === state_ws.OPEN) ws.close()
   await get_user()
   test_websocket()
   onMessage()
})




await get_user()
test_websocket()
onMessage()


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
      ws.binaryType = 'arraybuffer';
      console.log('connected to server successfully')
   }
   ws.onerror = (event: any) => {
      console.log(event)
   }
}


function connect_to_ws() {
   // return new WebSocket('wss://demo.piesocket.com/v3/channel_1?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self')
   return new WebSocket('ws://localhost:8080')
}


function customValidate(value: any) {
   validInput.value = value
   if (!value || /profanity/gi.test(value)) {
      return false
   }
   return true
}

async function onSubmit(value: any, { resetForm }: { resetForm: () => void }) {
   try {
      register('pm')
      ws.send(encode(value))
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
            ws.binaryType = 'arraybuffer'
            console.log('reconnected to server successfully')
         }
      }
   }
   onMessage()

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

function onMessage() {
    ws.onmessage = function (event: any) {
      let pm = null
      if(event.data instanceof ArrayBuffer) {
         pm = decode(Buffer.from(event.data)).pm
      }else {
         pm = event.data
      }
      push_message(pm, false)
   }
}


function selectFile() {
  document.getElementById('input-file')!.click()
}


function uploadFile(event: any) {
   console.log(event)
      // let reader = new FileReader()
   // reader.addEventListener('load',()=>{
   //    img.preview= reader.result,
   //    this.images.push(img)
   // })
   // reader.readAsDataURL(selectedFiles[i]);
}

</script>

<style lang="scss" scoped>

#messages {
   height: calc(100vh - 158px);
}

.animate__animated {
   --animate-duration: .2s;
}

.icon-upload {
  left: 18%;
  @include xsmall {
     left: 16%;
  }
  @include small {
     left: 14%;
  }
  @include medium {
     left: 25%;
  }
  @include large {
     left: 22%;
  }
}

</style>