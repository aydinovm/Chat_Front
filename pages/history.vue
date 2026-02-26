<template>
  <NuxtLayout name="default">
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">История переназначений</h1>
          <p class="text-gray-500 mt-1">Полная история переназначений чатов, доступных текущему пользователю</p>
        </div>

        <!-- Filters -->
        <div class="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <!-- Search -->
            <div class="lg:col-span-5 relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Поиск по людям, комментарию, причине..."
                class="w-full px-4 py-3 pl-10 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <svg class="w-5 h-5 absolute left-3 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <!-- Reason -->
            <div class="lg:col-span-3">
              <select
                v-model="reasonFilter"
                class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="">Все причины</option>
                <option v-for="r in reasonOptions" :key="r" :value="r">{{ r }}</option>
              </select>
            </div>

            <!-- Date from -->
            <div class="lg:col-span-2">
              <input
                type="date"
                v-model="dateFrom"
                class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <!-- Date to -->
            <div class="lg:col-span-2">
              <input
                type="date"
                v-model="dateTo"
                class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
          </div>

          <!-- Quick actions -->
          <div class="flex items-center justify-between mt-4">
            <div class="text-sm text-gray-500">
              Найдено: <span class="font-semibold text-gray-900">{{ filteredHistory.length }}</span>
            </div>
            <div class="flex gap-2">
              <button
                @click="resetFilters"
                class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition"
              >
                Сбросить фильтры
              </button>
              <button
                @click="reload"
                :disabled="isLoading"
                class="px-4 py-2 text-sm font-medium rounded-lg bg-green-700 text-white hover:bg-green-800 transition disabled:opacity-50"
              >
                {{ isLoading ? 'Обновление...' : 'Обновить' }}
              </button>
            </div>
          </div>
        </div>

        <!-- List -->
        <div class="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
          <div v-if="isLoading" class="flex justify-center py-12">
            <svg class="w-8 h-8 animate-spin text-green-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
          </div>

          <div
            v-for="item in filteredHistory"
            :key="item.__key"
            class="p-6 hover:bg-gray-50 transition"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-start gap-4 flex-1 min-w-0">
                <!-- Avatar -->
                <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {{ getInitials(item.reassignedByFullName) }}
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex flex-wrap items-center gap-2 mb-2">
                    <h3 class="font-semibold text-gray-900 truncate">
                      {{ item.reassignedByFullName || 'Неизвестный пользователь' }}
                    </h3>
                    <span class="text-gray-400">•</span>
                    <span class="text-sm text-gray-500">{{ formatDateTime(item.reassignedAt) }}</span>

                    <span v-if="item.chatRequestId" class="text-gray-400">•</span>
                    <NuxtLink
                      v-if="item.chatRequestId"
                      :to="`/chats/${item.chatRequestId}`"
                      class="text-sm font-medium text-green-700 hover:text-green-800 hover:underline"
                    >
                      Открыть чат
                    </NuxtLink>
                  </div>

                  <!-- Old -> New -->
                  <div class="flex flex-wrap items-center gap-3 text-sm mb-3">
                    <div class="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
                      <span class="font-medium text-gray-700">
                        {{ item.oldAssigneeFullName || 'Не назначен' }}
                      </span>
                    </div>

                    <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>

                    <div class="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-lg">
                      <span class="font-medium text-green-700">
                        {{ item.newAssigneeFullName || '—' }}
                      </span>
                    </div>
                  </div>

                  <!-- Comment -->
                  <p
                    v-if="item.comment"
                    class="text-sm text-gray-600 italic bg-gray-50 rounded p-3 border-l-2 border-gray-300 break-words"
                  >
                    “{{ item.comment }}”
                  </p>
                </div>
              </div>

              <!-- Reason badge -->
              <div class="flex-shrink-0">
                <span
                  class="px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap"
                  :class="reasonBadgeClass(item.reason)"
                >
                  {{ item.reason || 'Без причины' }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="!isLoading && filteredHistory.length === 0" class="text-center py-12 text-gray-500">
            История не найдена
          </div>
        </div>

        <!-- Stats -->
        <div v-if="filteredHistory.length > 0" class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <div class="text-sm text-gray-500 mb-1">Всего</div>
            <div class="text-2xl font-bold text-gray-900">{{ filteredHistory.length }}</div>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <div class="text-sm text-gray-500 mb-1">Уникальных причин</div>
            <div class="text-2xl font-bold text-gray-900">{{ reasonOptions.length }}</div>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <div class="text-sm text-gray-500 mb-1">С комментариями</div>
            <div class="text-2xl font-bold text-gray-900">{{ withCommentsCount }}</div>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <div class="text-sm text-gray-500 mb-1">Последнее переназначение</div>
            <div class="text-sm font-semibold text-gray-900">
              {{ latestItem ? formatDateTime(latestItem.reassignedAt) : '—' }}
            </div>
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
const dateFrom = ref('') // YYYY-MM-DD
const dateTo = ref('')   // YYYY-MM-DD

const getInitials = (name) =>
  name?.split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??'

const formatDateTime = (d) => {
  if (!d) return ''
  const dt = new Date(d)
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dt)
}

