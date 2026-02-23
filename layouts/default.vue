<template>
  <div class="flex h-screen overflow-hidden bg-gray-50">
    <Navigation />

    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
    ></div>

    <Sidebar
      v-if="isChatsPage"
      :is-open="sidebarOpen"
      :current-chat-id="currentChatId"
      @toggle-sidebar="toggleSidebar"
    />

    <main class="flex-1 overflow-hidden">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const route = useRoute()
const authStore = useAuthStore()
const sidebarOpen = ref(false)

// Redirect to login if not authenticated
onMounted(() => {
  if (!authStore.isAuthenticated) {
    navigateTo('/login')
  }
})

const isChatsPage = computed(() => route.path.startsWith('/chats'))

const currentChatId = computed(() => {
  return route.params.id ? route.params.id : null
})

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

watch(() => route.params.id, () => {
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    sidebarOpen.value = false
  }
})
</script>