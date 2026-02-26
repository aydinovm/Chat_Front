// stores/chats.js
import { defineStore } from 'pinia'

export const useChatsStore = defineStore('chats', {
  state: () => ({
    chats: [],
    currentChat: null,
    messages: [],
    reassignmentHistory: [],
    isLoading: false,
    isMessagesLoading: false,
    error: null
  }),

  getters: {
    filteredByStatus: (state) => (status) => {
      if (!status || status === 'all') return state.chats
      return state.chats.filter(c => c.status?.toLowerCase() === status)
    }
  },

  actions: {
    async fetchChats() {
      const { apiFetch } = useApi()
      this.isLoading = true
      const { data, error } = await apiFetch('/api/chat-requests')
      if (data) {
        this.chats = data.map(mapChatResponse)
      }
      this.error = error
      this.isLoading = false
    },

    async fetchChatById(id) {
      const { apiFetch } = useApi()
      const { data, error } = await apiFetch(`/api/chat-requests/${id}`)
      if (data) {
        this.currentChat = mapChatDetailResponse(data)
      }
      this.error = error
      return this.currentChat
    },

    async fetchMessages(chatId) {
      const { apiFetch } = useApi()
      this.isMessagesLoading = true
      const { data, error } = await apiFetch(`/api/chat/${chatId}/messages`)
      if (data) {
        this.messages = data.map(mapMessageResponse)
      }
      this.error = error
      this.isMessagesLoading = false
    },

async sendMessage(chatId, text, fileUrl = null) {
  const { apiFetch } = useApi()

  const type = fileUrl ? 3 : 1 // ✅ File=3, Text=1

  const { data, error } = await apiFetch(`/api/chat/${chatId}/messages`, {
    method: 'POST',
    body: {
      type,                 // ✅ number
      text: text || null,
      fileUrl: fileUrl || null
    }
  })

  return {
    data,
    error: error?.data?.error || error?.message || error
  }
},

    async markAsRead(chatId) {
      const { apiFetch } = useApi()
      await apiFetch(`/api/chat/${chatId}/messages/read`, { method: 'PUT' })
    },

    async createChat(toDepartmentId, title, description) {
      const { apiFetch } = useApi()
      const { data, error } = await apiFetch('/api/chat-requests', {
        method: 'POST',
        body: { toDepartmentId, title, description }
      })
      if (!error) {
        await this.fetchChats()
      }
      return { data, error }
    },

    async reassignChat(chatId, newAssignedUserId, toDepartmentId, reason, comment) {
      const { apiFetch } = useApi()
      const { data, error } = await apiFetch(`/api/chat-requests/${chatId}/reassign`, {
        method: 'PUT',
        body: { newAssignedUserId, toDepartmentId, reason, comment }
      })
      if (!error) {
        await this.fetchChatById(chatId)
      }
      return { data, error }
    },

    async resolveChat(chatId) {
      const { apiFetch } = useApi()
      const { data, error } = await apiFetch(`/api/chat-requests/${chatId}/resolve`, {
        method: 'PUT'
      })
      if (!error && this.currentChat) {
        this.currentChat.chatStatus = 'resolved'
        const chat = this.chats.find(c => c.id === chatId)
        if (chat) chat.chatStatus = 'resolved'
      }
      return { data, error }
    },

    async closeChat(chatId) {
      const { apiFetch } = useApi()
      const { data, error } = await apiFetch(`/api/chat-requests/${chatId}/close`, {
        method: 'PUT',
        body: {}
      })
      if (!error && this.currentChat) {
        this.currentChat.chatStatus = 'closed'
        const chat = this.chats.find(c => c.id === chatId)
        if (chat) chat.chatStatus = 'closed'
      }
      return { data, error }
    },

    async fetchReassignmentHistory(chatId) {
      const { apiFetch } = useApi()
      const { data } = await apiFetch(`/api/chats/${chatId}/reassignment-history`)
      if (data) {
        this.reassignmentHistory = data
      }
    },

    // Called from SignalR
    addMessageFromSignalR(payload) {
      const authStore = useAuthStore()
      const msg = mapMessageResponse(payload)
      msg.isOwn = msg.senderUserId === authStore.user?.userId
      this.messages.push(msg)

      // Update last message in list
      const chat = this.chats.find(c => c.id === payload.chatRequestId)
      if (chat) {
        chat.lastMessage = payload.text || 'Файл'
        if (!msg.isOwn) chat.unread = (chat.unread || 0) + 1
      }
    },

    updateChatFromSignalR(payload) {
      const idx = this.chats.findIndex(c => c.id === payload.id)
      if (idx !== -1) {
        this.chats[idx] = { ...this.chats[idx], ...mapChatResponse(payload) }
      }
      if (this.currentChat?.id === payload.id) {
        this.currentChat = { ...this.currentChat, ...mapChatDetailResponse(payload) }
      }
    }
  }
})

// ─── Mappers ───────────────────────────────────────────────
const COLORS = ['bg-blue-500','bg-purple-500','bg-green-500','bg-orange-500','bg-red-500','bg-pink-500','bg-teal-500']
const colorForId = (id) => COLORS[id?.charCodeAt(0) % COLORS.length] || 'bg-gray-500'
const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'

function mapChatResponse(c) {
  return {
    id: c.id,
    name: c.title,
    initials: initials(c.title),
    avatarColor: colorForId(c.id),
    lastMessage: c.description || '',
    time: formatTime(c.createdDate),
    unread: c.unreadMessagesCount || 0,
    chatStatus: c.status?.toLowerCase() || 'sent',
    assignedTo: c.assignedToFullName || c.assignedToUserName || null, // ← имя вместо UUID
    fromDepartmentId: c.fromDepartmentId,
    toDepartmentId: c.toDepartmentId,
    createdByUserId: c.createdByUserId,
    online: false
  }
}

function mapChatDetailResponse(c) {
  return {
    id: c.id,
    name: c.title,
    initials: initials(c.title),
    avatarColor: colorForId(c.id),
    department: c.description || '',
    online: false,
    chatStatus: c.status?.toLowerCase() || 'sent',
    assignedTo: c.assignedToUserId || null,
    fromDepartmentId: c.fromDepartmentId,
    toDepartmentId: c.toDepartmentId,
    unreadMessagesCount: c.unreadMessagesCount,
    totalMessagesCount: c.totalMessagesCount
  }
}

function mapMessageResponse(m) {
  const authStore = useAuthStore()
  const u = resolveUser(m.senderUserId)

  return {
    id: m.id,
    senderUserId: m.senderUserId,
    sender: u.name,
    initials: u.initials,
    avatarColor: colorForId(m.senderUserId),
    text: m.text,
    image: m.fileUrl || null,
    time: formatTime(m.sentAt),
    isOwn: m.senderUserId === authStore.user?.userId,
    status: m.isRead ? 'read' : 'sent',
    isRead: m.isRead
  }
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  if (isToday) {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return 'Вчера'
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
}
function resolveUser(userId) {
  const usersStore = useUsersStore()
  const u = usersStore.users?.find(x => x.id === userId)
  if (!u) return { name: 'User', initials: '??' }
  return {
    name: u.fullName || `@${u.username}` || 'User',
    initials: initials(u.fullName || u.username)
  }
}