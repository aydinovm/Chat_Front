<template>
  <NuxtLayout name="default">
    <div class="h-screen overflow-y-auto">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Департаменты</h1>
            <p class="text-gray-500 mt-1">Управление структурой организации</p>
          </div>
          <button @click="showAddDepartmentModal = true" class="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Добавить департамент
          </button>
        </div>

        <!-- Error -->
        <div v-if="errorMessage" class="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{{ errorMessage }}</div>

        <div class="flex items-center gap-4 mb-6">
          <div class="flex-1 relative">
            <input type="text" v-model="searchQuery" placeholder="Поиск департаментов..." class="w-full px-4 py-3 pl-10 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600" />
            <svg class="w-5 h-5 absolute left-3 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select v-model="statusFilter" class="px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600">
            <option value="all">Все</option>
            <option value="active">Активные</option>
            <option value="inactive">Неактивные</option>
          </select>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <!-- Loading -->
          <div v-if="departmentsStore.isLoading" class="flex justify-center py-12">
            <svg class="w-8 h-8 animate-spin text-green-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
          </div>

          <table v-else class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Название</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тип</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сотрудников</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Активные чаты</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                <th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="dept in filteredDepartments" :key="dept.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="font-semibold text-gray-900">{{ dept.name }}</div>
                </td>
                <td class="px-6 py-4 text-gray-700">{{ dept.type }}</td>
                <td class="px-6 py-4">
                  <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{{ dept.usersCount }} чел.</span>
                </td>
                <td class="px-6 py-4">
                  <span :class="['px-3 py-1 rounded-full text-sm font-medium', dept.activeChatsCount > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500']">
                    {{ dept.activeChatsCount }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span :class="['px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 w-fit', dept.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500']">
                    <span :class="['w-2 h-2 rounded-full', dept.isActive ? 'bg-green-500' : 'bg-gray-400']"></span>
                    {{ dept.isActive ? 'Активен' : 'Неактивен' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="editDepartment(dept)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="toggleDepartmentStatus(dept)" :class="['p-2 rounded-lg transition', dept.isActive ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50']">
                      <svg v-if="dept.isActive" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <button @click="deleteDepartment(dept)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="!departmentsStore.isLoading && filteredDepartments.length === 0" class="text-center py-12">
            <p class="text-gray-500">Департаменты не найдены</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showAddDepartmentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeModal">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-900">{{ editingDepartment ? 'Редактировать' : 'Новый департамент' }}</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="px-6 py-4 space-y-4">
          <div v-if="modalError" class="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{{ modalError }}</div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Название <span class="text-red-500">*</span></label>
            <input type="text" v-model="departmentForm.name" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Тип <span class="text-red-500">*</span></label>
            <input type="text" v-model="departmentForm.type" placeholder="Например: IT, HR, Finance" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600" />
          </div>
          <div>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="departmentForm.isActive" class="w-5 h-5 text-green-600 rounded focus:ring-green-600" />
              <span class="text-sm font-medium text-gray-700">Активен</span>
            </label>
          </div>
        </div>
        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button @click="closeModal" class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">Отмена</button>
          <button @click="saveDepartment" :disabled="!departmentForm.name || isSaving" class="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition disabled:opacity-50">
            {{ isSaving ? 'Сохранение...' : (editingDepartment ? 'Сохранить' : 'Создать') }}
          </button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({ layout: false })

const departmentsStore = useDepartmentsStore()
const showAddDepartmentModal = ref(false)
const editingDepartment = ref(null)
const searchQuery = ref('')
const statusFilter = ref('all')
const isSaving = ref(false)
const errorMessage = ref('')
const modalError = ref('')

const departmentForm = ref({ name: '', type: '', isActive: true })

const filteredDepartments = computed(() => {
  let list = departmentsStore.departments
  if (searchQuery.value) {
    const s = searchQuery.value.toLowerCase()
    list = list.filter(d => d.name?.toLowerCase().includes(s))
  }
  if (statusFilter.value === 'active') list = list.filter(d => d.isActive)
  else if (statusFilter.value === 'inactive') list = list.filter(d => !d.isActive)
  return list
})

const editDepartment = (dept) => {
  editingDepartment.value = dept
  departmentForm.value = { name: dept.name, type: dept.type, isActive: dept.isActive }
  showAddDepartmentModal.value = true
  modalError.value = ''
}

const toggleDepartmentStatus = async (dept) => {
  const action = dept.isActive ? 'деактивировать' : 'активировать'
  if (!confirm(`Вы уверены, что хотите ${action} "${dept.name}"?`)) return
  const { error } = await departmentsStore.updateDepartment(dept.id, { ...dept, isActive: !dept.isActive })
  if (error) errorMessage.value = error
}

const deleteDepartment = async (dept) => {
  if (dept.activeChatsCount > 0) return alert('Невозможно удалить с активными чатами')
  if (!confirm(`Удалить "${dept.name}"?`)) return
  const { error } = await departmentsStore.deleteDepartment(dept.id)
  if (error) errorMessage.value = error
}

const saveDepartment = async () => {
  if (!departmentForm.value.name) return
  isSaving.value = true
  modalError.value = ''

  const payload = { name: departmentForm.value.name, type: departmentForm.value.type, isActive: departmentForm.value.isActive }
  const { error } = editingDepartment.value
    ? await departmentsStore.updateDepartment(editingDepartment.value.id, payload)
    : await departmentsStore.createDepartment(payload)

  if (error) modalError.value = error
  else closeModal()
  isSaving.value = false
}

const closeModal = () => {
  showAddDepartmentModal.value = false
  editingDepartment.value = null
  departmentForm.value = { name: '', type: '', isActive: true }
  modalError.value = ''
}

onMounted(() => departmentsStore.fetchDepartments())
</script>