import { watch } from 'vue'
import { defineStore } from 'pinia'
import Self from '@/constants/type/selfType'

export const userStore = defineStore({
   id: 'user',
   state: () => ({ 
    // user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : {} ,
    user: {},
    count: 5
   }),
   getters: {
     double: (state) => state.count * 2,
   },
   
   actions: {
     set_user(user : Self) {
      localStorage.setItem('user', JSON.stringify( user ))
      this.user = user
     },
     increment() {
       this.count++
     },
    //  new_item() {
       
    //  }
   }
})