<template>
  <NuxtLayout name="default">
    <div class="h-screen overflow-y-auto bg-gray-50">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Пользователи</h1>
            <p class="text-gray-500 mt-1">Управление сотрудниками</p>
          </div>
          <button @click="openAddUserModal" class="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Добавить пользователя
          </button>
        </div>

        <div v-if="errorMessage" class="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{{ errorMessage }}</div>

        <div class="flex items-center gap-4 mb-6">
          <div class="flex-1 relative">
            <input type="text" placeholder="Поиск..." v-model="searchQuery" class="w-full px-4 py-3 pl-10 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600" />
            <svg class="w-5 h-5 absolute left-3 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select v-model="departmentFilter" class="px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600">
            <option value="">Все департаменты</option>
            <option v-for="dept in departmentsStore.departments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
          </select>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div v-if="usersStore.isLoading" class="flex justify-center py-12">
            <svg class="w-8 h-8 animate-spin text-green-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
          </div>

          <table v-else class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Пользователь</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Департамент</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Роль</th>
                <th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" :class="avatarColor(user.id)">
                      {{ getInitials(user.fullName) }}
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900">{{ user.fullName }}</div>
                      <div class="text-sm text-gray-500">@{{ user.username }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-gray-700">{{ user.departmentName }}</td>
                <td class="px-6 py-4">
                  <span :class="['px-3 py-1 rounded-full text-sm font-medium', user.isDepartmentAdmin ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700']">
                    {{ user.isDepartmentAdmin ? 'Администратор' : 'Сотрудник' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="editUser(user)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="deleteUser(user)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="!usersStore.isLoading && filteredUsers.length === 0" class="text-center py-12 text-gray-500">
            Пользователи не найдены
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeModal">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-900">{{ editingUser ? 'Редактировать' : 'Новый пользователь' }}</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="px-6 py-4 space-y-4">
          <div v-if="modalError" class="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{{ modalError }}</div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ФИО <span class="text-red-500">*</span></label>
            <input type="text" v-model="form.fullName" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Логин <span class="text-red-500">*</span></label>
            <input type="text" v-model="form.username" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600" />
          </div>
          <div v-if="!editingUser">
            <label class="block text-sm font-medium text-gray-700 mb-1">Пароль <span class="text-red-500">*</span></label>
            <input type="password" v-model="form.password" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Департамент <span class="text-red-500">*</span></label>
              <select v-model="form.departmentId" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600">
                <option value="">Выберите...</option>
                <option v-for="dept in departmentsStore.departments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Роль</label>
              <select v-model="form.isDepartmentAdmin" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600">
                <option :value="false">Сотрудник</option>
                <option :value="true">Администратор</option>
              </select>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button @click="closeModal" class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">Отмена</button>
          <button @click="saveUser" :disabled="isSaving" class="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition disabled:opacity-50">
            {{ isSaving ? 'Сохранение...' : (editingUser ? 'Сохранить' : 'Создать') }}
          </button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({ layout: false })

const usersStore = useUsersStore()
const departmentsStore = useDepartmentsStore()

const searchQuery = ref('')
const departmentFilter = ref('')
const showModal = ref(false)
const editingUser = ref(null)
const isSaving = ref(false)
const errorMessage = ref('')
const modalError = ref('')

const form = ref({ fullName: '', username: '', password: '', departmentId: '', isDepartmentAdmin: false })

const COLORS = ['bg-blue-500','bg-purple-500','bg-green-500','bg-orange-500','bg-red-500','bg-pink-500','bg-teal-500']
const avatarColor = (id) => COLORS[id?.charCodeAt(0) % COLORS.length] || 'bg-gray-500'
const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'

const filteredUsers = computed(() => {
  let list = usersStore.users
  if (searchQuery.value) {
    const s = searchQuery.value.toLowerCase()
    list = list.filter(u => u.fullName?.toLowerCase().includes(s) || u.username?.toLowerCase().includes(s))
  }
  if (departmentFilter.value) list = list.filter(u => u.departmentId === departmentFilter.value)
  return list
})

const openAddUserModal = () => {
  editingUser.value = null
  form.value = { fullName: '', username: '', password: '', departmentId: '', isDepartmentAdmin: false }
  modalError.value = ''
  showModal.value = true
}

const editUser = (user) => {
  editingUser.value = user
  form.value = { fullName: user.fullName, username: user.username, password: '', departmentId: user.departmentId, isDepartmentAdmin: user.isDepartmentAdmin }
  modalError.value = ''
  showModal.value = true
}

const deleteUser = async (user) => {
  if (!confirm(`Удалить "${user.fullName}"?`)) return
  const { error } = await usersStore.deleteUser(user.id)
  if (error) errorMessage.value = error
}

const saveUser = async () => {
  isSaving.value = true
  modalError.value = ''
  const { error } = editingUser.value
    ? await usersStore.updateUser(editingUser.value.id, { fullName: form.value.fullName, username: form.value.username, departmentId: form.value.departmentId, isDepartmentAdmin: form.value.isDepartmentAdmin })
    : await usersStore.createUser(form.value)
  if (error) modalError.value = error
  else closeModal()
  isSaving.value = false
}

const closeModal = () => {
  showModal.value = false
  editingUser.value = null
  form.value = { fullName: '', username: '', password: '', departmentId: '', isDepartmentAdmin: false }
}

onMounted(async () => {
  await departmentsStore.fetchDepartments()
  await usersStore.fetchUsers()
})
</script>