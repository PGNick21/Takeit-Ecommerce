import { apiService } from './api.service'
import type { Cart, CartResponse, CartItemResponse, AddToCartRequest, UpdateCartItemRequest } from '@/types/cart.types'

class CartService {
  /**
   * Obtiene el carrito del usuario actual
   */
  async getCart(): Promise<Cart> {
    const response = await apiService.get<CartResponse>('/carts')
    return response.data
  }

  /**
   * Agrega un producto al carrito
   */
  async addToCart(data: AddToCartRequest): Promise<CartItemResponse> {
    const response = await apiService.post<CartItemResponse>('/carts', data)
    return response
  }

  /**
   * Actualiza la cantidad de un producto en el carrito
   */
  async updateCartItem(itemId: string, data: UpdateCartItemRequest): Promise<CartItemResponse> {
    const response = await apiService.put<CartItemResponse>(`/carts/${itemId}`, data)
    return response
  }

  /**
   * Elimina un producto del carrito
   */
  async removeFromCart(itemId: string): Promise<void> {
    await apiService.delete<{ message: string }>(`/carts/${itemId}`)
  }

  /**
   * Vacía el carrito
   */
  async clearCart(): Promise<void> {
    await apiService.delete<{ message: string }>('/carts')
  }
}

export const cartService = new CartService()