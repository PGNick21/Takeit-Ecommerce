import { apiService } from './api.service'
import type { Cart, CartItemResponse, AddToCartRequest, UpdateCartItemRequest } from '@/types/cart.types'

class CartService {
  /**
   * Obtiene el carrito del usuario actual
   */
  async getCart(): Promise<Cart> {
    try {
      console.log('Making GET request to /carts') // Debug log
      const response = await apiService.get<{ data: CartItemResponse[] }>('/carts')
      console.log('Raw cart response:', response) // Debug log
      
      if (!response.data) {
        console.warn('No data in cart response') // Debug log
        throw new Error('No data received from cart endpoint')
      }

      // Convertir el array de items al formato Cart esperado
      const items = response.data.map((item: CartItemResponse) => ({
        id: item.id.toString(),
        product_id: item.product.id.toString(),
        product: item.product,
        stock: item.stock,
        price: parseFloat(item.product.price),
        total: parseFloat(item.product.price) * item.stock
      }))

      return {
        id: 'current', // ID temporal ya que no viene en la respuesta
        user_id: 'current', // ID temporal ya que no viene en la respuesta
        items,
        total: items.reduce((sum: number, item: { total: number }) => sum + item.total, 0),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    } catch (error: any) {
      console.error('Error getting cart:', error) // Debug log
      if (error.response) {
        console.error('Error response:', error.response) // Debug log
      }
      throw error
    }
  }

  /**
   * Agrega un producto al carrito
   */
  async addToCart(data: AddToCartRequest): Promise<CartItemResponse> {
    try {
      console.log('Adding to cart:', data) // Debug log
      const response = await apiService.post<CartItemResponse>('/carts', data)
      console.log('Add to cart response:', response) // Debug log
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
  async updateCartItem(id: string, data: UpdateCartItemRequest): Promise<CartItemResponse> {
    try {
      console.log('Updating cart item:', { id, data }) // Debug log
      const response = await apiService.put<CartItemResponse>(`/carts/${id}`, data)
      console.log('Update cart response:', response) // Debug log
      return response
    } catch (error: any) {
      console.error('Error updating cart item:', error) // Debug log
      throw error
    }
  }

  /**
   * Elimina un item del carrito
   */
  async removeFromCart(id: string): Promise<void> {
    try {
      console.log('Removing from cart:', id) // Debug log
      await apiService.delete(`/carts/${id}`)
      console.log('Item removed successfully') // Debug log
    } catch (error: any) {
      console.error('Error removing from cart:', error) // Debug log
      throw error
    }
  }

  /**
   * Vacía el carrito
   */
  async clearCart(): Promise<void> {
    try {
      console.log('Clearing cart') // Debug log
      await apiService.delete('/carts')
      console.log('Cart cleared successfully') // Debug log
    } catch (error: any) {
      console.error('Error clearing cart:', error) // Debug log
      throw error
    }
  }
}

export const cartService = new CartService()