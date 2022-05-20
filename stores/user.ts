import { defineStore } from 'pinia'
import User from '@/constants/types/User'


const userStore = defineStore({
   id: 'user',
   state: () => ({
      items: [] as User[]
   }),
   getters: {
      getUserById: (state) => {
         return (id: number | string) => state.items.find((item) => item.id === id)
      }
   },

   actions: {
      delete_user(id: string | number): boolean {
         const user = this.getUserById(id)
         if (user) {
            const index = this.items.indexOf(user as User) as number
            if (index > -1) {
               this.items.splice(index, 1)
               return true
            }
         }
         return false
      }
   }
})
export default userStore