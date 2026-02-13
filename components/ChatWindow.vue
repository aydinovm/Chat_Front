<template>
  <div class="flex flex-col h-screen bg-gray-50">
    
    <!-- Шапка чата -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between mb-3">
        <!-- Информация о чате -->
        <div class="flex items-center gap-3">
          <!-- Аватар с инициалами -->
          <div 
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm',
              currentChat.avatarColor
            ]"
          >
            {{ currentChat.initials }}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-semibold text-gray-900">{{ currentChat.name }}</h2>
              <span v-if="currentChat.online" class="flex items-center gap-1 text-xs text-green-600">
                <span class="w-2 h-2 bg-green-600 rounded-full"></span>
                В сети
              </span>
            </div>
            <p class="text-sm text-gray-500">{{ currentChat.department }}</p>
          </div>
        </div>

        <!-- Кнопки действий -->
        <div class="flex items-center gap-2">
          <button 
            @click="showHistoryModal = true"
            class="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            История
          </button>
          
          <button 
            v-if="currentChat.chatStatus !== 'resolved' && currentChat.chatStatus !== 'closed'"
            @click="resolveChat"
            :disabled="userRole === 'Сотрудник'"
            class="px-3 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Resolve
          </button>
          
          <button 
            v-if="userRole === 'Супер-администратор' && currentChat.chatStatus !== 'closed'"
            @click="closeChat"
            class="px-3 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Close
          </button>
        </div>
      </div>

      <!-- Дополнительная информация -->
      <div class="flex items-center gap-4 text-sm">
        <!-- Статус чата -->
        <div class="flex items-center gap-2">
          <span class="text-gray-500">Статус:</span>
          <span
            :class="[
              'px-2.5 py-1 text-xs font-semibold rounded-full',
              currentChat.chatStatus === 'sent' ? 'bg-gray-200 text-gray-700' :
              currentChat.chatStatus === 'viewed' ? 'bg-blue-100 text-blue-700' :
              currentChat.chatStatus === 'resolved' ? 'bg-green-100 text-green-700' :
              currentChat.chatStatus === 'closed' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-600'
            ]"
          >
            {{ 
              currentChat.chatStatus === 'sent' ? 'Отправлено' :
              currentChat.chatStatus === 'viewed' ? 'Просмотрено' :
              currentChat.chatStatus === 'resolved' ? 'Решено' :
              currentChat.chatStatus === 'closed' ? 'Закрыто' :
              'Новый'
            }}
          </span>
        </div>

        <!-- Назначенный сотрудник -->
        <div class="flex items-center gap-2">
          <span class="text-gray-500">Исполнитель:</span>
          <span class="font-medium text-gray-900">{{ currentChat.assignedTo || 'Не назначен' }}</span>
        </div>
      </div>
    </div>

    <!-- Предупреждение для закрытых чатов -->
    <div v-if="currentChat.chatStatus === 'closed'" class="bg-red-50 border-b border-red-200 px-6 py-3">
      <div class="flex items-center gap-2 text-sm text-red-700">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span class="font-medium">Этот чат закрыт. Новые сообщения отправлять нельзя.</span>
      </div>
    </div>

    <!-- Область с сообщениями -->
    <div class="flex-1 overflow-y-auto px-6 py-6 space-y-4">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="[
          'flex gap-3',
          message.isOwn ? 'flex-row-reverse' : 'flex-row'
        ]"
      >
        <!-- Аватар (только для чужих сообщений) -->
        <div
          v-if="!message.isOwn"
          :class="[
            'w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0',
            message.avatarColor
          ]"
        >
          {{ message.initials }}
        </div>
        
        <!-- Сообщение -->
        <div :class="['max-w-xl', message.isOwn ? 'items-end' : 'items-start']">
          <!-- Имя отправителя (для чужих сообщений) -->
          <div v-if="!message.isOwn" class="text-xs text-gray-500 mb-1 px-2">
            {{ message.sender }}
          </div>
          
          <!-- Пузырь сообщения -->
          <div
            :class="[
              'rounded-2xl overflow-hidden',
              message.isOwn 
                ? 'bg-green-700 text-white rounded-tr-none' 
                : 'bg-white border border-gray-200 text-gray-900 rounded-tl-none'
            ]"
          >
            <!-- Изображение (если есть) -->
            <img 
              v-if="message.image" 
              :src="message.image" 
              alt="Attached image"
              class="max-w-xs w-full rounded-lg cursor-pointer hover:opacity-90 transition"
              @click="openImageModal(message.image)"
            />
            
            <!-- Текст сообщения -->
            <p v-if="message.text" :class="['text-sm', message.image ? 'px-4 py-2' : 'px-4 py-2']">
              {{ message.text }}
            </p>
          </div>
          
          <!-- Время и статус -->
          <div
            :class="[
              'text-xs mt-1 flex items-center gap-1 px-2',
              message.isOwn ? 'justify-end' : 'justify-start'
            ]"
          >
            <span class="text-gray-500">{{ message.time }}</span>
            
            <!-- Галочки прочтения (только для своих сообщений) -->
            <div v-if="message.isOwn" class="flex items-center">
              <!-- Одна галочка - доставлено -->
              <svg 
                v-if="message.status === 'delivered'"
                class="w-4 h-4 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              
              <!-- Две галочки - прочитано -->
              <div v-if="message.status === 'read'" class="relative">
                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <svg class="w-4 h-4 text-blue-500 absolute -left-1 top-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <!-- Отправка -->
              <svg 
                v-if="message.status === 'sending'"
                class="w-4 h-4 text-gray-300 animate-spin" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Пустое состояние -->
      <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-center">
        <svg class="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Нет сообщений</h3>
        <p class="text-gray-500">Начните переписку, отправив первое сообщение</p>
      </div>
    </div>

    <!-- Поле ввода сообщения -->
    <div 
      v-if="currentChat.chatStatus !== 'closed'" 
      class="bg-white border-t border-gray-200 px-6 py-4"
    >
      <!-- Превью выбранного изображения -->
      <div v-if="selectedImage" class="mb-3 relative inline-block">
        <img 
          :src="selectedImage.preview" 
          alt="Preview" 
          class="max-h-32 rounded-lg border border-gray-300"
        />
        <button
          @click="removeImage"
          class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition flex items-center justify-center"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex items-center gap-3">
        <!-- Кнопка прикрепить файл -->
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handleFileSelect"
          class="hidden"
        />
        <button 
          @click="$refs.fileInput.click()"
          class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>

        <!-- Поле ввода -->
        <input
          v-model="newMessage"
          @keydown.enter.exact.prevent="sendMessage"
          type="text"
          placeholder="Введите сообщение..."
          class="flex-1 px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
        />

        <!-- Кнопка отправить -->
        <button
          @click="sendMessage"
          :disabled="!newMessage.trim() && !selectedImage"
          class="p-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Модалка "История переназначений" -->
    <div 
      v-if="showHistoryModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showHistoryModal = false"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        <!-- Шапка -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-900">История переназначений</h2>
          <button 
            @click="showHistoryModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Список истории -->
        <div class="flex-1 overflow-y-auto px-6 py-4">
          <div v-if="reassignmentHistory.length === 0" class="text-center py-8">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gray-500">Переназначений не было</p>
          </div>

          <div v-else class="space-y-4">
            <div 
              v-for="(item, index) in reassignmentHistory" 
              :key="index"
              class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                    {{ item.reassignedByInitials }}
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-900">{{ item.reassignedBy }}</p>
                    <p class="text-xs text-gray-500">{{ item.datetime }}</p>
                  </div>
                </div>
                <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                  {{ item.reason }}
                </span>
              </div>

              <div class="flex items-center gap-2 text-sm text-gray-600 ml-10">
                <span class="font-medium">{{ item.oldAssignee }}</span>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span class="font-medium">{{ item.newAssignee }}</span>
              </div>

              <p v-if="item.comment" class="text-sm text-gray-600 mt-2 ml-10 italic">
                "{{ item.comment }}"
              </p>
            </div>
          </div>
        </div>

        <!-- Футер -->
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            @click="showHistoryModal = false"
            class="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg transition font-medium"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>

    <!-- Модалка для просмотра изображения -->
    <div 
      v-if="imageModalSrc"
      class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      @click="imageModalSrc = null"
    >
      <button 
        @click="imageModalSrc = null"
        class="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <img 
        :src="imageModalSrc" 
        alt="Full size image"
        class="max-w-full max-h-full object-contain rounded-lg"
        @click.stop
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// Props
const props = defineProps({
  chatId: {
    type: [Number, String],
    required: true
  }
})

