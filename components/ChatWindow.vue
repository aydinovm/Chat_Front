<template>
  <div class="flex flex-col h-screen bg-gray-50">
    
    <!-- Шапка чата -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
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
              <span v-if="currentChat.online" class="text-xs text-green-600">
                В сети
              </span>
            </div>
            <p class="text-sm text-gray-500">{{ currentChat.project }}</p>
          </div>
        </div>

        <!-- Кнопки действий -->
        <div class="flex items-center gap-2">
          
          <button class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          <button class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
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
          <!-- Пузырь сообщения -->
          <div
            :class="[
              'rounded-2xl px-4 py-2',
              message.isOwn 
                ? 'bg-green-700 text-white rounded-tr-none' 
                : 'bg-white border border-gray-200 text-gray-900 rounded-tl-none'
            ]"
          >
            <p class="text-sm">{{ message.text }}</p>
          </div>
          
          <!-- Время -->
          <span
            :class="[
              'text-xs mt-1 block px-2',
              message.isOwn ? 'text-right text-gray-500' : 'text-left text-gray-500'
            ]"
          >
            {{ message.time }}
          </span>
        </div>
      </div>
    </div>

    <!-- Поле ввода сообщения -->
    <div class="bg-white border-t border-gray-200 px-6 py-4">
      <div class="flex items-center gap-3">
        <!-- Кнопка прикрепить файл -->
        <button class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        <!-- Поле ввода -->
        <input
          v-model="newMessage"
          @keydown.enter.exact.prevent="sendMessage"
          type="text"
          placeholder="Type a message..."
          class="flex-1 px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
        />

        <!-- Кнопка отправить -->
        <button
          @click="sendMessage"
          :disabled="!newMessage.trim()"
          class="p-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
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

// Моковые данные для разных чатов
const chatData = {
  1: {
    name: 'Sarah Miller',
    initials: 'SM',
    avatarColor: 'bg-pink-500',
    project: 'Проект #p1 • Sarah Miller',
    online: true,
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
        isOwn: true
      },
      {
        id: 3,
        sender: 'Sarah Miller',
        initials: 'SM',
        avatarColor: 'bg-pink-500',
        text: 'Can we review the Q3 report?',
        time: '10:42',
        isOwn: false
      }
    ]
  },
  2: {
    name: 'Ошибка деплоя',
    initials: 'ОД',
    avatarColor: 'bg-gray-500',
    project: 'Проект #p2 • Deployment Team',
    online: false,
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
        isOwn: true
      },
      {
        id: 3,
        text: 'Deployment successful',
        time: '09:15',
        isOwn: true
      }
    ]
  },
  3: {
    name: 'Запрос на отпуск',
    initials: 'АС',
    avatarColor: 'bg-orange-500',
    project: 'Проект #p3 • Alex Chen',
    online: false,
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
        isOwn: true
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
  }
}

// Загрузка данных чата
const loadChat = (chatId) => {
  const data = chatData[chatId] || chatData[1]
  
  currentChat.value = {
    name: data.name,
    initials: data.initials,
    avatarColor: data.avatarColor,
    project: data.project,
    online: data.online
  }
  
  messages.value = [...data.messages]
}

// Отправка сообщения
const sendMessage = () => {
  if (!newMessage.value.trim()) return

  messages.value.push({
    id: messages.value.length + 1,
    text: newMessage.value,
    time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    isOwn: true
  })

  newMessage.value = ''
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