// Цвет бейджа причины
const reasonBadgeClass = (reason) => {
  const base = 'bg-gray-100 text-gray-700'
  if (!reason) return base

  const r = reason.toLowerCase()
  if (r.includes('нагруз')) return 'bg-blue-100 text-blue-700'
  if (r.includes('компет')) return 'bg-purple-100 text-purple-700'
  if (r.includes('отсутств')) return 'bg-amber-100 text-amber-700'
  if (r.includes('другое')) return 'bg-slate-100 text-slate-700'
  return base
}

// Динамические причины из данных
const reasonOptions = computed(() => {
  const set = new Set()
  for (const i of history.value) {
    if (i?.reason) set.add(i.reason)
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'ru'))
})

const latestItem = computed(() => {
  if (!history.value.length) return null
  return [...history.value].sort((a, b) => new Date(b.reassignedAt) - new Date(a.reassignedAt))[0]
})

const withCommentsCount = computed(() => {
  return filteredHistory.value.filter(x => !!x.comment).length
})

// Фильтрация
const filteredHistory = computed(() => {
  let list = [...history.value]

  // reason
  if (reasonFilter.value) {
    list = list.filter(i => i.reason === reasonFilter.value)
  }

  // date range
  if (dateFrom.value) {
    const from = new Date(dateFrom.value + 'T00:00:00')
    list = list.filter(i => i.reassignedAt && new Date(i.reassignedAt) >= from)
  }
  if (dateTo.value) {
    const to = new Date(dateTo.value + 'T23:59:59')
    list = list.filter(i => i.reassignedAt && new Date(i.reassignedAt) <= to)
  }

  // search
  if (searchQuery.value) {
    const s = searchQuery.value.toLowerCase()
    list = list.filter(i => {
      const blob = [
        i.reassignedByFullName,
        i.oldAssigneeFullName,
        i.newAssigneeFullName,
        i.reason,
        i.comment
      ].filter(Boolean).join(' ').toLowerCase()
      return blob.includes(s)
    })
  }

  // сортировка по дате
  list.sort((a, b) => new Date(b.reassignedAt) - new Date(a.reassignedAt))

  // ключ для v-for (чтобы не было key=index)
  return list.map((x, idx) => ({
    ...x,
    __key: x.id || `${x.chatRequestId || 'chat'}_${x.reassignedAt || 'time'}_${idx}`
  }))
})

const resetFilters = () => {
  searchQuery.value = ''
  reasonFilter.value = ''
  dateFrom.value = ''
  dateTo.value = ''
}

// --- Загрузка истории ---
// limiter параллельных запросов, чтобы не делать 200 запросов разом
async function mapWithConcurrency(items, limit, mapper) {
  const results = []
  let i = 0

  const workers = new Array(Math.min(limit, items.length)).fill(0).map(async () => {
    while (i < items.length) {
      const cur = i++
      try {
        results[cur] = await mapper(items[cur], cur)
      } catch (e) {
        results[cur] = null
      }
    }
  })

  await Promise.all(workers)
  return results
}

const loadHistory = async () => {
  isLoading.value = true
  try {
    const chatsStore = useChatsStore()
    await chatsStore.fetchChats()

    const chatIds = (chatsStore.chats || [])
      .map(c => c.id)
      .filter(Boolean)

    // если чатов нет — просто очистим историю
    if (!chatIds.length) {
      history.value = []
      return
    }

    const responses = await mapWithConcurrency(chatIds, 6, async (id) => {
      // ВАЖНО: путь должен совпадать с API: /api/chats/{id}/reassignment-history
      const res = await apiFetch(`/api/chats/${id}/reassignment-history`)
      const data = res?.data || res // зависит от твоего apiFetch
      if (!Array.isArray(data)) return []

      // добавляем chatRequestId внутрь item, если бэк не присылает
return data.map(x => ({
  ...x,

  // на всякий случай
  id: x.id,
  chatRequestId: x.chatRequestId || id,

  // НОРМАЛИЗУЕМ под твой UI (чтобы шаблон не переписывать)
  reassignedByFullName: x.reassignedByUserName,
  oldAssigneeFullName: x.oldAssignedUserName,
  newAssigneeFullName: x.newAssignedUserName,

  // reason/reassignedAt совпадают по имени — можно оставить,
  // но пусть тоже будет стабильно
  reason: x.reason,
  reassignedAt: x.reassignedAt,

  // комментария у тебя в API НЕТ — оставим null
  comment: x.comment ?? null
}))
    })

    history.value = responses
      .filter(Boolean)
      .flat()
      .sort((a, b) => new Date(b.reassignedAt) - new Date(a.reassignedAt))
  } finally {
    isLoading.value = false
  }
}

const reload = async () => {
  await loadHistory()
}

onMounted(async () => {
  await loadHistory()
})
</script> 