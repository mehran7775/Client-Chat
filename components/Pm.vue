<template>
   <li onmousedown="return false" class="w-full" :id="`pm-${props.message.id}`">
      <div :class="['my-2 relative', message.self ? 'float-right' : 'float-left']"
         @contextmenu.prevent="showOption = !showOption" @keydown="showOption = !showOption" 
      >
         <div v-if="!message.img"
          :class="['text-white pm rounded-t rounded-r-md rounded-b-lg rounded-bl-2xl px-4 pt-4 pb-2', message.self ? 'bg-blue-700' : 'bg-gray-700']">
            <p v-text="message.content" class="break-words"></p>
             <div><small v-text="props.message.date" class="text-gray-400"></small></div>
         </div>
         <div v-else>
            <img :src="message.img" width="150" :alt="`image of ${message.img}`" class="border border-gray-800 shadow-md shadow-gray-900">
         </div>
         <transition
         enter-active-class="animate__animated animate__zoomIn"
         leave-active-class="animate__animated animate__zoomOut"
         >
            <div v-if="showOption" :class="['absolute bg-gray-700 rounded-md top-0 w-16 p-1', message.self ? '-left-20' : '-right-20 ']">
               <ul class="w-full">
                  <li class="hover:bg-gray-600 text-white">
                     <button class="w-full py-2 px-1 hover:rounded-md" @click="delete_message(message.id)">حذف</button>
                  </li>
               </ul>
            </div>
         </transition>
      </div>
   </li>
</template>

<script setup lang="ts">

import { ref, defineProps, onMounted, onUnmounted, defineEmits } from 'vue'
import usePromis from '@/composables/use-promis'
import apiServices from '@/services/apiServices'
import Message from '@/constants/types/Message'

//props

const props = defineProps<{
   message : Message
}>()



//emits

const emit = defineEmits(['delete_message'])



//data

let showOption = ref<boolean>(false)




//hooks

onMounted(()=> {
   document.addEventListener('click', (e)=> {
      hide_option(e)
   })
    document.addEventListener('contextmenu', (e)=> {
      hide_option(e)
   })
})
onUnmounted(() => {
   document.removeEventListener('click',hide_option)
   document.removeEventListener('contextmenu',hide_option)
})




//methods

function show_option() : void {
   showOption.value = !showOption.value
}

function hide_option(e: any): void {
   if(!document.getElementById(`pm-${props.message.id}`)?.contains(e.target)){
      showOption.value = false
   }
}
async function delete_message(id: number): Promise<void> {
   const deleteMessage = usePromis( apiServices.deleteMessage )
   await deleteMessage.createPromis( id )
   if(deleteMessage.result) {
      emit('delete_message', id)
   }
}
</script>

<style scoped lang="scss">
.pm {
   max-width: 250px;
}
.animate__animated {
  --animate-duration: .2s;
}
</style>