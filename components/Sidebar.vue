<!-- components/Sidebar.vue -->
<template>
  <div>
    
    <!-- Кнопка меню для мобильных -->
    <div class="lg:hidden fixed top-4 left-4 z-50">
      <button
        @click="emit('toggle-sidebar')"
        class="text-gray-700 bg-white p-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-600"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Сайдбар -->
    <aside
      :class="[
        'fixed z-40 inset-y-0 left-0 w-96 transform bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out',
        'lg:relative lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="flex flex-col h-screen">
        
        <!-- Шапка -->
        <div class="px-5 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-green-700">Система Чатов</h1>
            <button class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Профиль пользователя -->
        <div class="px-5 py-4 border-b border-gray-200">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              ИП
            </div>
            <div class="flex-1">
              <h3 class="text-sm font-semibold text-gray-900">{{ user.name }}</h3>
              <p class="text-xs text-gray-500">{{ user.department }}</p>
              <span 
                :class="[
                  'inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded',
                  user.role === 'Супер-администратор' ? 'text-purple-700 bg-purple-100' :
                  user.role === 'Администратор департамента' ? 'text-blue-700 bg-blue-100' :
                  'text-green-700 bg-green-100'
                ]"
              >
                {{ user.role }}
              </span>
            </div>
          </div>
        </div>

        <!-- Кнопки действий -->
        <div class="px-5 py-4 flex gap-2">
          <!-- Создать чат -->
          <button 
            @click="showCreateChatModal = true"
            class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-700 text-white rounded-lg hover:bg-green-800 transition font-medium"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Создать
          </button>

          <!-- Назначить (с выпадающим меню) -->
          <div class="relative">
            <button 
              @click="showAssignMenu = !showAssignMenu"
              :disabled="!currentChatId"
              :class="[
                'px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 font-medium',
                !currentChatId ? 'opacity-50 cursor-not-allowed' : ''
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Назначить
            </button>

            <!-- Выпадающее меню -->
            <div 
              v-if="showAssignMenu && currentChatId"
              class="absolute top-full mt-2 right-0 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
            >
              <button
                @click="openAssignModal('user')"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Назначить пользователю
              </button>
              
              <button
                @click="openAssignModal('department')"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
              >
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
            <input
              type="text"
              placeholder="Поиск чатов..."
              class="w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              v-model="searchQuery"
            />
            <svg class="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Табы -->
        <div class="px-5 py-2 flex gap-1 border-b border-gray-200">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-t-lg transition',
              activeTab === tab.id
                ? 'text-gray-900 bg-white border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Список чатов -->
        <div class="flex-1 overflow-y-auto">
          <NuxtLink
            v-for="chat in filteredChats"
            :key="chat.id"
            :to="`/chats/${chat.id}`"
            @click="emit('toggle-sidebar')"
            :class="[
              'block px-5 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition',
              currentChatId === chat.id ? 'bg-green-50 border-l-4 border-l-green-600' : ''
            ]"
          >
            <div class="flex items-start gap-3">
              <div class="relative flex-shrink-0">
                <div 
                  :class="[
                    'w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm',
                    chat.avatarColor
                  ]"
                >
                  {{ chat.initials }}
                </div>
                <!-- Онлайн статус -->
                <span
                  v-if="chat.online"
                  class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
                ></span>
                <span
                  v-else-if="chat.status === 'offline'"
                  class="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 border-2 border-white rounded-full"
                ></span>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <h4 class="text-sm font-semibold text-gray-900 truncate">{{ chat.name }}</h4>
                  <span class="text-xs text-gray-500 flex-shrink-0 ml-2">{{ chat.time }}</span>
                </div>
                
                <p class="text-sm text-gray-600 truncate mb-2">{{ chat.lastMessage }}</p>
                
                <div class="flex items-center justify-between gap-2">
                  <!-- Статус чата - УЛУЧШЕННЫЙ -->
                  <div class="flex items-center gap-2">
                    <span
                      :class="[
                        'px-2.5 py-1 text-xs font-semibold rounded-full',
                        chat.chatStatus === 'sent' ? 'bg-gray-200 text-gray-700' :
                        chat.chatStatus === 'viewed' ? 'bg-blue-100 text-blue-700' :
                        chat.chatStatus === 'resolved' ? 'bg-green-100 text-green-700' :
                        chat.chatStatus === 'closed' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-600'
                      ]"
                    >
                      {{ 
                        chat.chatStatus === 'sent' ? 'Отправлено' :
                        chat.chatStatus === 'viewed' ? 'Просмотрено' :
                        chat.chatStatus === 'resolved' ? 'Решено' :
                        chat.chatStatus === 'closed' ? 'Закрыто' :
                        'Новый'
                      }}
                    </span>
                    
                    <!-- Назначенный сотрудник -->
                    <span v-if="chat.assignedTo" class="text-xs text-gray-500">
                      • {{ chat.assignedTo }}
                    </span>
                  </div>
                  
                  <!-- Непрочитанные -->
                  <span
                    v-if="chat.unread"
                    class="flex-shrink-0 px-2 py-0.5 bg-green-600 text-white text-xs font-bold rounded-full min-w-[20px] text-center"
                  >
                    {{ chat.unread }}
                  </span>
                </div>
              </div>
            </div>
          </NuxtLink>
          
          <!-- Пустое состояние -->
          <div v-if="filteredChats.length === 0" class="flex flex-col items-center justify-center py-12 px-6 text-center">
            <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 class="text-lg font-semibold text-gray-700 mb-1">Нет чатов</h3>
            <p class="text-sm text-gray-500">{{ searchQuery ? 'Попробуйте изменить запрос' : 'Создайте первый чат' }}</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Модальное окно "Создать чат" -->
    <div 
      v-if="showCreateChatModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showCreateChatModal = false"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        <!-- Шапка -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Создать чат</h2>
            <p class="text-sm text-gray-500 mt-0.5">Новое обращение в департамент</p>
          </div>
          <button 
            @click="showCreateChatModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Форма -->
        <div class="px-6 py-4 space-y-4">
          <!-- Кому (Департамент) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Департамент <span class="text-red-500">*</span>
            </label>
            <select
              v-model="newChat.department"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="">Выберите департамент</option>
              <option value="IT Отдел">IT Отдел</option>
              <option value="Бухгалтерия">Бухгалтерия</option>
              <option value="HR">HR</option>
              <option value="Маркетинг">Маркетинг</option>
            </select>
          </div>

          <!-- Тема -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Тема <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              v-model="newChat.subject"
              placeholder="Краткое описание проблемы или вопроса"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <!-- Описание -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Описание <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="newChat.description"
              placeholder="Подробно опишите ситуацию, чтобы сотрудник мог лучше понять задачу..."
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">Чем подробнее описание, тем быстрее получите ответ</p>
          </div>
        </div>

        <!-- Кнопки -->
        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            @click="showCreateChatModal = false"
            class="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium"
          >
            Отмена
          </button>
          <button
            @click="createChat"
            :disabled="!newChat.department || !newChat.subject || !newChat.description"
            class="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Создать чат
          </button>
        </div>
      </div>
    </div>

    <!-- Модальное окно "Назначить" -->
    <div 
      v-if="showAssignModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showAssignModal = false"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        <!-- Шапка -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 class="text-xl font-bold text-gray-900">{{ assignModalTitle }}</h2>
            <p v-if="currentAssignedUser" class="text-sm text-gray-500 mt-0.5">
              Текущий исполнитель: <span class="font-medium">{{ currentAssignedUser }}</span>
            </p>
          </div>
          <button 
            @click="showAssignModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Форма -->
        <div class="px-6 py-4 space-y-4">
          <!-- Выбор пользователя -->
          <div v-if="assignType === 'user'">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Пользователь <span class="text-red-500">*</span>
            </label>
            <select
              v-model="assignData.userId"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="">Выберите пользователя</option>
              <option value="user1">Иван Петров (IT Отдел)</option>
              <option value="user2">Анна Сидорова (IT Отдел)</option>
              <option value="user3">Елена Волкова (Бухгалтерия)</option>
            </select>
          </div>

          <!-- Выбор департамента -->
          <div v-if="assignType === 'department'">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Департамент <span class="text-red-500">*</span>
            </label>
            <select
              v-model="assignData.departmentId"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="">Выберите департамент</option>
              <option value="IT Отдел">IT Отдел</option>
              <option value="Бухгалтерия">Бухгалтерия</option>
              <option value="HR">HR</option>
              <option value="Маркетинг">Маркетинг</option>
            </select>
            <p class="text-xs text-amber-600 mt-2 flex items-start gap-1">
              <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Чат будет передан в другой департамент</span>
            </p>
          </div>

          <!-- Причина -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Причина <span class="text-red-500">*</span>
            </label>
            <select
              v-model="assignData.reason"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="">Выберите причину</option>
              <option value="По нагрузке">По нагрузке</option>
              <option value="По компетенции">По компетенции</option>
              <option value="Отсутствие сотрудника">Отсутствие сотрудника</option>
              <option value="Другое">Другое</option>
            </select>
          </div>

          <!-- Комментарий -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Комментарий
            </label>
            <textarea
              v-model="assignData.comment"
              placeholder="Дополнительная информация о причине переназначения..."
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
            ></textarea>
          </div>
        </div>

        <!-- Кнопки -->
        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            @click="showAssignModal = false"
            class="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium"
          >
            Отмена
          </button>
          <button
            @click="confirmAssign"
            :disabled="!isAssignFormValid"
            class="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  currentChatId: {
    type: [Number, String],
    default: null
  }
})