// Данные
const newMessage = ref('')
const currentChat = ref({})
const messages = ref([])
const showHistoryModal = ref(false)
const userRole = ref('Администратор департамента') // Супер-администратор | Администратор департамента | Сотрудник
const selectedImage = ref(null)
const imageModalSrc = ref(null)
const fileInput = ref(null)

// История переназначений
const reassignmentHistory = ref([
  {
    reassignedBy: 'Сергей Иванов',
    reassignedByInitials: 'СИ',
    oldAssignee: 'Иван Петров',
    newAssignee: 'Анна Сидорова',
    reason: 'По нагрузке',
    comment: 'Иван перегружен другими задачами',
    datetime: '2024-02-12 14:30'
  },
  {
    reassignedBy: 'Иван Петров',
    reassignedByInitials: 'ИП',
    oldAssignee: 'Не назначен',
    newAssignee: 'Иван Петров',
    reason: 'По компетенции',
    comment: null,
    datetime: '2024-02-10 09:15'
  }
])

// Моковые данные для разных чатов
const chatData = {
  1: {
    name: 'Sarah Miller',
    initials: 'SM',
    avatarColor: 'bg-pink-500',
    department: 'Проект #p1 • Sarah Miller',
    online: true,
    chatStatus: 'viewed',
    assignedTo: 'Иван Петров',
    messages: [
      {
        id: 1,
        sender: 'Sarah Miller',
        initials: 'SM',
        avatarColor: 'bg-pink-500',
        text: 'Hi there! Do you have a minute?',
        time: '10:30',
        isOwn: false
      },
      {
        id: 2,
        text: "Sure, what's up?",
        time: '10:31',
        isOwn: true,
        status: 'read' // sending | delivered | read
      },
      {
        id: 3,
        sender: 'Sarah Miller',
        initials: 'SM',
        avatarColor: 'bg-pink-500',
        text: 'Can we review the Q3 report?',
        time: '10:42',
        isOwn: false
      },
      {
        id: 4,
        text: 'Of course! Let me check the latest version.',
        time: '10:43',
        isOwn: true,
        status: 'delivered'
      },
      {
        id: 5,
        sender: 'Sarah Miller',
        initials: 'SM',
        avatarColor: 'bg-pink-500',
        text: 'Here is the screenshot of the issue',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
        time: '10:45',
        isOwn: false
      }
    ]
  },
  2: {
    name: 'Ошибка деплоя',
    initials: 'ОД',
    avatarColor: 'bg-gray-500',
    department: 'Проект #p2 • Deployment Team',
    online: false,
    chatStatus: 'resolved',
    assignedTo: 'Анна Сидорова',
    messages: [
      {
        id: 1,
        sender: 'System',
        initials: 'SY',
        avatarColor: 'bg-gray-500',
        text: 'Deployment failed. Please check the logs.',
        time: '09:10',
        isOwn: false
      },
      {
        id: 2,
        text: 'Checking now...',
        time: '09:12',
        isOwn: true,
        status: 'read'
      },
      {
        id: 3,
        text: 'Deployment successful',
        time: '09:15',
        isOwn: true,
        status: 'read'
      }
    ]
  },
  3: {
    name: 'Запрос на отпуск',
    initials: 'АС',
    avatarColor: 'bg-orange-500',
    department: 'Проект #p3 • Alex Chen',
    online: false,
    chatStatus: 'sent',
    assignedTo: null,
    messages: [
      {
        id: 1,
        sender: 'Alex Chen',
        initials: 'АС',
        avatarColor: 'bg-orange-500',
        text: 'Hi, I would like to request vacation leave from December 15-29. Is this possible?',
        time: 'Yesterday',
        isOwn: false
      },
      {
        id: 2,
        text: 'Let me check the schedule.',
        time: 'Yesterday',
        isOwn: true,
        status: 'delivered'
      },
      {
        id: 3,
        sender: 'Alex Chen',
        initials: 'АС',
        avatarColor: 'bg-orange-500',
        text: 'Please check the attached files when you have time.',
        time: 'Yesterday',
        isOwn: false
      }
    ]
  },
  4: {
    name: 'Проблема с доступом',
    initials: 'ПД',
    avatarColor: 'bg-red-500',
    department: 'IT Отдел',
    online: false,
    chatStatus: 'closed',
    assignedTo: 'Иван Петров',
    messages: [
      {
        id: 1,
        sender: 'Пользователь',
        initials: 'ПД',
        avatarColor: 'bg-red-500',
        text: 'Не могу войти в систему',
        time: 'Yesterday',
        isOwn: false
      },
      {
        id: 2,
        text: 'Сейчас проверю ваши права доступа',
        time: 'Yesterday',
        isOwn: true,
        status: 'read'
      },
      {
        id: 3,
        text: 'Права восстановлены, попробуйте войти',
        time: 'Yesterday',
        isOwn: true,
        status: 'read'
      },
      {
        id: 4,
        sender: 'Пользователь',
        initials: 'ПД',
        avatarColor: 'bg-red-500',
        text: 'Всё работает, спасибо!',
        time: 'Yesterday',
        isOwn: false
      }
    ]
  }
}

