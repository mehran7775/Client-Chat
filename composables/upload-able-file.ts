import { ref } from 'vue'
import UploadableFile from '~~/constants/types/UploadableFile'

export default function () {
    let files = ref<UploadableFile[]>([])

    function addFiles(newFiles: File[]): void {
        let newUploadableFiles = [...newFiles]
            .map((file) => new UploadableFile(file))
            .filter((file) => !fileExists(file.id))
        files.value = files.value.concat(newUploadableFiles)
    }

    function fileExists(otherId: string) {
        return files.value.some(({ id }) => id === otherId)
    }

    function removeFile(file: UploadableFile): void {
        const index = files.value.indexOf(file)

        if (index > -1) files.value.splice(index, 1)
    }

    // function consume(stream: any, total = 0) {
    //     while (stream.state === "readable") {
    //       let data = stream.read()
    //       total += data.byteLength;
    //       console.log("received " + data.byteLength + " bytes (" + total + " bytes in total).")
    //     }
    //     if (stream.state === "waiting") {
    //       stream.ready.then(() => consume(stream, total))
    //     }
    //     return stream.closed
    //   }

    return { files, addFiles, removeFile }
}

