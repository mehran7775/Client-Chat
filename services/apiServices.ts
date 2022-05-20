import useFetch from "@/composables/use-fetch"
import Message  from "@/constants/types/Message"

export default {
   getUsers() {
      return useFetch('users')
   },
   addUser(user: any) {
      return useFetch('users', 'POST', user)
   },
   getUser(user_id: string | number) {
      return useFetch(`users/?id=${encodeURIComponent( user_id )}`)
   },
   sendMessage(data: Message) {
      return useFetch(`messages`, 'POST', data)
   },
   deleteMessage( id : string | number ) {
      return useFetch(`messages/${id}`, 'DELETE')
   },
   deleteUser(id : string | number) {
      return useFetch(`users/${id}`, 'DELETE')
   }

}