const emit = defineEmits(['toggle-sidebar'])

const route = useRoute()
const searchQuery = ref('')
const activeTab = ref('all')
const showCreateChatModal = ref(false)
const showAssignMenu = ref(false)
const showAssignModal = ref(false)
const assignType = ref('user')

const user = ref({
  name: 'Иван Петров',
  department: 'IT Отдел',
  role: 'Администратор департамента' // Супер-администратор | Администратор департамента | Сотрудник
})

const tabs = [
  { id: 'all', label: 'Все' },
  { id: 'my', label: 'Мои' },
  { id: 'department', label: 'Отдел' }
]

const chats = ref([
  {
    id: 1,
    name: 'Sarah Miller',
    initials: 'SM',
    avatarColor: 'bg-pink-500',
    lastMessage: 'Can we review the Q3 report?',
    time: '10:42',
    unread: 2,
    online: true,
    chatStatus: 'viewed', // sent | viewed | resolved | closed
    assignedTo: 'Иван Петров'
  },
  {
    id: 2,
    name: 'Ошибка деплоя',
    initials: 'ОД',
    avatarColor: 'bg-gray-500',
    lastMessage: 'Deployment successful',
    time: '09:15',
    unread: 0,
    status: 'offline',
    chatStatus: 'resolved',
    assignedTo: 'Анна Сидорова'
  },
  {
    id: 3,
    name: 'Запрос на отпуск',
    initials: 'АС',
    avatarColor: 'bg-orange-500',
    lastMessage: 'Please check the attached files when ...',
    time: 'Yesterday',
    unread: 5,
    online: false,
    chatStatus: 'sent',
    assignedTo: null
  },
  {
    id: 4,
    name: 'Проблема с доступом',
    initials: 'ПД',
    avatarColor: 'bg-red-500',
    lastMessage: 'Вопрос решён, спасибо!',
    time: 'Yesterday',
    unread: 0,
    online: false,
    chatStatus: 'closed',
    assignedTo: 'Иван Петров'
  }
])

