<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
// Restore session from localStorage on app start
const authStore = useAuthStore()
authStore.restoreSession()
</script>