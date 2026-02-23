<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
      <!-- Logo -->
      <div class="flex items-center gap-3 mb-8">
        <div class="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
        </div>
        <div>
          <h1 class="text-xl font-bold text-gray-900">Система Чатов</h1>
          <p class="text-xs text-gray-500">Корпоративная платформа</p>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-gray-900 mb-1">Вход в систему</h2>
      <p class="text-gray-500 mb-6 text-sm">Введите ваши учётные данные</p>

      <!-- Error -->
      <div v-if="error" class="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
        {{ error }}
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Имя пользователя</label>
          <input
            v-model="username"
            type="text"
            placeholder="Введите логин"
            @keydown.enter="handleLogin"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
          <input
            v-model="password"
            type="password"
            placeholder="Введите пароль"
            @keydown.enter="handleLogin"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        <button
          @click="handleLogin"
          :disabled="isLoading || !username || !password"
          class="w-full py-2.5 bg-green-700 text-white rounded-lg hover:bg-green-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          {{ isLoading ? 'Вход...' : 'Войти' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })

const authStore = useAuthStore()
const username = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  if (!username.value || !password.value) return
  isLoading.value = true
  error.value = ''

  const result = await authStore.login(username.value, password.value)

  if (result.success) {
    await navigateTo('/chats')
  } else {
    error.value = result.error || 'Неверный логин или пароль'
  }

  isLoading.value = false
}
</script>