<!-- components/Sidebar.vue -->
<template>
  <div>
    <!-- Мобильная кнопка -->
    <div class="lg:hidden fixed top-4 left-4 z-50">
      <button @click="emit('toggle-sidebar')" class="text-gray-700 bg-white p-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-600">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <aside :class="['fixed z-40 inset-y-0 left-0 w-96 transform bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out', 'lg:relative lg:translate-x-0', isOpen ? 'translate-x-0' : '-translate-x-full']">
      <div class="flex flex-col h-screen">
        
        <!-- Шапка -->
        <div class="px-5 py-4 border-b border-gray-200">
          <h1 class="text-2xl font-bold text-green-700">Система Чатов</h1>
        </div>

        <!-- Профиль -->
        <div class="px-5 py-4 border-b border-gray-200">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {{ userInitials }}
            </div>
            <div class="flex-1">
              <h3 class="text-sm font-semibold text-gray-900">{{ authStore.currentUser?.fullName }}</h3>
              <p class="text-xs text-gray-500">{{ authStore.currentUser?.departmentName }}</p>
              <span :class="['inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded', roleClass]">
                {{ authStore.userRole }}
              </span>
            </div>
          </div>
        </div>

        <!-- Действия -->
        <div class="px-5 py-4 flex gap-2">
          <button 
            @click="showCreateChatModal = true"
            class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-700 text-white rounded-lg hover:bg-green-800 transition font-medium"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Создать
          </button>

          <div class="relative">
            <button 
              @click="showAssignMenu = !showAssignMenu"
              :disabled="!currentChatId"
              :class="['px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 font-medium', !currentChatId ? 'opacity-50 cursor-not-allowed' : '']"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Назначить
            </button>

            <div v-if="showAssignMenu && currentChatId" class="absolute top-full mt-2 right-0 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
              <button @click="openAssignModal('user')" class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Назначить пользователю
              </button>
              <button @click="openAssignModal('department')" class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Назначить департаменту
              </button>
            </div>
          </div>
        </div>

        <!-- Поиск -->
        <div class="px-5 py-2">
          <div class="relative">
            <input type="text" placeholder="Поиск чатов..." class="w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600" v-model="searchQuery" />
            <svg class="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Табы -->
        <div class="px-5 py-2 flex gap-1 border-b border-gray-200">
          <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
            :class="['px-4 py-2 text-sm font-medium rounded-t-lg transition', activeTab === tab.id ? 'text-gray-900 bg-white border-b-2 border-green-600' : 'text-gray-600 hover:text-gray-900']">
            {{ tab.label }}
          </button>
        </div>

        <!-- Список чатов -->
        <div class="flex-1 overflow-y-auto">
          <div v-if="chatsStore.isLoading" class="flex justify-center py-8">
            <svg class="w-6 h-6 animate-spin text-green-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
          </div>

          <NuxtLink
            v-for="chat in filteredChats"
            :key="chat.id"
            :to="`/chats/${chat.id}`"
            @click="emit('toggle-sidebar')"
            :class="['block px-5 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition', currentChatId === chat.id ? 'bg-green-50 border-l-4 border-l-green-600' : '']"
          >
            <div class="flex items-start gap-3">
              <div class="relative flex-shrink-0">
                <div :class="['w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm', chat.avatarColor]">
                  {{ chat.initials }}
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <h4 class="text-sm font-semibold text-gray-900 truncate">{{ chat.name }}</h4>
                  <span class="text-xs text-gray-500 flex-shrink-0 ml-2">{{ chat.time }}</span>
                </div>
                <p class="text-sm text-gray-600 truncate mb-2">{{ chat.lastMessage }}</p>
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span :class="statusClass(chat.chatStatus)">{{ statusLabel(chat.chatStatus) }}</span>
                    <span v-if="chat.assignedTo" class="text-xs text-gray-500">• {{ chat.assignedTo }}</span>
                  </div>
                  <span v-if="chat.unread" class="flex-shrink-0 px-2 py-0.5 bg-green-600 text-white text-xs font-bold rounded-full min-w-[20px] text-center">
                    {{ chat.unread }}
                  </span>
                </div>
              </div>
            </div>
          </NuxtLink>
          
          <div v-if="!chatsStore.isLoading && filteredChats.length === 0" class="flex flex-col items-center justify-center py-12 px-6 text-center">
            <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 class="text-lg font-semibold text-gray-700 mb-1">Нет чатов</h3>
            <p class="text-sm text-gray-500">{{ searchQuery ? 'Попробуйте изменить запрос' : 'Создайте первый чат' }}</p>
          </div>
        </div>

        <!-- Выход -->
        <div class="p-4 border-t border-gray-200">
          <button @click="authStore.logout()" class="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-gray-100 transition text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span class="font-medium">Выйти</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Модалка "Создать чат" -->
    <div v-if="showCreateChatModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showCreateChatModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Создать чат</h2>
            <p class="text-sm text-gray-500 mt-0.5">Новое обращение в департамент</p>
          </div>
          <button @click="showCreateChatModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="px-6 py-4 space-y-4">
          <div v-if="createError" class="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {{ createError }}
          </div>

          <!-- Департамент -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Департамент <span class="text-red-500">*</span>
            </label>
            <select v-model="newChat.toDepartmentId" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600">
              <option value="">Выберите департамент</option>
              <option v-for="dept in departmentsStore.departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>

          <!-- Тема -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Тема <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              v-model="newChat.title"
              placeholder="Краткое описание проблемы или вопроса"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <!-- Описание — необязательно -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Описание
              <span class="text-gray-400 font-normal text-xs">(необязательно)</span>
            </label>
            <textarea
              v-model="newChat.description"
              placeholder="Подробно опишите ситуацию..."
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
            ></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button @click="showCreateChatModal = false" class="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium">
            Отмена
          </button>
          <button
            @click="createChat"
            :disabled="!newChat.toDepartmentId || !newChat.title || isCreating"
            class="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isCreating ? 'Создание...' : 'Создать чат' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Модалка "Назначить" -->
    <div v-if="showAssignModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showAssignModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-900">
            {{ assignType === 'user' ? 'Назначить пользователю' : 'Назначить департаменту' }}
          </h2>
          <button @click="showAssignModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="px-6 py-4 space-y-4">
          <div v-if="assignError" class="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {{ assignError }}
          </div>

          <div v-if="assignType === 'user'">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Пользователь <span class="text-red-500">*</span>
            </label>
            <select v-model="assignData.userId" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600">
              <option value="">Выберите пользователя</option>
              <option v-for="user in usersStore.users" :key="user.id" :value="user.id">
                {{ user.fullName }} ({{ user.departmentName }})
              </option>
            </select>
          </div>

          <div v-if="assignType === 'department'">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Департамент <span class="text-red-500">*</span>
            </label>
            <select v-model="assignData.departmentId" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600">
              <option value="">Выберите департамент</option>
              <option v-for="dept in departmentsStore.departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Причина <span class="text-red-500">*</span>
            </label>
