interface Message {
   id : number,
   user_id : string | number,
   content?: any,
   img?: string,
   date : string,
   self : boolean
}
export default Message