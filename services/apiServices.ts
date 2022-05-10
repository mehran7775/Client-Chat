import useFetch from "@/composables/use-fetch"
export default {
   getUsers() {
      return useFetch('users')
   },
   getMessages(user_id: string | number) {
      return useFetch(`messages/?user_id=${encodeURIComponent( user_id )}`)
   },
   getUser(user_id: string | number) {
      return useFetch(`users/?id=${encodeURIComponent( user_id )}`)
   },
   sendMessage(user_id: string | number, message: any) {
      const json = JSON.stringify({
         user_id: user_id,
         content: message,
         self: true,
         date: "1401/01/28"
      })
      return useFetch(`messages`, 'POST', json)
   },
   deleteMessage( id : string | number ) {
      return useFetch(`messages/${id}`, 'DELETE')
   },
   deleteUser(id : string | number) {
      return useFetch(`users/${id}`, 'DELETE')
   }

}






