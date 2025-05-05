import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '@/services/product.service'
import { productService } from '@/services/product.service'

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchProducts() {
    try {
      loading.value = true
      products.value = await productService.getProducts()
    } catch (e) {
      error.value = 'Error al cargar los productos'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    error,
    fetchProducts
  }
})