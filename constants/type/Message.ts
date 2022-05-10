interface Message {
   id : number,
   user_id : string | number,
   content : any,
   date : string,
   self : boolean
}
export default Message