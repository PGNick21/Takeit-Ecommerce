import { apiService } from './api.service'
import type { CategoryParams, ProductParams } from '@/types/shop.types'
import type { ApiResponse, Category, Product } from '@/types/shop.types'

export class ShopService {
  static async getCategories(params?: CategoryParams): Promise<ApiResponse<Category>> {
    return await apiService.get('/shop/categories', params)
  }

  static async getProducts(params?: ProductParams): Promise<ApiResponse<Product>> {
    return await apiService.get('/shop', params)
  }

  static async addToCart(productId: number, stock: number) {
    return await apiService.post('/carts', {
      product_id: productId,
      stock: stock
    })
  }
}