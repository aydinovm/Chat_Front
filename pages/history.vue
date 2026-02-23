<template>
  <NuxtLayout name="default">
    <div class="h-screen overflow-y-auto bg-gray-50">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">История переназначений</h1>
          <p class="text-gray-500 mt-1">Полная история всех переназначений чатов в системе</p>
        </div>

        <div class="flex items-center gap-4 mb-6">
          <div class="flex-1 relative">
            <input type="text" v-model="searchQuery" placeholder="Поиск..." class="w-full px-4 py-3 pl-10 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600" />
            <svg class="w-5 h-5 absolute left-3 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select v-model="reasonFilter" class="px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600">
            <option value="">Все причины</option>
            <option value="По нагрузке">По нагрузке</option>
            <option value="По компетенции">По компетенции</option>
            <option value="Отсутствие сотрудника">Отсутствие сотрудника</option>
            <option value="Другое">Другое</option>
          </select>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
          <div v-if="isLoading" class="flex justify-center py-12">
            <svg class="w-8 h-8 animate-spin text-green-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
          </div>

          <div v-for="(item, index) in filteredHistory" :key="index" class="p-6 hover:bg-gray-50 transition">
            <div class="flex items-start justify-between">
              <div class="flex items-start gap-4 flex-1">
                <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {{ getInitials(item.reassignedByFullName) }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-2">
                    <h3 class="font-semibold text-gray-900">{{ item.reassignedByFullName }}</h3>
                    <span class="text-gray-400">•</span>
                    <span class="text-sm text-gray-500">{{ formatDate(item.reassignedAt) }}</span>
                  </div>
                  <div class="flex items-center gap-3 text-sm mb-3">
                    <div class="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
                      <span class="font-medium text-gray-700">{{ item.oldAssigneeFullName || 'Не назначен' }}</span>
                    </div>
                    <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <div class="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-lg">
                      <span class="font-medium text-green-700">{{ item.newAssigneeFullName }}</span>
                    </div>
                  </div>
                  <p v-if="item.comment" class="text-sm text-gray-600 italic bg-gray-50 rounded p-2 border-l-2 border-gray-300">
                    "{{ item.comment }}"
                  </p>
                </div>
              </div>
              <div class="ml-4">
                <span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full whitespace-nowrap">
                  {{ item.reason }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="!isLoading && filteredHistory.length === 0" class="text-center py-12 text-gray-500">
            История не найдена
          </div>
        </div>

        <!-- Статистика -->
        <div v-if="filteredHistory.length > 0" class="mt-6 grid grid-cols-4 gap-4">
          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <div class="text-sm text-gray-500 mb-1">Всего</div>
            <div class="text-2xl font-bold text-gray-900">{{ filteredHistory.length }}</div>
          </div>
          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <div class="text-sm text-gray-500 mb-1">По нагрузке</div>
            <div class="text-2xl font-bold text-blue-600">{{ countReason('По нагрузке') }}</div>
          </div>
          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <div class="text-sm text-gray-500 mb-1">По компетенции</div>
            <div class="text-2xl font-bold text-purple-600">{{ countReason('По компетенции') }}</div>
          </div>
          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <div class="text-sm text-gray-500 mb-1">Отсутствие</div>
            <div class="text-2xl font-bold text-amber-600">{{ countReason('Отсутствие сотрудника') }}</div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({ layout: false })

const { apiFetch } = useApi()
const history = ref([])
const isLoading = ref(false)
const searchQuery = ref('')
const reasonFilter = ref('')

const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'
const formatDate = (d) => d ? new Date(d).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : ''

const filteredHistory = computed(() => {
  let list = history.value
  if (searchQuery.value) {
    const s = searchQuery.value.toLowerCase()
    list = list.filter(i =>
      i.reassignedByFullName?.toLowerCase().includes(s) ||
      i.oldAssigneeFullName?.toLowerCase().includes(s) ||
      i.newAssigneeFullName?.toLowerCase().includes(s)
    )
  }
  if (reasonFilter.value) list = list.filter(i => i.reason === reasonFilter.value)
  return list
})

const countReason = (reason) => filteredHistory.value.filter(i => i.reason === reason).length

onMounted(async () => {
  isLoading.value = true
  // Загружаем историю для всех чатов (общая история — берём из всех доступных чатов)
  const chatsStore = useChatsStore()
  await chatsStore.fetchChats()
  
  // Загружаем историю для каждого чата параллельно
  const chatIds = chatsStore.chats.map(c => c.id)
  const results = await Promise.allSettled(
    chatIds.map(id => apiFetch(`/api/chats/${id}/reassignment-history`))
  )
  
  history.value = results
    .filter(r => r.status === 'fulfilled' && r.value.data)
    .flatMap(r => r.value.data)
    .sort((a, b) => new Date(b.reassignedAt) - new Date(a.reassignedAt))
  
  isLoading.value = false
})
</script>