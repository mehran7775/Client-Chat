<template>
   <div class="relative z-10">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
      <div class="fixed z-10 inset-0 overflow-y-auto">
         <div class="flex items-center justify-center min-h-full p-4 sm:p-0">
            <div class="relative bg-gray-900 rounded-lg overflow-hidden shadow-xl my-8 sm:max-w-lg sm:w-full">
               <div class="bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <slot>
                  </slot>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
</script>