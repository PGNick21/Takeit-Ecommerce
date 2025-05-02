import { Product } from './shop.types'

export interface CartItem {
  id: string
  product_id: string
  product: Product
  quantity: number
  price: number
  total: number
}

export interface Cart {
  id: string
  user_id: string
  items: CartItem[]
  total: number
  created_at: string
  updated_at: string
}

export interface AddToCartRequest {
  product_id: string
  quantity: number
}

export interface UpdateCartItemRequest {
  quantity: number
}

export interface CartResponse {
  data: Cart
  message: string
}

export interface CartItemResponse {
  data: CartItem
  message: string
}