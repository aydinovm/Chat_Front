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

        <!-- Search -->
        <div class="mb-6">
          <div class="relative">
            <input
              type="text"
              placeholder="Поиск департаментов..."
              class="w-full px-4 py-3 pl-10 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <svg class="w-5 h-5 absolute left-3 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
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
                <th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="dept in departments" :key="dept.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div>
                    <div class="font-semibold text-gray-900">{{ dept.name }}</div>
                    <div class="text-sm text-gray-500">ID: {{ dept.id }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 text-gray-700">
                  {{ dept.description }}
                </td>
                <td class="px-6 py-4">
                  <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {{ dept.employees }} чел.
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

    <!-- Add Department Modal -->
    <div 
      v-if="showAddDepartmentModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showAddDepartmentModal = false"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-900">Новый департамент</h2>
          <button 
            @click="showAddDepartmentModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Название</label>
            <input
              type="text"
              v-model="newDepartment.name"
              placeholder="Например: IT Отдел"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Описание</label>
            <textarea
              v-model="newDepartment.description"
              placeholder="Краткое описание функций отдела..."
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
            ></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button
            @click="showAddDepartmentModal = false"
            class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Отмена
          </button>
          <button
            @click="addDepartment"
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
definePageMeta({
  layout: false
})

const showAddDepartmentModal = ref(false)

const newDepartment = ref({
  name: '',
  description: ''
})

const addDepartment = () => {
  console.log('Adding department:', newDepartment.value)
  showAddDepartmentModal.value = false
  newDepartment.value = {
    name: '',
    description: ''
  }
}

const departments = ref([
  {
    id: 'd1',
    name: 'IT Отдел',
    description: 'Разработка и поддержка ПО',
    employees: 12
  },
  {
    id: 'd2',
    name: 'Бухгалтерия',
    description: 'Финансовый учет и отчетность',
    employees: 5
  },
  {
    id: 'd3',
    name: 'HR',
    description: 'Управление персоналом',
    employees: 3
  },
  {
    id: 'd4',
    name: 'Маркетинг',
    description: 'Продвижение и реклама',
    employees: 8
  }
])
</script>
