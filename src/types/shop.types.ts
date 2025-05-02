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
  id: number
  uuid: string
  name: string
  slug: string
  description?: string
  price: number
  discount_price?: number
  stock: number
  images: string[]
  category?: Category
  category_uuid?: string
  brand?: {
    id: number
    uuid: string
    name: string
  }
  color?: {
    id: number
    uuid: string
    name: string
    hex_code: string
  }
  created_at?: string
  updated_at?: string
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