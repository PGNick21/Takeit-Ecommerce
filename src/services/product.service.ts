import { apiService } from './api.service'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  image: string
}

class ProductService {
  async getProducts(): Promise<Product[]> {
    const response = await apiService.get<{ data: Product[] }>('/products')
    return response.data
  }

  async getProduct(productId: string): Promise<Product> {
    const response = await apiService.get<{ data: Product }>(`/products/${productId}`)
    return response.data
  }
}

export const productService = new ProductService()