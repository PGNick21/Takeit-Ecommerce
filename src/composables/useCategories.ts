import { ref, computed } from 'vue'
import { ShopService } from '@/services/shop.service'
import type { Category, CategoryParams } from '@/types/shop.types'

export function useCategories() {
  const categories = ref<Category[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const selectedCategory = ref<Category | null>(null)

  const fetchCategories = async (params?: CategoryParams) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await ShopService.getCategories(params || { per_page: 0 })
      categories.value = response.data || []
    } catch (err: any) {
      error.value = err.message || 'Error al cargar las categorías'
      console.error('Error fetching categories:', err)
    } finally {
      isLoading.value = false
    }
  }

  const selectCategory = (category: Category | null) => {
    selectedCategory.value = category
  }

  const hasCategories = computed(() => categories.value.length > 0)

  return {
    categories,
    isLoading,
    error,
    selectedCategory,
    fetchCategories,
    selectCategory,
    hasCategories
  }
}