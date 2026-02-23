// stores/departments.js
import { defineStore } from 'pinia'

export const useDepartmentsStore = defineStore('departments', {
  state: () => ({
    departments: [],
    isLoading: false,
    error: null
  }),

  actions: {
    async fetchDepartments(isActive = null) {
      const { apiFetch } = useApi()
      this.isLoading = true
      const query = isActive !== null ? `?isActive=${isActive}` : ''
      const { data, error } = await apiFetch(`/api/department${query}`)
      if (data) this.departments = data
      this.error = error
      this.isLoading = false
    },

    async createDepartment(payload) {
      const { apiFetch } = useApi()
      const { data, error } = await apiFetch('/api/department', {
        method: 'POST',
        body: payload
      })
      if (!error) await this.fetchDepartments()
      return { data, error }
    },

    async updateDepartment(id, payload) {
      const { apiFetch } = useApi()
      const { data, error } = await apiFetch(`/api/department/${id}`, {
        method: 'PUT',
        body: payload
      })
      if (!error) await this.fetchDepartments()
      return { data, error }
    },

    async deleteDepartment(id) {
      const { apiFetch } = useApi()
      const { data, error } = await apiFetch(`/api/department/${id}`, { method: 'DELETE' })
      if (!error) {
        this.departments = this.departments.filter(d => d.id !== id)
      }
      return { data, error }
    }
  }
})