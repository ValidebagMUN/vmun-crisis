<template>
    <Topbar />
    <ClientOnly>
        <EurasiaMap />
    </ClientOnly>
</template>

<script setup lang="ts">
useHead({
    bodyAttrs: {
        class: 'bg-[#5B7080] font-garamond'
    }
})
</script>

<style scoped>

</style>