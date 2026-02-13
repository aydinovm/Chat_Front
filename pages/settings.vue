<template>
  <NuxtLayout name="default">
    <div class="h-screen overflow-y-auto bg-gray-50">
      <div class="max-w-4xl mx-auto px-6 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Настройки</h1>
          <p class="text-gray-500 mt-1">Управление профилем и безопасностью</p>
        </div>

        <!-- Success message -->
        <div v-if="successMessage" class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-green-700 font-medium">{{ successMessage }}</span>
        </div>

        <!-- Profile Section -->
        <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div class="flex items-center gap-2 mb-6">
            <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h2 class="text-xl font-semibold text-gray-900">Профиль</h2>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ФИО</label>
              <input
                type="text"
                v-model="profileForm.name"
                :class="[
                  'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2',
                  profileErrors.name ? 'border-red-300 focus:ring-red-600' : 'border-gray-300 focus:ring-green-600'
                ]"
              />
              <p v-if="profileErrors.name" class="text-red-500 text-xs mt-1">{{ profileErrors.name }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                v-model="profileForm.email"
                :class="[
                  'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2',
                  profileErrors.email ? 'border-red-300 focus:ring-red-600' : 'border-gray-300 focus:ring-green-600'
                ]"
              />
              <p v-if="profileErrors.email" class="text-red-500 text-xs mt-1">{{ profileErrors.email }}</p>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button 
              @click="saveProfile"
              class="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition font-medium"
            >
              Сохранить профиль
            </button>
          </div>
        </div>

        <!-- Security Section -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center gap-2 mb-6">
            <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 class="text-xl font-semibold text-gray-900">Смена пароля</h2>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Текущий пароль <span class="text-red-500">*</span>
              </label>
              <input
                type="password"
                v-model="passwordForm.currentPassword"
                placeholder="Введите текущий пароль"
                :class="[
                  'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2',
                  passwordErrors.currentPassword ? 'border-red-300 focus:ring-red-600' : 'border-gray-300 focus:ring-green-600'
                ]"
              />
              <p v-if="passwordErrors.currentPassword" class="text-red-500 text-xs mt-1">{{ passwordErrors.currentPassword }}</p>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Новый пароль <span class="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  v-model="passwordForm.newPassword"
                  placeholder="Минимум 8 символов"
                  :class="[
                    'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2',
                    passwordErrors.newPassword ? 'border-red-300 focus:ring-red-600' : 'border-gray-300 focus:ring-green-600'
                  ]"
                />
                <p v-if="passwordErrors.newPassword" class="text-red-500 text-xs mt-1">{{ passwordErrors.newPassword }}</p>
                <p v-else class="text-xs text-gray-500 mt-1">Минимум 8 символов, включая цифры и буквы</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Подтвердите пароль <span class="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  v-model="passwordForm.confirmPassword"
                  placeholder="Повторите новый пароль"
                  :class="[
                    'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2',
                    passwordErrors.confirmPassword ? 'border-red-300 focus:ring-red-600' : 'border-gray-300 focus:ring-green-600'
                  ]"
                />
                <p v-if="passwordErrors.confirmPassword" class="text-red-500 text-xs mt-1">{{ passwordErrors.confirmPassword }}</p>
              </div>
            </div>

            <!-- Password strength indicator -->
            <div v-if="passwordForm.newPassword" class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Надёжность пароля:</span>
                <span 
                  :class="[
                    'font-medium',
                    passwordStrength === 'weak' ? 'text-red-600' :
                    passwordStrength === 'medium' ? 'text-amber-600' :
                    'text-green-600'
                  ]"
                >
                  {{ 
                    passwordStrength === 'weak' ? 'Слабый' :
                    passwordStrength === 'medium' ? 'Средний' :
                    'Надёжный'
                  }}
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  :class="[
                    'h-2 rounded-full transition-all',
                    passwordStrength === 'weak' ? 'bg-red-500 w-1/3' :
                    passwordStrength === 'medium' ? 'bg-amber-500 w-2/3' :
                    'bg-green-500 w-full'
                  ]"
                ></div>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button 
              @click="changePassword"
              class="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition font-medium"
            >
              Изменить пароль
            </button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  layout: false
})

const successMessage = ref('')

// Profile form
const profileForm = ref({
  name: 'Иван Петров',
  email: 'ivan@company.com'
})

const profileErrors = ref({
  name: '',
  email: ''
})

// Password form
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordErrors = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Password strength
const passwordStrength = computed(() => {
  const password = passwordForm.value.newPassword
  if (!password) return 'weak'
  
  let strength = 0
  
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^a-zA-Z\d]/.test(password)) strength++
  
  if (strength <= 2) return 'weak'
  if (strength <= 4) return 'medium'
  return 'strong'
})

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const validatePassword = (password) => {
  return password.length >= 8 && /\d/.test(password) && /[a-zA-Z]/.test(password)
}

const saveProfile = () => {
  profileErrors.value = {
    name: '',
    email: ''
  }

  let isValid = true

  if (!profileForm.value.name.trim()) {
    profileErrors.value.name = 'Введите ФИО'
    isValid = false
  }

  if (!profileForm.value.email.trim()) {
    profileErrors.value.email = 'Введите email'
    isValid = false
  } else if (!validateEmail(profileForm.value.email)) {
    profileErrors.value.email = 'Некорректный email'
    isValid = false
  }

  if (!isValid) return

  console.log('Сохранение профиля:', profileForm.value)
  // TODO: API call

  successMessage.value = 'Профиль успешно обновлён'
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}

const changePassword = () => {
  passwordErrors.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }

  let isValid = true

  if (!passwordForm.value.currentPassword) {
    passwordErrors.value.currentPassword = 'Введите текущий пароль'
    isValid = false
  }

  if (!passwordForm.value.newPassword) {
    passwordErrors.value.newPassword = 'Введите новый пароль'
    isValid = false
  } else if (!validatePassword(passwordForm.value.newPassword)) {
    passwordErrors.value.newPassword = 'Пароль должен содержать минимум 8 символов, включая цифры и буквы'
    isValid = false
  }

  if (!passwordForm.value.confirmPassword) {
    passwordErrors.value.confirmPassword = 'Подтвердите пароль'
    isValid = false
  } else if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordErrors.value.confirmPassword = 'Пароли не совпадают'
    isValid = false
  }

  if (!isValid) return

  console.log('Смена пароля')
  // TODO: API call

  // Clear form
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }

  successMessage.value = 'Пароль успешно изменён'
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}
</script>