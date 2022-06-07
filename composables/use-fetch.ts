import { ref } from 'vue'

const APISettings = {
   token: '',
   headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
   },
   baseURL: 'http://localhost:4000/',
}

export default async function useFetch(url: string, method: undefined | string = 'GET', body: any = null) {
   const data = ref(null)
   const error = ref(null)

   try {
      const cb = await fetch(APISettings.baseURL + url,
         {
            headers: APISettings.headers,
            body: body,
            method: method

         }
      )
      data.value = await cb.json()

   } catch (errors: any) {
      error.value = errors
   }
   return { data, error }
}