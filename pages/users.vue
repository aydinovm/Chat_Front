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
            @click="openAddUserModal"
            class="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Добавить пользователя
          </button>
        </div>

        <!-- Filters -->
        <div class="flex items-center gap-4 mb-6">
          <!-- Search -->
          <div class="flex-1 relative">
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

          <!-- Department filter -->
          <select 
            v-model="departmentFilter"
            class="px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="">Все департаменты</option>
            <option value="IT Отдел">IT Отдел</option>
            <option value="Бухгалтерия">Бухгалтерия</option>
            <option value="HR">HR</option>
            <option value="Маркетинг">Маркетинг</option>
          </select>

          <!-- Role filter -->
          <select 
            v-model="roleFilter"
            class="px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="">Все роли</option>
            <option value="Супер-администратор">Супер-администратор</option>
            <option value="Администратор департамента">Администратор департамента</option>
            <option value="Сотрудник">Сотрудник</option>
          </select>
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
                    <div class="relative">
                      <div 
                        class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                        :class="user.avatarColor"
                      >
                        {{ user.initials }}
                      </div>
                      <span
                        v-if="user.online"
                        class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
                      ></span>
                      <span
                        v-else
                        class="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 border-2 border-white rounded-full"
                      ></span>
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
                    :class="getRoleBadgeColor(user.role)"
                  >
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span 
                    class="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 w-fit"
                    :class="user.online ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'"
                  >
                    <span 
                      :class="[
                        'w-2 h-2 rounded-full',
                        user.online ? 'bg-green-500' : 'bg-gray-400'
                      ]"
                    ></span>
                    {{ user.online ? 'В сети' : 'Не в сети' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button 
                      @click="editUser(user)"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Редактировать"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      @click="deleteUser(user)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Удалить"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Empty state -->
          <div v-if="filteredUsers.length === 0" class="text-center py-12">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 class="text-lg font-semibold text-gray-700 mb-1">Пользователи не найдены</h3>
            <p class="text-sm text-gray-500">Попробуйте изменить параметры поиска или фильтры</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit User Modal -->
    <div 
      v-if="showAddUserModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-900">
            {{ editingUser ? 'Редактировать пользователя' : 'Новый пользователь' }}
          </h2>
          <button 
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ФИО <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              v-model="userForm.name"
              placeholder="Иван Петров"
              :class="[
                'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2',
                errors.name ? 'border-red-300 focus:ring-red-600' : 'border-gray-300 focus:ring-green-600'
              ]"
            />
            <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              type="email"
              v-model="userForm.email"
              placeholder="ivan@company.com"
              :class="[
                'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2',
                errors.email ? 'border-red-300 focus:ring-red-600' : 'border-gray-300 focus:ring-green-600'
              ]"
            />
            <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
          </div>

          <div v-if="!editingUser">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Пароль <span class="text-red-500">*</span>
            </label>
            <input
              type="password"
              v-model="userForm.password"
              placeholder="Минимум 8 символов"
              :class="[
                'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2',
                errors.password ? 'border-red-300 focus:ring-red-600' : 'border-gray-300 focus:ring-green-600'
              ]"
            />
            <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</p>
            <p v-else class="text-xs text-gray-500 mt-1">Минимум 8 символов, включая цифры и буквы</p>
          </div>

          <div v-if="!editingUser">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Подтверждение пароля <span class="text-red-500">*</span>
            </label>
            <input
              type="password"
              v-model="userForm.passwordConfirm"
              placeholder="Повторите пароль"
              :class="[
                'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2',
                errors.passwordConfirm ? 'border-red-300 focus:ring-red-600' : 'border-gray-300 focus:ring-green-600'
              ]"
            />
            <p v-if="errors.passwordConfirm" class="text-red-500 text-xs mt-1">{{ errors.passwordConfirm }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Департамент <span class="text-red-500">*</span>
              </label>
              <select
                v-model="userForm.department"
                :class="[
                  'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2',
                  errors.department ? 'border-red-300 focus:ring-red-600' : 'border-gray-300 focus:ring-green-600'
                ]"
              >
                <option value="">Выберите...</option>
                <option value="IT Отдел">IT Отдел</option>
                <option value="Бухгалтерия">Бухгалтерия</option>
                <option value="HR">HR</option>
                <option value="Маркетинг">Маркетинг</option>
              </select>
              <p v-if="errors.department" class="text-red-500 text-xs mt-1">{{ errors.department }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Роль <span class="text-red-500">*</span>
              </label>
              <select
                v-model="userForm.role"
                :class="[
                  'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2',
                  errors.role ? 'border-red-300 focus:ring-red-600' : 'border-gray-300 focus:ring-green-600'
                ]"
              >
                <option value="">Выберите...</option>
                <option value="Сотрудник">Сотрудник</option>
                <option value="Администратор департамента">Администратор департамента</option>
                <option value="Супер-администратор">Супер-администратор</option>
              </select>
              <p v-if="errors.role" class="text-red-500 text-xs mt-1">{{ errors.role }}</p>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            @click="closeModal"
            class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Отмена
          </button>
          <button
            @click="saveUser"
            class="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
          >
            {{ editingUser ? 'Сохранить' : 'Создать' }}
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
const departmentFilter = ref('')
const roleFilter = ref('')
const showAddUserModal = ref(false)
const editingUser = ref(null)

