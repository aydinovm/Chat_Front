<template>
  <div class="flex flex-col h-screen bg-gray-50">
    
    <!-- Шапка чата -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-3">
          <div v-if="isLoading" class="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
          <div 
            v-else
            :class="['w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm', currentChat.avatarColor]"
          >
            {{ currentChat.initials }}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-semibold text-gray-900">{{ currentChat.name || 'Загрузка...' }}</h2>
            </div>
            <p class="text-sm text-gray-500">{{ currentChat.department }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button 
            @click="openHistory"
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
            :disabled="userRole === 'Сотрудник' || isActionLoading"
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
            :disabled="isActionLoading"
            class="px-3 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition flex items-center gap-2 disabled:opacity-50"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Close
          </button>
        </div>
      </div>

      <div class="flex items-center gap-4 text-sm">
        <div class="flex items-center gap-2">
          <span class="text-gray-500">Статус:</span>
          <span :class="statusClass(currentChat.chatStatus)">
            {{ statusLabel(currentChat.chatStatus) }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-gray-500">Исполнитель:</span>
          <span class="font-medium text-gray-900">{{ currentChat.assignedTo || 'Не назначен' }}</span>
        </div>
      </div>
    </div>

    <!-- Закрытый чат -->
    <div v-if="currentChat.chatStatus === 'closed'" class="bg-red-50 border-b border-red-200 px-6 py-3">
      <div class="flex items-center gap-2 text-sm text-red-700">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span class="font-medium">Этот чат закрыт. Новые сообщения отправлять нельзя.</span>
      </div>
    </div>

    <!-- Сообщения -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto px-6 py-6 space-y-4">
      <!-- Loading -->
      <div v-if="isMessagesLoading" class="flex justify-center py-8">
        <svg class="w-8 h-8 animate-spin text-green-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
        </svg>
      </div>

      <div
        v-for="message in messages"
        :key="message.id"
        :class="['flex gap-3', message.isOwn ? 'flex-row-reverse' : 'flex-row']"
      >
        <div
          v-if="!message.isOwn"
          :class="['w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0', message.avatarColor]"
        >
          {{ message.initials }}
        </div>
        
        <div :class="['max-w-xl', message.isOwn ? 'items-end' : 'items-start']">
          <div v-if="!message.isOwn" class="text-xs text-gray-500 mb-1 px-2">{{ message.sender }}</div>
          
          <div :class="['rounded-2xl overflow-hidden', message.isOwn ? 'bg-green-700 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-900 rounded-tl-none']">
            <img 
              v-if="message.image" 
              :src="message.image" 
              alt="Attached"
              class="max-w-xs w-full cursor-pointer hover:opacity-90 transition"
              @click="openImageModal(message.image)"
            />
            <p v-if="message.text" class="text-sm px-4 py-2">{{ message.text }}</p>
          </div>
          
          <div :class="['text-xs mt-1 flex items-center gap-1 px-2', message.isOwn ? 'justify-end' : 'justify-start']">
            <span class="text-gray-500">{{ message.time }}</span>
            <div v-if="message.isOwn" class="flex items-center">
              <svg v-if="message.status === 'sending'" class="w-4 h-4 text-gray-300 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <svg v-else-if="message.status === 'delivered'" class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <div v-else-if="message.status === 'read'" class="relative">
                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <svg class="w-4 h-4 text-blue-500 absolute -left-1 top-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!isMessagesLoading && messages.length === 0" class="flex flex-col items-center justify-center h-full text-center">
        <svg class="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Нет сообщений</h3>
        <p class="text-gray-500">Начните переписку</p>
      </div>
    </div>

    <!-- Ввод сообщения -->
    <div v-if="currentChat.chatStatus !== 'closed'" class="bg-white border-t border-gray-200 px-6 py-4">
      <div v-if="selectedImage" class="mb-3 relative inline-block">
        <img :src="selectedImage.preview" alt="Preview" class="max-h-32 rounded-lg border border-gray-300" />
        <button @click="removeImage" class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition flex items-center justify-center">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex items-center gap-3">
        <input ref="fileInput" type="file" accept="image/*" @change="handleFileSelect" class="hidden" />
        <button @click="$refs.fileInput.click()" class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>

        <input
          v-model="newMessage"
          @keydown.enter.exact.prevent="sendMessage"
          type="text"
          placeholder="Введите сообщение..."
          class="flex-1 px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
        />

        <button
          @click="sendMessage"
          :disabled="(!newMessage.trim() && !selectedImage) || isSending"
          class="p-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Модалка история -->
    <div v-if="showHistoryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showHistoryModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-900">История переназначений</h2>
          <button @click="showHistoryModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto px-6 py-4">
          <div v-if="chatsStore.reassignmentHistory.length === 0" class="text-center py-8 text-gray-500">
            Переназначений не было
          </div>
          <div v-else class="space-y-4">
            <div v-for="(item, i) in chatsStore.reassignmentHistory" :key="i" class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                    {{ getInitials(item.reassignedByFullName) }}
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-900">{{ item.reassignedByFullName }}</p>
                    <p class="text-xs text-gray-500">{{ formatDate(item.reassignedAt) }}</p>
                  </div>
                </div>
                <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">{{ item.reason }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-600 ml-10">
                <span class="font-medium">{{ item.oldAssigneeFullName || 'Не назначен' }}</span>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span class="font-medium">{{ item.newAssigneeFullName }}</span>
              </div>
              <p v-if="item.comment" class="text-sm text-gray-600 mt-2 ml-10 italic">"{{ item.comment }}"</p>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button @click="showHistoryModal = false" class="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg transition font-medium">Закрыть</button>
        </div>
      </div>
    </div>

    <!-- Модалка изображения -->
    <div v-if="imageModalSrc" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4" @click="imageModalSrc = null">
      <button @click="imageModalSrc = null" class="absolute top-4 right-4 text-white hover:text-gray-300 z-10">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <img :src="imageModalSrc" alt="Full size" class="max-w-full max-h-full object-contain rounded-lg" @click.stop />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  chatId: { type: [Number, String], required: true }
})

