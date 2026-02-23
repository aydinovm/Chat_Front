// composables/useApi.js
export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase

  const getToken = () => {
    if (process.client) {
      return localStorage.getItem('token')
    }
    return null
  }

  const apiFetch = async (endpoint, options = {}) => {
    const token = getToken()
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }

    try {
      const response = await $fetch(`${baseURL}${endpoint}`, {
        ...options,
        headers
      })
      return { data: response, error: null }
    } catch (err) {
      const error = err?.data?.error || err?.message || 'Произошла ошибка'
      return { data: null, error }
    }
  }

  return { apiFetch }
}