<input
  type="text"
  v-model="assignData.reason"
  placeholder="Укажите причину переназначения"
  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
/>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Комментарий</label>
            <textarea
              v-model="assignData.comment"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
            ></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button @click="showAssignModal = false" class="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium">
            Отмена
          </button>
          <button
            @click="confirmAssign"
            :disabled="!isAssignValid || isAssigning"
            class="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isAssigning ? 'Назначение...' : 'Подтвердить' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  currentChatId: { type: [Number, String], default: null }
})

const emit = defineEmits(['toggle-sidebar'])

const authStore = useAuthStore()
const chatsStore = useChatsStore()
const usersStore = useUsersStore()
const departmentsStore = useDepartmentsStore()

const searchQuery = ref('')
const activeTab = ref('all')
const showCreateChatModal = ref(false)
const showAssignMenu = ref(false)
const showAssignModal = ref(false)
const assignType = ref('user')
const isCreating = ref(false)
const isAssigning = ref(false)
const createError = ref('')
const assignError = ref('')

const newChat = ref({ toDepartmentId: '', title: '', description: '' })
const assignData = ref({ userId: '', departmentId: '', reason: '', comment: '' })

const tabs = [
  { id: 'all', label: 'Все' },
  { id: 'my', label: 'Мои' },
  { id: 'active', label: 'Активные' }
]

