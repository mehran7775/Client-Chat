import { ref } from 'vue'

//progres bar for upload on client

export default function () {
    const reader = new FileReader()
    const fileUrl = ref<string | ArrayBuffer | null>(null)
    const totalSize = ref<number>(0)
    const currentProgress = ref<any>('0%')

    function handleEvent(event: any) {
        if (['loadend', 'load'].includes(event.type)) {
            console.log('finished loading file');
            currentProgress.value = 'Finished loading file';
            fileUrl.value = reader.result;
        }
        if (event.type === 'progress') {
            currentProgress.value = `${(event.loaded.valueOf() / totalSize.value).toFixed(2) * 100}%`;
            console.log('Progress: ', currentProgress.value);
            console.log('Bytes transferred: ', event.loaded, 'bytes');
        }
        if (event.type === 'loadstart') {
            totalSize.value = event.total;
        }
    }

    function addListeners(reader: FileReader) {
        reader.addEventListener('loadstart', handleEvent);
        reader.addEventListener('load', handleEvent);
        reader.addEventListener('loadend', handleEvent);
        reader.addEventListener('progress', handleEvent);
        reader.addEventListener('error', handleEvent);
        reader.addEventListener('abort', handleEvent);
        //dont do this, make diffrent functions for every 
        //event listener please, your code's readability will be 100% better, 
        //i am on a bus rn, but will make it prettier later :D
    }

    function handleSelected(e: any) {
        console.log(e);
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            addListeners(reader);
            reader.readAsDataURL(selectedFile);
        }
    }

    return { fileUrl, totalSize, currentProgress }
}