// Загрузка данных чата
const loadChat = (chatId) => {
  const data = chatData[chatId] || chatData[1]
  
  currentChat.value = {
    name: data.name,
    initials: data.initials,
    avatarColor: data.avatarColor,
    department: data.department,
    online: data.online,
    chatStatus: data.chatStatus,
    assignedTo: data.assignedTo
  }
  
  messages.value = [...data.messages]
}

// Отправка сообщения
const sendMessage = () => {
  if (!newMessage.value.trim() && !selectedImage.value) return
  if (currentChat.value.chatStatus === 'closed') return

  const newMsg = {
    id: messages.value.length + 1,
    text: newMessage.value,
    image: selectedImage.value ? selectedImage.value.preview : null,
    time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    isOwn: true,
    status: 'sending'
  }

  messages.value.push(newMsg)
  newMessage.value = ''
  selectedImage.value = null

  // Симуляция доставки
  setTimeout(() => {
    newMsg.status = 'delivered'
  }, 500)

  // Симуляция прочтения
  setTimeout(() => {
    newMsg.status = 'read'
  }, 2000)

  // TODO: API call для отправки сообщения с изображением
  // if (newMsg.image) {
  //   const formData = new FormData()
  //   formData.append('message', newMsg.text)
  //   formData.append('image', selectedImage.value.file)
  //   // отправка formData
  // }
}

