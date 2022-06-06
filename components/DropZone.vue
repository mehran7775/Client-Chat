<template>
    <div :data-active="active" @dragenter.prevent="setActive" @dragover.prevent="setActive" @dragleave.prevent="setInactive" @drop.prevent="onDrop">
        <slot :dropZoneActive="active"></slot>
    </div>
</template>

<script setup lang="ts">

const emit = defineEmits(['files-dropped'])

let active = ref<boolean>(false)
let inActiveTimeout: any = null

function setActive(): void {
    active.value = true
    if(inActiveTimeout) clearTimeout(inActiveTimeout)
    
}

function setInactive(): void {
    active.value = false
     inActiveTimeout = setTimeout(() => {
        active.value = false
    }, 50)
}

function onDrop(e: any): void {
    setInactive() 
    emit('files-dropped', [...e.dataTransfer.files])
}

</script>
