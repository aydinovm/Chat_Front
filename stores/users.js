// stores/users.js
import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    isLoading: false,
    error: null
  }),

  actions: {
    async fetchUsers(departmentId = null) {
      const { apiFetch } = useApi()
      this.isLoading = true
      const query = departmentId ? `?departmentId=${departmentId}` : ''
      const { data, error } = await apiFetch(`/api/user${query}`)
      if (data) this.users = data
      this.error = error
      this.isLoading = false
    },

    async createUser(payload) {
      const { apiFetch } = useApi()
      const { data, error } = await apiFetch('/api/user', {
        method: 'POST',
        body: payload
      })
      if (!error) await this.fetchUsers()
      return { data, error }
    },

    async updateUser(id, payload) {
      const { apiFetch } = useApi()
      const { data, error } = await apiFetch(`/api/user/${id}`, {
        method: 'PUT',
        body: payload
      })
      if (!error) await this.fetchUsers()
      return { data, error }
    },

    async deleteUser(id) {
      const { apiFetch } = useApi()
      const { data, error } = await apiFetch(`/api/user/${id}`, { method: 'DELETE' })
      if (!error) {
        this.users = this.users.filter(u => u.id !== id)
      }
      return { data, error }
    },
async changePassword(currentPassword, newPassword, confirmPassword) {
  const { apiFetch } = useApi()

  // фронтовая проверка confirmPassword оставим, в бэк не нужно
  if (newPassword !== confirmPassword) {
    return { data: null, error: 'Пароли не совпадают' }
  }

  const { data, error } = await apiFetch('/api/auth/change-password', {
    method: 'POST',
    body: {
      oldPassword: currentPassword, // ✅ ВАЖНО
      newPassword                  // ✅ ВАЖНО
    }
  })

  let message = null
  if (error) {
    message =
      error?.data?.error ||
      error?.data?.message ||
      error?.message ||
      'Не удалось сменить пароль'
  }

  return { data, error: message }
}
  }
})