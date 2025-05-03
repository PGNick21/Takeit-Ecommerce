import type { PaginationParams } from '@/types/auth.types'

export interface Category {
  id: number
  uuid: string
  name: string
  slug: string
  description?: string
  image?: string
  created_at?: string
  updated_at?: string
}

export interface Product {
  id: string
  uuid: string
  name: string
  description: string
  resumen: string
  price: string
  stock: number
  sku: string
  nmp: string
  status: number
  
  // Dimensiones
  width: string
  height: string
  depth: string
  weight: string
  lenght: string

  // Características de comercio
  cart: number
  favorite: number
  make_offer: number
  
  // Relaciones
  brands: Brand[]
  categories: Category[]
  colors: Color[]
  offers: Offer[]
  
  // Imágenes
  image: FileData
  images: FileData[]
  
  // Usuario
  user: User

  created_at?: string
  updated_at?: string
}

export interface FileData {
  id: number
  uuid: string
  name: string
  path: string
  url: string
  type: string
  status: number
  fileable_id: number
  fileable_type: string
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  uuid: string
  name: string
  email: string
  phone: string
  address: string
  role_id: number
  status: number
  rating: number
  punctuation: number
  bulk_offer: number
  bulk_products: number
  lat: number | null
  lng: number | null
  avatar: string | null
  email_verified_at: string | null
  code_password: string | null
  date_code_password: string | null
  created_at: string | null
  updated_at: string | null
}

export interface Brand {
  id: number
  uuid: string
  name: string
}

export interface Color {
  id: number
  uuid: string
  name: string
  hex_code: string
}

export interface Offer {
  id: number
  uuid: string
  // ... otros campos
}

export interface PaginationMeta {
  current_page: number
  per_page: number
  total: number
  last_page: number
}

export interface ApiResponse<T> {
  data: T[]
  meta?: PaginationMeta
  links?: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
}

export interface CategoryParams extends PaginationParams {}

export interface ProductParams extends PaginationParams {
  user_uuid?: string
  brand_uuid?: string
  color_uuid?: string
  category_uuid?: string
}