const authStore = useAuthStore()
const chatsStore = useChatsStore()
const signalR = useSignalR()

const newMessage = ref('')
const showHistoryModal = ref(false)
const selectedImage = ref(null)
const imageModalSrc = ref(null)
const fileInput = ref(null)
const messagesContainer = ref(null)
const isSending = ref(false)
const isLoading = ref(false)
const isActionLoading = ref(false)

const currentChat = computed(() => chatsStore.currentChat || {})
const messages = computed(() => chatsStore.messages)
const isMessagesLoading = computed(() => chatsStore.isMessagesLoading)
const userRole = computed(() => authStore.userRole)

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const loadChat = async (chatId) => {
  if (!chatId) return
  isLoading.value = true
  await chatsStore.fetchChatById(chatId)
  await chatsStore.fetchMessages(chatId)
  await chatsStore.markAsRead(chatId)
  isLoading.value = false
  scrollToBottom()

  // Join SignalR room
  await signalR.joinChat(chatId)
}

const sendMessage = async () => {
  if ((!newMessage.value.trim() && !selectedImage.value) || isSending.value) return
  if (currentChat.value.chatStatus === 'closed') return

  isSending.value = true

  const text = newMessage.value
  newMessage.value = ''

  const tempMsg = {
    id: `temp-${Date.now()}`,
    text,
    image: selectedImage.value?.preview || null,
    time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    isOwn: true,
    status: 'sending',
    senderUserId: authStore.user?.userId
  }

  chatsStore.messages.push(tempMsg)
  selectedImage.value = null
  scrollToBottom()

  const { data, error } = await chatsStore.sendMessage(props.chatId, text)

  if (error) {
    chatsStore.messages = chatsStore.messages.filter(m => m.id !== tempMsg.id)
    alert('Ошибка отправки сообщения: ' + error)
  } else {
    // сервер принял
    if (data?.messageId) {
      tempMsg.id = data.messageId
    }
    tempMsg.status = 'sent'
  }

  isSending.value = false
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return
  if (!file.type.startsWith('image/')) return alert('Только изображения')
  if (file.size > 5 * 1024 * 1024) return alert('Максимум 5MB')

  const reader = new FileReader()
  reader.onload = (e) => {
    selectedImage.value = { file, preview: e.target.result }
  }
  reader.readAsDataURL(file)
  event.target.value = ''
}

const removeImage = () => { selectedImage.value = null }
const openImageModal = (src) => { imageModalSrc.value = src }

const openHistory = async () => {
  await chatsStore.fetchReassignmentHistory(props.chatId)
  showHistoryModal.value = true
}

const resolveChat = async () => {
  if (!confirm('Пометить чат как решённый?')) return
  isActionLoading.value = true
  const { error } = await chatsStore.resolveChat(props.chatId)
  if (error) alert('Ошибка: ' + error)
  isActionLoading.value = false
}

const closeChat = async () => {
  if (!confirm('Закрыть чат? После закрытия сообщения недоступны.')) return
  isActionLoading.value = true
  const { error } = await chatsStore.closeChat(props.chatId)
  if (error) alert('Ошибка: ' + error)
  isActionLoading.value = false
}

// Status helpers
const statusLabel = (s) => ({
  sent: 'Отправлено', viewed: 'Просмотрено', resolved: 'Решено', closed: 'Закрыто'
}[s] || 'Новый')

const statusClass = (s) => {
  const base = 'px-2.5 py-1 text-xs font-semibold rounded-full'
  const colors = {
    sent: 'bg-gray-200 text-gray-700',
    viewed: 'bg-blue-100 text-blue-700',
    resolved: 'bg-green-100 text-green-700',
    closed: 'bg-red-100 text-red-700'
  }
  return `${base} ${colors[s] || 'bg-gray-100 text-gray-600'}`
}

const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'
const formatDate = (d) => d ? new Date(d).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : ''

// SignalR listeners
onMounted(async () => {
  await signalR.start()
  await loadChat(props.chatId)

  signalR.on('MessageSent', (payload) => {
    // Don't add if it's our own temp message already shown
    const exists = chatsStore.messages.some(m => m.id === payload.id)
    if (!exists) {
      chatsStore.addMessageFromSignalR(payload)
      scrollToBottom()
    }
  })

  signalR.on('MessagesRead', () => {
    chatsStore.messages.forEach(m => {
      if (m.isOwn) m.status = 'read'
    })
  })

  signalR.on('ChatUpdated', (payload) => {
    chatsStore.updateChatFromSignalR(payload)
  })

  signalR.on('ChatReassigned', (payload) => {
    if (payload.chatRequestId === props.chatId) {
      chatsStore.fetchChatById(props.chatId)
    }
  })
})

onUnmounted(async () => {
  await signalR.leaveChat(props.chatId)
  signalR.off('MessageSent')
  signalR.off('MessagesRead')
  signalR.off('ChatUpdated')
  signalR.off('ChatReassigned')
})

watch(() => props.chatId, async (newId, oldId) => {
  if (oldId) await signalR.leaveChat(oldId)
  await loadChat(newId)
})

watch(messages, () => scrollToBottom(), { deep: true })
</script>