import { apiService } from './api.service'
import type { LoginCredentials, AuthResponse, ServerAuthResponse, User } from '@/types/auth.types'
import { setToken } from '@/utils/token'

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiService.post<ServerAuthResponse>('/login', {
        email: credentials.email,
        password: credentials.password
      })
      
      // Verificamos que la respuesta sea exitosa y contenga los datos necesarios
      if (!response.success || !response.data?.token) {
        throw new Error('La respuesta del servidor no contiene un token válido')
      }
      
      // Construimos la respuesta en el formato esperado
      const authResponse: AuthResponse = {
        token: response.data.token,
        user: response.data.user,
        message: response.message
      }

      // Guardamos el token
      setToken(authResponse.token)
      
      return authResponse
    } catch (error: any) {
      console.error('Error en login:', error)
      
      // Manejo específico de errores comunes
      if (error.message.includes('401')) {
        throw new Error('Credenciales inválidas. Por favor, verifica tu correo y contraseña.')
      } else if (error.message.includes('422')) {
        throw new Error('Datos de inicio de sesión incorrectos. Verifica los campos requeridos.')
      } else if (error.message.includes('429')) {
        throw new Error('Demasiados intentos fallidos. Por favor, intenta más tarde.')
      } else {
        throw new Error(error.message || 'Error al iniciar sesión. Por favor, intenta nuevamente.')
      }
    }
  }

  static async getUserProfile(): Promise<User> {
    try {
      // Asumimos que hay un endpoint para obtener el perfil del usuario
      const response = await apiService.get<User>('/api/v1/users/me')
      return response
    } catch (error: any) {
      console.error('Error al obtener perfil:', error)
      throw new Error('No se pudo obtener el perfil del usuario')
    }
  }
}