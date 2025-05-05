import { getToken, removeToken, setToken } from '@/utils/token'
import { globalErrorHandler } from '@/composables/useErrorHandler'
import { AuthService } from './auth.service'
import router from '@/router'

const API_BASE_URL = 'https://api.takeit.ciph3r.co/api/v1'

class ApiService {
  private isRefreshing = false
    private failedQueue: Array<{  
    resolve: (value: void | PromiseLike<void>) => void
    reject: (error: any) => void
  }> = []

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    const token = getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  private async handleResponse<T>(response: Response, originalMethod?: string): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      // Si es error 401, intentamos reautenticar
      if (response.status === 401) {
        try {
          await this.handleTokenRefresh()
          // Reintentamos la petición original con el nuevo token
          const retryResponse = await fetch(response.url, {
            method: originalMethod || 'GET',
            headers: this.getHeaders(),
            body: originalMethod !== 'GET' ? response.body : undefined
          })  
          return this.handleResponse<T>(retryResponse)
        } catch (refreshError) {
          // Si falla el refresh, limpiamos el token y redirigimos al login
          this.clearTokenAndRedirect()
          throw refreshError
        }
      }
      
      // Maneja otros errores específicos de validación
      const errorDetails = globalErrorHandler.handleHttpError({
        status: response.status,
        message: errorData.message || response.statusText,
        details: errorData.data || null,
      })
      
      throw errorDetails
    }

    return response.json()
  }

  private async handleTokenRefresh(): Promise<void> {
    // Si ya estamos refrescando, ponemos la petición en cola
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject })
      })
    }

    this.isRefreshing = true

    try {
      // Intentamos reautenticar usando el AuthService
      const response = await AuthService.refreshToken()
      setToken(response.token)

      // Procesamos la cola de peticiones fallidas
      this.failedQueue.forEach(request => {
        request.resolve()
      })
    } catch (error) {
      this.failedQueue.forEach(request => {
        request.reject(error)
      })
      throw error
    } finally {
      this.failedQueue = []
      this.isRefreshing = false
    }
  }

  private clearTokenAndRedirect(): void {
    removeToken()
    router.push('/login')
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const url = new URL(`${API_BASE_URL}${endpoint}`)
      if (params) {
        Object.keys(params).forEach(key => 
          url.searchParams.append(key, params[key])
        )
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders(),
      })

      return this.handleResponse<T>(response, 'GET')
    } catch (error: any) {
      throw error
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })

      return this.handleResponse<T>(response, 'POST')
    } catch (error: any) {
      throw error
    }
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })

      return this.handleResponse<T>(response, 'PUT')
    } catch (error: any) {
      throw error
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      })

      return this.handleResponse<T>(response, 'DELETE')
    } catch (error: any) {
      throw error
    }
  }
}

export const apiService = new ApiService()