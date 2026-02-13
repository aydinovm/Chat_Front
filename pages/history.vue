<template>
  <NuxtLayout name="default">
    <div class="h-screen overflow-y-auto bg-gray-50">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">История переназначений</h1>
          <p class="text-gray-500 mt-1">Полная история всех переназначений чатов в системе</p>
        </div>

        <!-- Filters -->
        <div class="flex items-center gap-4 mb-6">
          <!-- Search -->
          <div class="flex-1 relative">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Поиск по имени или чату..."
              class="w-full px-4 py-3 pl-10 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <svg class="w-5 h-5 absolute left-3 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- Date filter -->
          <select 
            v-model="dateFilter"
            class="px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="all">Все время</option>
            <option value="today">Сегодня</option>
            <option value="week">Эта неделя</option>
            <option value="month">Этот месяц</option>
          </select>

          <!-- Reason filter -->
          <select 
            v-model="reasonFilter"
            class="px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="">Все причины</option>
            <option value="По нагрузке">По нагрузке</option>
            <option value="По компетенции">По компетенции</option>
            <option value="Отсутствие сотрудника">Отсутствие сотрудника</option>
            <option value="Другое">Другое</option>
          </select>
        </div>

        <!-- History List -->
        <div class="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
          <div 
            v-for="(item, index) in filteredHistory" 
            :key="index"
            class="p-6 hover:bg-gray-50 transition"
          >
            <div class="flex items-start justify-between">
              <!-- Left side -->
              <div class="flex items-start gap-4 flex-1">
                <!-- Avatar -->
                <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {{ item.reassignedByInitials }}
                </div>

                <!-- Details -->
                <div class="flex-1 min-w-0">
                  <!-- Header -->
                  <div class="flex items-center gap-2 mb-2">
                    <h3 class="font-semibold text-gray-900">{{ item.reassignedBy }}</h3>
                    <span class="text-gray-400">•</span>
                    <span class="text-sm text-gray-500">{{ item.datetime }}</span>
                  </div>

                  <!-- Chat name -->
                  <p class="text-sm text-gray-600 mb-3">
                    Чат: <span class="font-medium text-gray-900">{{ item.chatName }}</span>
                  </p>

                  <!-- Reassignment flow -->
                  <div class="flex items-center gap-3 text-sm mb-3">
                    <div class="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
                      <div class="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-semibold">
                        {{ item.oldAssigneeInitials }}
                      </div>
                      <span class="font-medium text-gray-700">{{ item.oldAssignee }}</span>
                    </div>

                    <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>

                    <div class="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-lg">
                      <div class="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-semibold">
                        {{ item.newAssigneeInitials }}
                      </div>
                      <span class="font-medium text-green-700">{{ item.newAssignee }}</span>
                    </div>
                  </div>

                  <!-- Comment (if exists) -->
                  <p v-if="item.comment" class="text-sm text-gray-600 italic bg-gray-50 rounded p-2 border-l-2 border-gray-300">
                    "{{ item.comment }}"
                  </p>
                </div>
              </div>

              <!-- Right side - Reason badge -->
              <div class="ml-4">
                <span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full whitespace-nowrap">
                  {{ item.reason }}
                </span>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="filteredHistory.length === 0" class="text-center py-12">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-lg font-semibold text-gray-700 mb-1">История не найдена</h3>
            <p class="text-sm text-gray-500">Попробуйте изменить параметры фильтрации</p>
          </div>
        </div>

        <!-- Stats -->
        <div v-if="filteredHistory.length > 0" class="mt-6 grid grid-cols-4 gap-4">
          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <div class="text-sm text-gray-500 mb-1">Всего переназначений</div>
            <div class="text-2xl font-bold text-gray-900">{{ filteredHistory.length }}</div>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <div class="text-sm text-gray-500 mb-1">По нагрузке</div>
            <div class="text-2xl font-bold text-blue-600">{{ getReasonCount('По нагрузке') }}</div>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <div class="text-sm text-gray-500 mb-1">По компетенции</div>
            <div class="text-2xl font-bold text-purple-600">{{ getReasonCount('По компетенции') }}</div>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <div class="text-sm text-gray-500 mb-1">Отсутствие</div>
            <div class="text-2xl font-bold text-amber-600">{{ getReasonCount('Отсутствие сотрудника') }}</div>
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

const searchQuery = ref('')
const dateFilter = ref('all')
const reasonFilter = ref('')