const userInitials = computed(() => {
  const name = authStore.currentUser?.fullName || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'ИП'
})

const roleClass = computed(() => {
  const role = authStore.userRole
  if (role === 'Супер-администратор') return 'text-purple-700 bg-purple-100'
  if (role === 'Администратор департамента') return 'text-blue-700 bg-blue-100'
  return 'text-green-700 bg-green-100'
})

const filteredChats = computed(() => {
  let list = chatsStore.chats

  if (activeTab.value === 'my') {
    list = list.filter(c =>
      c.assignedTo === authStore.currentUser?.userId ||
      c.createdByUserId === authStore.currentUser?.userId
    )
  } else if (activeTab.value === 'active') {
    list = list.filter(c => c.chatStatus !== 'closed' && c.chatStatus !== 'resolved')
  }

  if (searchQuery.value) {
    const s = searchQuery.value.toLowerCase()
    list = list.filter(c =>
      c.name?.toLowerCase().includes(s) ||
      c.lastMessage?.toLowerCase().includes(s)
    )
  }

  return list
})

const isAssignValid = computed(() => {
  if (!assignData.value.reason) return false
  if (assignType.value === 'user') return !!assignData.value.userId
  return !!assignData.value.departmentId
})

const statusLabel = (s) => ({
  sent: 'Отправлено',
  viewed: 'Просмотрено',
  resolved: 'Решено',
  closed: 'Закрыто'
}[s] || 'Новый')

const statusClass = (s) => {
  const base = 'px-2.5 py-1 text-xs font-semibold rounded-full'
  const c = {
    sent: 'bg-gray-200 text-gray-700',
    viewed: 'bg-blue-100 text-blue-700',
    resolved: 'bg-green-100 text-green-700',
    closed: 'bg-red-100 text-red-700'
  }
  return `${base} ${c[s] || 'bg-gray-100 text-gray-600'}`
}

const openAssignModal = (type) => {
  assignType.value = type
  showAssignMenu.value = false
  showAssignModal.value = true
  assignError.value = ''
  if (type === 'user') usersStore.fetchUsers()
  else departmentsStore.fetchDepartments(true)
}

const createChat = async () => {
  if (!newChat.value.toDepartmentId || !newChat.value.title) return
  isCreating.value = true
  createError.value = ''

  const { error } = await chatsStore.createChat(
    newChat.value.toDepartmentId,
    newChat.value.title,
    newChat.value.description || null
  )

  if (error) {
    createError.value = error
  } else {
    showCreateChatModal.value = false
    newChat.value = { toDepartmentId: '', title: '', description: '' }
  }
  isCreating.value = false
}

const confirmAssign = async () => {
  if (!isAssignValid.value) return
  isAssigning.value = true
  assignError.value = ''

  const { error } = await chatsStore.reassignChat(
    props.currentChatId,
    assignData.value.userId || null,
    assignData.value.departmentId || null,
    assignData.value.reason,
    assignData.value.comment
  )

  if (error) {
    assignError.value = error
  } else {
    showAssignModal.value = false
    assignData.value = { userId: '', departmentId: '', reason: '', comment: '' }
  }
  isAssigning.value = false
}

onMounted(async () => {
  await chatsStore.fetchChats()
  await departmentsStore.fetchDepartments()
})

if (process.client) {
  window.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) showAssignMenu.value = false
  })
}
</script>