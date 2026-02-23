<template>
  <NuxtLayout name="default">
    <div class="h-screen overflow-y-auto bg-gray-50">
      <div class="max-w-4xl mx-auto px-6 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Настройки</h1>
          <p class="text-gray-500 mt-1">Управление профилем и безопасностью</p>
        </div>

        <div v-if="successMessage" class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-green-700 font-medium">{{ successMessage }}</span>
        </div>

        <!-- Профиль (только просмотр, т.к. апи смены профиля нет — только пароль) -->
        <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Профиль</h2>
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-semibold">
              {{ userInitials }}
            </div>
            <div>
              <p class="text-lg font-semibold text-gray-900">{{ authStore.currentUser?.fullName }}</p>
              <p class="text-gray-500">@{{ authStore.currentUser?.username }}</p>
              <p class="text-sm text-gray-500 mt-1">{{ authStore.currentUser?.departmentName }}</p>
              <span :class="['inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full', roleClass]">{{ authStore.userRole }}</span>
            </div>
          </div>
        </div>

        <!-- Смена пароля -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Смена пароля</h2>

          <div v-if="passwordError" class="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{{ passwordError }}</div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Текущий пароль <span class="text-red-500">*</span></label>
              <input type="password" v-model="passwordForm.currentPassword" placeholder="Введите текущий пароль"
                :class="['w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2', errors.currentPassword ? 'border-red-300 focus:ring-red-600' : 'border-gray-300 focus:ring-green-600']" />
              <p v-if="errors.currentPassword" class="text-red-500 text-xs mt-1">{{ errors.currentPassword }}</p>
            </div>
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Новый пароль <span class="text-red-500">*</span></label>
                <input type="password" v-model="passwordForm.newPassword" placeholder="Минимум 8 символов"
                  :class="['w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2', errors.newPassword ? 'border-red-300 focus:ring-red-600' : 'border-gray-300 focus:ring-green-600']" />
                <p v-if="errors.newPassword" class="text-red-500 text-xs mt-1">{{ errors.newPassword }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Подтвердите пароль <span class="text-red-500">*</span></label>
                <input type="password" v-model="passwordForm.confirmPassword" placeholder="Повторите пароль"
                  :class="['w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2', errors.confirmPassword ? 'border-red-300 focus:ring-red-600' : 'border-gray-300 focus:ring-green-600']" />
                <p v-if="errors.confirmPassword" class="text-red-500 text-xs mt-1">{{ errors.confirmPassword }}</p>
              </div>
            </div>

            <!-- Strength -->
            <div v-if="passwordForm.newPassword" class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Надёжность:</span>
                <span :class="strengthColor">{{ strengthLabel }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div :class="['h-2 rounded-full transition-all', strengthBar]"></div>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button @click="changePassword" :disabled="isSaving" class="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition font-medium disabled:opacity-50">
              {{ isSaving ? 'Сохранение...' : 'Изменить пароль' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({ layout: false })

const authStore = useAuthStore()
const usersStore = useUsersStore()

const successMessage = ref('')
const passwordError = ref('')
const isSaving = ref(false)

const passwordForm = ref({ currentPassword: '', newPassword: '', confirmPassword: '' })
const errors = ref({ currentPassword: '', newPassword: '', confirmPassword: '' })

const userInitials = computed(() => {
  const name = authStore.currentUser?.fullName || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'
})

const roleClass = computed(() => {
  const r = authStore.userRole
  if (r === 'Супер-администратор') return 'text-purple-700 bg-purple-100'
  if (r === 'Администратор департамента') return 'text-blue-700 bg-blue-100'
  return 'text-green-700 bg-green-100'
})

const passwordStrength = computed(() => {
  const p = passwordForm.value.newPassword
  if (!p) return 0
  let s = 0
  if (p.length >= 8) s++
  if (p.length >= 12) s++
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++
  if (/\d/.test(p)) s++
  if (/[^a-zA-Z\d]/.test(p)) s++
  return s
})

const strengthLabel = computed(() => ['', 'Слабый', 'Слабый', 'Средний', 'Надёжный', 'Надёжный'][passwordStrength.value] || '')
const strengthColor = computed(() => passwordStrength.value <= 2 ? 'text-red-600 font-medium' : passwordStrength.value <= 3 ? 'text-amber-600 font-medium' : 'text-green-600 font-medium')
const strengthBar = computed(() => {
  const bars = ['', 'bg-red-500 w-1/3', 'bg-red-500 w-1/3', 'bg-amber-500 w-2/3', 'bg-green-500 w-full', 'bg-green-500 w-full']
  return bars[passwordStrength.value] || ''
})

const changePassword = async () => {
  errors.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  passwordError.value = ''
  let valid = true

  if (!passwordForm.value.currentPassword) { errors.value.currentPassword = 'Введите текущий пароль'; valid = false }
  if (!passwordForm.value.newPassword) { errors.value.newPassword = 'Введите новый пароль'; valid = false }
  else if (passwordForm.value.newPassword.length < 8) { errors.value.newPassword = 'Минимум 8 символов'; valid = false }
  if (!passwordForm.value.confirmPassword) { errors.value.confirmPassword = 'Подтвердите пароль'; valid = false }
  else if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) { errors.value.confirmPassword = 'Пароли не совпадают'; valid = false }

  if (!valid) return

  isSaving.value = true
  const { error } = await usersStore.changePassword(passwordForm.value.currentPassword, passwordForm.value.newPassword)
  if (error) {
    passwordError.value = error
  } else {
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
    successMessage.value = 'Пароль успешно изменён'
    setTimeout(() => { successMessage.value = '' }, 3000)
  }
  isSaving.value = false
}
</script>