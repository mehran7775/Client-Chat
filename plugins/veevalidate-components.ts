import { Form, Field, ErrorMessage } from 'vee-validate'

export default defineNuxtPlugin(( nuxtApp ) => {
   nuxtApp.vueApp.component('VForm', Form);
   nuxtApp.vueApp.component('VFeild', Field);
   nuxtApp.vueApp.component('VForm', ErrorMessage);
})