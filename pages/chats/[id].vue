<template>
  <NuxtLayout name="default">
    <ChatWindow :key="chatId" :chat-id="chatId" />
  </NuxtLayout>
</template>

<script setup>
const route = useRoute()
const chatId = computed(() => parseInt(route.params.id))

definePageMeta({
  layout: false
})
</script>