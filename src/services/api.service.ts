import { getToken } from '@/utils/token'
import { globalErrorHandler } from '@/composables/useErrorHandler'

const API_BASE_URL = 'https://api.takeit.ciph3r.co/api/v1'

class ApiService {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }

    const token = getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      const errorDetails = globalErrorHandler.handleHttpError({
        status: response.status,
        message: errorData.message || response.statusText,
        details: errorData.details || null
      })
      
      throw errorDetails
    }

    return response.json()
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
        headers: this.getHeaders()
      })

      return this.handleResponse<T>(response)
    } catch (error: any) {
      throw error
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      })

      return this.handleResponse<T>(response)
    } catch (error: any) {
      throw error
    }
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      })

      return this.handleResponse<T>(response)
    } catch (error: any) {
      throw error
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      })

      return this.handleResponse<T>(response)
    } catch (error: any) {
      throw error
    }
  }
}

export const apiService = new ApiService()