// Данные нового чата
const newChat = ref({
  department: '',
  subject: '',
  description: ''
})

// Данные для назначения
const assignData = ref({
  userId: '',
  departmentId: '',
  reason: '',
  comment: ''
})

// Текущий исполнитель (для отображения в модалке)
const currentAssignedUser = computed(() => {
  if (!props.currentChatId) return null
  const chat = chats.value.find(c => c.id === props.currentChatId)
  return chat?.assignedTo || 'Не назначен'
})

// Заголовок модалки назначения
const assignModalTitle = computed(() => {
  const titles = {
    user: 'Назначить пользователю',
    department: 'Назначить департаменту'
  }
  return titles[assignType.value] || 'Назначить'
})

// Валидация формы назначения
const isAssignFormValid = computed(() => {
  if (assignType.value === 'user') {
    return assignData.value.userId && assignData.value.reason
  } else {
    return assignData.value.departmentId && assignData.value.reason
  }
})

const filteredChats = computed(() => {
  if (!searchQuery.value) return chats.value
  
  return chats.value.filter(chat => {
    const search = searchQuery.value.toLowerCase()
    return chat.name.toLowerCase().includes(search) ||
           chat.lastMessage?.toLowerCase().includes(search)
  })
})

// Открыть модалку назначения
const openAssignModal = (type) => {
  assignType.value = type
  showAssignMenu.value = false
  showAssignModal.value = true
}

// Создать чат
const createChat = () => {
  if (!newChat.value.department || !newChat.value.subject || !newChat.value.description) return
  
  console.log('Создание чата:', newChat.value)
  
  // TODO: API call для создания чата
  // После успешного создания - редирект на новый чат
  
  showCreateChatModal.value = false
  
  // Очистка формы
  newChat.value = {
    department: '',
    subject: '',
    description: ''
  }
}

// Подтверждение назначения
const confirmAssign = () => {
  if (!isAssignFormValid.value) return
  
  const payload = {
    chatRequestId: props.currentChatId,
    newAssignedUserId: assignData.value.userId || assignData.value.departmentId,
    reassignedByUserId: user.value.id,
    reason: assignData.value.reason,
    comment: assignData.value.comment,
    type: assignType.value
  }
  
  console.log('Назначение чата:', payload)
  
  // TODO: API call для переназначения
  
  showAssignModal.value = false
  
  // Очистка формы
  assignData.value = {
    userId: '',
    departmentId: '',
    reason: '',
    comment: ''
  }
}

// Закрытие выпадающего меню при клике вне его
if (typeof window !== 'undefined') {
  window.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showAssignMenu.value = false
    }
  })
}
</script>