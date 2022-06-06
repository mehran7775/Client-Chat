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

    function previewFile(file: File): string | undefined {
        if (!file.type.match('image')) return
        // let picReader = new FileReader()
        return URL.createObjectURL(file)
    }

    return { files, addFiles, removeFile, previewFile }
}

