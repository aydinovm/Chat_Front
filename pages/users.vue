<template>
  <NuxtLayout name="default">
    <div class="h-screen overflow-y-auto bg-gray-50">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Пользователи</h1>
            <p class="text-gray-500 mt-1">Управление сотрудниками и правами доступа</p>
          </div>
          <button 
            @click="showAddUserModal = true"
            class="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Добавить пользователя
          </button>
        </div>

        <!-- Search -->
        <div class="mb-6">
          <div class="relative">
            <input
              type="text"
              placeholder="Поиск по имени или email..."
              v-model="searchQuery"
              class="w-full px-4 py-3 pl-10 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <svg class="w-5 h-5 absolute left-3 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Users Table -->
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Пользователь
                </th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Департамент
                </th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Роль
                </th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div 
                      class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                      :class="user.avatarColor"
                    >
                      {{ user.initials }}
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900">{{ user.name }}</div>
                      <div class="text-sm text-gray-500">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-gray-700">
                  {{ user.department }}
                </td>
                <td class="px-6 py-4">
                  <span 
                    class="px-3 py-1 rounded-full text-sm font-medium"
                    :class="user.role === 'Администратор' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'"
                  >
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span 
                    class="px-3 py-1 rounded-full text-sm font-medium"
                    :class="user.online ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'"
                  >
                    {{ user.online ? 'В сети' : 'Не в сети' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add User Modal -->
    <div 
      v-if="showAddUserModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showAddUserModal = false"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-900">Новый пользователь</h2>
          <button 
            @click="showAddUserModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ФИО</label>
            <input
              type="text"
              v-model="newUser.name"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              v-model="newUser.email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Пароль</label>
            <input
              type="password"
              v-model="newUser.password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Департамент</label>
              <select
                v-model="newUser.department"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="">Выберите...</option>
                <option value="IT Отдел">IT Отдел</option>
                <option value="Бухгалтерия">Бухгалтерия</option>
                <option value="HR">HR</option>
                <option value="Маркетинг">Маркетинг</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Роль</label>
              <select
                v-model="newUser.role"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="Сотрудник">Сотрудник</option>
                <option value="Администратор">Администратор</option>
              </select>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button
            @click="showAddUserModal = false"
            class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Отмена
          </button>
          <button
            @click="addUser"
            class="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
          >
            Сохранить
          </button>
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

const searchQuery = ref('')
const showAddUserModal = ref(false)

const newUser = ref({
  name: '',
  email: '',
  password: '',
  department: '',
  role: 'Сотрудник'
})

const users = ref([
  {
    id: 1,
    name: 'Иван Петров',
    email: 'ivan@company.com',
    department: 'IT Отдел',
    role: 'Администратор',
    online: true,
    initials: 'ИП',
    avatarColor: 'bg-blue-500'
  },
  {
    id: 2,
    name: 'Анна Сидорова',
    email: 'anna@company.com',
    department: 'IT Отдел',
    role: 'Сотрудник',
    online: false,
    initials: 'АС',
    avatarColor: 'bg-blue-500'
  },
  {
    id: 3,
    name: 'Елена Волкова',
    email: 'elena@company.com',
    department: 'Бухгалтерия',
    role: 'Сотрудник',
    online: true,
    initials: 'ЕВ',
    avatarColor: 'bg-blue-500'
  },
  {
    id: 4,
    name: 'Дмитрий Козлов',
    email: 'dmitry@company.com',
    department: 'HR',
    role: 'Сотрудник',
    online: false,
    initials: 'ДК',
    avatarColor: 'bg-gray-400'
  }
])

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  
  return users.value.filter(user => {
    return user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
           user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

const addUser = () => {
  // Здесь будет логика добавления пользователя
  console.log('Adding user:', newUser.value)
  showAddUserModal.value = false
  newUser.value = {
    name: '',
    email: '',
    password: '',
    department: '',
    role: 'Сотрудник'
  }
}
</script>