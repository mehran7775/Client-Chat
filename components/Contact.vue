<template>
   <li class="cursor-pointer bg-gray-800 p-3 rounded my-3 hover:bg-gray-900"
      @click="emit('trigger_conversation', user.id)">
      <div class="flex items-center">
         <img class="avatar" :src="user.thumbnail" :alt="`image of ${user.thumbnail}`">
         <span class="mr-2" v-text="user.name"></span>
      </div>
   </li>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import User from '@/constants/types/User'

//props

const props = defineProps<{
   user: User
}>()



//emits

const emit = defineEmits(['trigger_conversation'])

</script>
