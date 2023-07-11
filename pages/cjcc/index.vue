<template>
    <Topbar />
    <ClientOnly>
        <TurkeyMap />
    </ClientOnly>
</template>

<script setup lang="ts">
useHead({
    bodyAttrs: {
        class: 'bg-[#5B7080] font-serif'
    }
})
</script>

<style scoped>

</style>