<template>
  <NuxtLayout name="default">
    <ChatWindow :key="chatId" :chat-id="chatId" />
  </NuxtLayout>
</template>

<script setup>
import { computed } from 'vue'

definePageMeta({ layout: false })

const route = useRoute()

// GUID как строка
const chatId = computed(() => String(route.params.id))
</script>