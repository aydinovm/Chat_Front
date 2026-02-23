// stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isLoading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    isSuperAdmin: (state) => state.user?.isSuperAdmin === true,
    isDepartmentAdmin: (state) => state.user?.isDepartmentAdmin === true,
    userRole: (state) => {
      if (!state.user) return 'Сотрудник'
      if (state.user.isSuperAdmin) return 'Супер-администратор'
      if (state.user.isDepartmentAdmin) return 'Администратор департамента'
      return 'Сотрудник'
    }
  },

  actions: {
    async login(username, password) {
      const config = useRuntimeConfig()
      this.isLoading = true
      this.error = null

      try {
        const response = await $fetch(`${config.public.apiBase}/api/auth/login`, {
          method: 'POST',
          body: { username, password }
        })

        if (response) {
          this.token = response.token
          this.user = {
            userId: response.userId,
            fullName: response.fullName,
            username: response.username,
            departmentId: response.departmentId,
            departmentName: response.departmentName,
            departmentType: response.departmentType,
            isDepartmentAdmin: response.isDepartmentAdmin,
            isSuperAdmin: !response.departmentId // если нет departmentId — суперадмин
          }

          if (process.client) {
            localStorage.setItem('token', response.token)
            localStorage.setItem('user', JSON.stringify(this.user))
          }

          return { success: true }
        }
      } catch (err) {
        this.error = err?.data?.error || 'Неверный логин или пароль'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      this.token = null
      this.user = null
      if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
      navigateTo('/login')
    },

    restoreSession() {
      if (process.client) {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        if (token && user) {
          this.token = token
          this.user = JSON.parse(user)
        }
      }
    }
  }
})