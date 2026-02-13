<template>
  <NuxtLayout name="default">
    <div class="h-screen overflow-y-auto">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Департаменты</h1>
            <p class="text-gray-500 mt-1">Управление структурой организации</p>
          </div>
          <button 
            @click="showAddDepartmentModal = true"
            class="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Добавить департамент
          </button>
        </div>

        <!-- Filters -->
        <div class="flex items-center gap-4 mb-6">
          <!-- Search -->
          <div class="flex-1 relative">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Поиск департаментов..."
              class="w-full px-4 py-3 pl-10 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <svg class="w-5 h-5 absolute left-3 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- Status filter -->
          <select 
            v-model="statusFilter"
            class="px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="all">Все департаменты</option>
            <option value="active">Активные</option>
            <option value="inactive">Неактивные</option>
          </select>
        </div>

        <!-- Departments Table -->
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Название
                </th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Описание
                </th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Сотрудников
                </th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Активные чаты
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
              <tr v-for="dept in filteredDepartments" :key="dept.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div>
                    <div class="font-semibold text-gray-900">{{ dept.name }}</div>
                    <div class="text-sm text-gray-500">ID: {{ dept.id }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 text-gray-700 max-w-xs">
                  <p class="truncate">{{ dept.description }}</p>
                </td>
                <td class="px-6 py-4">
                  <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {{ dept.employees }} чел.
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <span 
                      :class="[
                        'px-3 py-1 rounded-full text-sm font-medium',
                        dept.activeChats > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      ]"
                    >
                      {{ dept.activeChats }}
                    </span>
                    <span v-if="dept.activeChats > 5" class="text-xs text-amber-600 font-medium">
                      Высокая нагрузка
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span 
                    :class="[
                      'px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 w-fit',
                      dept.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    ]"
                  >
                    <span 
                      :class="[
                        'w-2 h-2 rounded-full',
                        dept.isActive ? 'bg-green-500' : 'bg-gray-400'
                      ]"
                    ></span>
                    {{ dept.isActive ? 'Активен' : 'Неактивен' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button 
                      @click="editDepartment(dept)"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Редактировать"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      @click="toggleDepartmentStatus(dept)"
                      :class="[
                        'p-2 rounded-lg transition',
                        dept.isActive ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'
                      ]"
                      :title="dept.isActive ? 'Деактивировать' : 'Активировать'"
                    >
                      <svg v-if="dept.isActive" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <button 
                      @click="deleteDepartment(dept)"
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
          <div v-if="filteredDepartments.length === 0" class="text-center py-12">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 class="text-lg font-semibold text-gray-700 mb-1">Департаменты не найдены</h3>
            <p class="text-sm text-gray-500">Попробуйте изменить параметры поиска</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Department Modal -->
    <div 
      v-if="showAddDepartmentModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showAddDepartmentModal = false"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-900">
            {{ editingDepartment ? 'Редактировать департамент' : 'Новый департамент' }}
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
              Название <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              v-model="departmentForm.name"
              placeholder="Например: IT Отдел"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Описание <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="departmentForm.description"
              placeholder="Краткое описание функций отдела..."
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
            ></textarea>
          </div>

          <div>
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                v-model="departmentForm.isActive"
                class="w-5 h-5 text-green-600 rounded focus:ring-green-600"
              />
              <span class="text-sm font-medium text-gray-700">Активен</span>
            </label>
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
            @click="saveDepartment"
            :disabled="!departmentForm.name || !departmentForm.description"
            class="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ editingDepartment ? 'Сохранить' : 'Создать' }}
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

const showAddDepartmentModal = ref(false)
const editingDepartment = ref(null)
const searchQuery = ref('')
const statusFilter = ref('all')

const departmentForm = ref({
  name: '',
  description: '',
  isActive: true
})

const departments = ref([
  {
    id: 'd1',
    name: 'IT Отдел',
    description: 'Разработка и поддержка программного обеспечения, системное администрирование',
    employees: 12,
    activeChats: 8,
    isActive: true
  },
  {
    id: 'd2',
    name: 'Бухгалтерия',
    description: 'Финансовый учет и отчетность',
    employees: 5,
    activeChats: 3,
    isActive: true
  },
  {
    id: 'd3',
    name: 'HR',
    description: 'Управление персоналом, рекрутинг',
    employees: 3,
    activeChats: 12,
    isActive: true
  },
  {
    id: 'd4',
    name: 'Маркетинг',
    description: 'Продвижение и реклама, маркетинговые исследования',
    employees: 8,
    activeChats: 5,
    isActive: true
  },
  {
    id: 'd5',
    name: 'Логистика',
    description: 'Управление поставками и складом',
    employees: 6,
    activeChats: 0,
    isActive: false
  }
])

const filteredDepartments = computed(() => {
  let filtered = departments.value

  // Search filter
  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    filtered = filtered.filter(dept => 
      dept.name.toLowerCase().includes(search) ||
      dept.description.toLowerCase().includes(search)
    )
  }

  // Status filter
  if (statusFilter.value === 'active') {
    filtered = filtered.filter(dept => dept.isActive)
  } else if (statusFilter.value === 'inactive') {
    filtered = filtered.filter(dept => !dept.isActive)
  }

  return filtered
})

const editDepartment = (dept) => {
  editingDepartment.value = dept
  departmentForm.value = {
    name: dept.name,
    description: dept.description,
    isActive: dept.isActive
  }
  showAddDepartmentModal.value = true
}

const toggleDepartmentStatus = (dept) => {
  const action = dept.isActive ? 'деактивировать' : 'активировать'
  if (confirm(`Вы уверены, что хотите ${action} департамент "${dept.name}"?`)) {
    dept.isActive = !dept.isActive
    console.log(`Департамент ${dept.name} ${dept.isActive ? 'активирован' : 'деактивирован'}`)
    // TODO: API call
  }
}

const deleteDepartment = (dept) => {
  if (dept.activeChats > 0) {
    alert('Невозможно удалить департамент с активными чатами')
    return
  }
  
  if (confirm(`Вы уверены, что хотите удалить департамент "${dept.name}"? Это действие необратимо.`)) {
    const index = departments.value.findIndex(d => d.id === dept.id)
    if (index > -1) {
      departments.value.splice(index, 1)
    }
    console.log('Департамент удалён:', dept.name)
    // TODO: API call
  }
}

const saveDepartment = () => {
  if (!departmentForm.value.name || !departmentForm.value.description) return

  if (editingDepartment.value) {
    // Update existing
    Object.assign(editingDepartment.value, {
      name: departmentForm.value.name,
      description: departmentForm.value.description,
      isActive: departmentForm.value.isActive
    })
    console.log('Департамент обновлён:', editingDepartment.value)
  } else {
    // Create new
    const newDept = {
      id: `d${departments.value.length + 1}`,
      name: departmentForm.value.name,
      description: departmentForm.value.description,
      isActive: departmentForm.value.isActive,
      employees: 0,
      activeChats: 0
    }
    departments.value.push(newDept)
    console.log('Новый департамент создан:', newDept)
  }

  closeModal()
  // TODO: API call
}

const closeModal = () => {
  showAddDepartmentModal.value = false
  editingDepartment.value = null
  departmentForm.value = {
    name: '',
    description: '',
    isActive: true
  }
}
</script>