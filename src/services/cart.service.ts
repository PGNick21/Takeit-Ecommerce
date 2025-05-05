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
    try {
      const response = await apiService.post<CartItemResponse>('/carts', data)
      return response
    } catch (error: any) {
      if (error.response?.status === 422) {
        throw new Error('El producto ya está en el carrito')
      }
      throw error
    }
  }

  /**
   * Actualiza un item del carrito
   */
  async updateCartItem(itemId: string, data: UpdateCartItemRequest): Promise<CartItemResponse> {
    const response = await apiService.put<CartItemResponse>(`/carts/${itemId}`, data)
    return response
  }

  /**
   * Elimina un item del carrito
   */
  async removeFromCart(itemId: string): Promise<void> {
    await apiService.delete(`/carts/${itemId}`)
  }

  /**
   * Vacía el carrito
   */
  async clearCart(): Promise<void> {
    await apiService.delete('/carts')
  }
}

export const cartService = new CartService()