// Обработка выбора файла
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Проверка типа файла
  if (!file.type.startsWith('image/')) {
    alert('Пожалуйста, выберите изображение')
    return
  }

  // Проверка размера (максимум 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    alert('Размер изображения не должен превышать 5MB')
    return
  }

  // Создание превью
  const reader = new FileReader()
  reader.onload = (e) => {
    selectedImage.value = {
      file: file,
      preview: e.target.result
    }
  }
  reader.readAsDataURL(file)

  // Очистка input для возможности повторного выбора того же файла
  event.target.value = ''
}

// Удаление выбранного изображения
const removeImage = () => {
  selectedImage.value = null
}

// Открыть изображение в полном размере
const openImageModal = (imageSrc) => {
  imageModalSrc.value = imageSrc
}

// Resolve чата
const resolveChat = () => {
  if (userRole.value === 'Сотрудник') return
  
  if (confirm('Вы уверены, что хотите пометить чат как решённый?')) {
    currentChat.value.chatStatus = 'resolved'
    console.log('Чат помечен как Resolved')
    // TODO: API call
  }
}

// Закрыть чат
const closeChat = () => {
  if (userRole.value !== 'Супер-администратор') return
  
  if (confirm('Вы уверены, что хотите закрыть чат? После закрытия отправка сообщений будет невозможна.')) {
    currentChat.value.chatStatus = 'closed'
    console.log('Чат закрыт')
    // TODO: API call
  }
}

// Следим за изменением chatId
watch(
  () => props.chatId,
  (newChatId) => {
    console.log('Загрузка чата ID:', newChatId)
    loadChat(newChatId)
  },  
  { immediate: true }
)
</script>