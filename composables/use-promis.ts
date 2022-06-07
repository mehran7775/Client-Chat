import { reactive } from "vue"

export default function usePromis(fn: any) {

  const createPromis = async (...args: any) => {
    data.loading = true
    data.error = null
    data.result = null;
    const fetchData = await fn(...args)
    data.result = fetchData.data
    data.error = fetchData.error
    data.loading = false
  }
  
  const data = reactive({
    result: null,
    loading: false as boolean,
    error: null,
    createPromis,
  })

  return data 
}
