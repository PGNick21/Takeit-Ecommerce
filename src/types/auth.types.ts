export interface User {
  id?: number
  uuid?: string
  name?: string
  email: string
  role?: string
  avatar?: string
  created_at?: string
  updated_at?: string
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface AuthResponse {
  token: string
  user?: User
  message?: string
}

export interface ServerAuthResponse {
  success: boolean
  data: {
    token: string
    name: string
    email: string
    user: User
  }
  message: string
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status?: number
}

// Tipos para los endpoints mencionados en la documentación
export interface PaginationParams {
  per_page?: number
  page?: number
  search_key?: string
}

export interface CategoryParams extends PaginationParams {}

export interface ProductParams extends PaginationParams {
  user_uuid?: string
  brand_uuid?: string
  color_uuid?: string
  category_uuid?: string
}

export interface CartItem {
  product_id: number
  stock: number
}