const userForm = ref({
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  department: '',
  role: ''
})

const errors = ref({
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  department: '',
  role: ''
})

const users = ref([
  {
    id: 1,
    name: 'Иван Петров',
    email: 'ivan@company.com',
    department: 'IT Отдел',
    role: 'Администратор департамента',
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
    avatarColor: 'bg-purple-500'
  },
  {
    id: 3,
    name: 'Елена Волкова',
    email: 'elena@company.com',
    department: 'Бухгалтерия',
    role: 'Сотрудник',
    online: true,
    initials: 'ЕВ',
    avatarColor: 'bg-green-500'
  },
  {
    id: 4,
    name: 'Дмитрий Козлов',
    email: 'dmitry@company.com',
    department: 'HR',
    role: 'Администратор департамента',
    online: false,
    initials: 'ДК',
    avatarColor: 'bg-orange-500'
  },
  {
    id: 5,
    name: 'Сергей Новиков',
    email: 'sergey@company.com',
    department: 'IT Отдел',
    role: 'Супер-администратор',
    online: true,
    initials: 'СН',
    avatarColor: 'bg-red-500'
  }
])

const filteredUsers = computed(() => {
  let filtered = users.value

  // Search
  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    )
  }

  // Department filter
  if (departmentFilter.value) {
    filtered = filtered.filter(user => user.department === departmentFilter.value)
  }

  // Role filter
  if (roleFilter.value) {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }

  return filtered
})

const getRoleBadgeColor = (role) => {
  switch(role) {
    case 'Супер-администратор':
      return 'bg-purple-100 text-purple-700'
    case 'Администратор департамента':
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-green-100 text-green-700'
  }
}

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const validatePassword = (password) => {
  return password.length >= 8 && /\d/.test(password) && /[a-zA-Z]/.test(password)
}

const validateForm = () => {
  errors.value = {
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    department: '',
    role: ''
  }

  let isValid = true

  if (!userForm.value.name.trim()) {
    errors.value.name = 'Введите ФИО'
    isValid = false
  }

  if (!userForm.value.email.trim()) {
    errors.value.email = 'Введите email'
    isValid = false
  } else if (!validateEmail(userForm.value.email)) {
    errors.value.email = 'Некорректный email'
    isValid = false
  }

  if (!editingUser.value) {
    if (!userForm.value.password) {
      errors.value.password = 'Введите пароль'
      isValid = false
    } else if (!validatePassword(userForm.value.password)) {
      errors.value.password = 'Пароль должен содержать минимум 8 символов, включая цифры и буквы'
      isValid = false
    }

    if (!userForm.value.passwordConfirm) {
      errors.value.passwordConfirm = 'Подтвердите пароль'
      isValid = false
    } else if (userForm.value.password !== userForm.value.passwordConfirm) {
      errors.value.passwordConfirm = 'Пароли не совпадают'
      isValid = false
    }
  }

  if (!userForm.value.department) {
    errors.value.department = 'Выберите департамент'
    isValid = false
  }

  if (!userForm.value.role) {
    errors.value.role = 'Выберите роль'
    isValid = false
  }

  return isValid
}

const openAddUserModal = () => {
  editingUser.value = null
  userForm.value = {
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    department: '',
    role: 'Сотрудник'
  }
  errors.value = {}
  showAddUserModal.value = true
}

const editUser = (user) => {
  editingUser.value = user
  userForm.value = {
    name: user.name,
    email: user.email,
    password: '',
    passwordConfirm: '',
    department: user.department,
    role: user.role
  }
  errors.value = {}
  showAddUserModal.value = true
}

const deleteUser = (user) => {
  if (confirm(`Вы уверены, что хотите удалить пользователя "${user.name}"?`)) {
    const index = users.value.findIndex(u => u.id === user.id)
    if (index > -1) {
      users.value.splice(index, 1)
    }
    console.log('Пользователь удалён:', user.name)
    // TODO: API call
  }
}

const saveUser = () => {
  if (!validateForm()) return

  if (editingUser.value) {
    // Update existing
    Object.assign(editingUser.value, {
      name: userForm.value.name,
      email: userForm.value.email,
      department: userForm.value.department,
      role: userForm.value.role
    })
    console.log('Пользователь обновлён:', editingUser.value)
  } else {
    // Create new
    const initials = userForm.value.name.split(' ').map(n => n[0]).join('').toUpperCase()
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-red-500', 'bg-pink-500']
    
    const newUser = {
      id: users.value.length + 1,
      name: userForm.value.name,
      email: userForm.value.email,
      department: userForm.value.department,
      role: userForm.value.role,
      online: false,
      initials: initials,
      avatarColor: colors[Math.floor(Math.random() * colors.length)]
    }
    
    users.value.push(newUser)
    console.log('Новый пользователь создан:', newUser)
  }

  closeModal()
  // TODO: API call
}

const closeModal = () => {
  showAddUserModal.value = false
  editingUser.value = null
  userForm.value = {
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    department: '',
    role: ''
  }
  errors.value = {}
}
</script>