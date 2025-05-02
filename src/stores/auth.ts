import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { AuthService } from '@/services/auth.service'
import type { User, LoginCredentials } from '@/types/auth.types'
import { setToken, removeToken, getToken } from '@/utils/token'

const USER_KEY = 'user_data'

const getStoredUser = (): User | null => {
  const userData = localStorage.getItem(USER_KEY)
  return userData ? JSON.parse(userData) : null
}

const setStoredUser = (userData: User | null): void => {
  if (userData) {
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
  } else {
    localStorage.removeItem(USER_KEY)
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(getStoredUser())
  const token = ref<string | null>(getToken())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials: LoginCredentials) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await AuthService.login(credentials)
      if (!response.user) {
        throw new Error('User data not received from server')
      }
      user.value = response.user
      token.value = response.token
      setStoredUser(response.user)

      return true
    } catch (err: any) {
      error.value = err.message
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    removeToken()
    setStoredUser(null)
  }

  const checkAuth = () => {
    const savedToken = getToken()
    const savedUser = getStoredUser()
    
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = savedUser
    } else {
      logout()
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    clearError
  }
})