const history = ref([
  {
    chatId: 1,
    chatName: 'Проблема с деплоем',
    reassignedBy: 'Сергей Иванов',
    reassignedByInitials: 'СИ',
    oldAssignee: 'Иван Петров',
    oldAssigneeInitials: 'ИП',
    newAssignee: 'Анна Сидорова',
    newAssigneeInitials: 'АС',
    reason: 'По нагрузке',
    comment: 'Иван перегружен другими задачами, передаю Анне',
    datetime: '2024-02-13 15:30'
  },
  {
    chatId: 2,
    chatName: 'Запрос на отпуск',
    reassignedBy: 'Иван Петров',
    reassignedByInitials: 'ИП',
    oldAssignee: 'Не назначен',
    oldAssigneeInitials: 'NA',
    newAssignee: 'Дмитрий Козлов',
    newAssigneeInitials: 'ДК',
    reason: 'По компетенции',
    comment: 'Вопросы по отпускам обрабатывает HR',
    datetime: '2024-02-13 14:20'
  },
  {
    chatId: 3,
    chatName: 'Ошибка в отчёте',
    reassignedBy: 'Анна Сидорова',
    reassignedByInitials: 'АС',
    oldAssignee: 'Елена Волкова',
    oldAssigneeInitials: 'ЕВ',
    newAssignee: 'Мария Смирнова',
    newAssigneeInitials: 'МС',
    reason: 'Отсутствие сотрудника',
    comment: 'Елена на больничном до конца недели',
    datetime: '2024-02-13 11:15'
  },
  {
    chatId: 1,
    chatName: 'Проблема с деплоем',
    reassignedBy: 'Иван Петров',
    reassignedByInitials: 'ИП',
    oldAssignee: 'Не назначен',
    oldAssigneeInitials: 'NA',
    newAssignee: 'Иван Петров',
    newAssigneeInitials: 'ИП',
    reason: 'По компетенции',
    comment: null,
    datetime: '2024-02-12 10:00'
  },
  {
    chatId: 4,
    chatName: 'Вопрос по зарплате',
    reassignedBy: 'Сергей Иванов',
    reassignedByInitials: 'СИ',
    oldAssignee: 'Анна Сидорова',
    oldAssigneeInitials: 'АС',
    newAssignee: 'Елена Волкова',
    newAssigneeInitials: 'ЕВ',
    reason: 'По нагрузке',
    comment: 'Бухгалтерия перегружена, распределяю задачи',
    datetime: '2024-02-12 09:30'
  },
  {
    chatId: 5,
    chatName: 'Новая вакансия',
    reassignedBy: 'Дмитрий Козлов',
    reassignedByInitials: 'ДК',
    oldAssignee: 'Не назначен',
    oldAssigneeInitials: 'NA',
    newAssignee: 'Ольга Петрова',
    newAssigneeInitials: 'ОП',
    reason: 'По компетенции',
    comment: 'Ольга занимается рекрутингом',
    datetime: '2024-02-11 16:45'
  },
  {
    chatId: 6,
    chatName: 'Технические проблемы',
    reassignedBy: 'Иван Петров',
    reassignedByInitials: 'ИП',
    oldAssignee: 'Пётр Николаев',
    oldAssigneeInitials: 'ПН',
    newAssignee: 'Сергей Иванов',
    newAssigneeInitials: 'СИ',
    reason: 'Другое',
    comment: 'Смена ответственного по проекту',
    datetime: '2024-02-11 14:00'
  }
])

const filteredHistory = computed(() => {
  let filtered = history.value

  // Search
  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item => 
      item.chatName.toLowerCase().includes(search) ||
      item.reassignedBy.toLowerCase().includes(search) ||
      item.oldAssignee.toLowerCase().includes(search) ||
      item.newAssignee.toLowerCase().includes(search)
    )
  }

  // Reason filter
  if (reasonFilter.value) {
    filtered = filtered.filter(item => item.reason === reasonFilter.value)
  }

  // Date filter
  if (dateFilter.value !== 'all') {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    filtered = filtered.filter(item => {
      const itemDate = new Date(item.datetime)
      
      switch(dateFilter.value) {
        case 'today':
          return itemDate >= today
        case 'week':
          const weekAgo = new Date(today)
          weekAgo.setDate(weekAgo.getDate() - 7)
          return itemDate >= weekAgo
        case 'month':
          const monthAgo = new Date(today)
          monthAgo.setMonth(monthAgo.getMonth() - 1)
          return itemDate >= monthAgo
        default:
          return true
      }
    })
  }

  return filtered
})

const getReasonCount = (reason) => {
  return filteredHistory.value.filter(item => item.reason === reason).length
}
</script>