import { ref, computed, watch } from 'vue'
import { ShopService } from '@/services/shop.service'
import type { Product, ProductParams, PaginationMeta } from '@/types/shop.types'
import { debounce } from 'lodash'

export function useProducts() {
  const products = ref<Product[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const selectedCategoryId = ref<string | null>(null)
  const pagination = ref<PaginationMeta>({
    current_page: 1,
    per_page: 12,
    total: 0,
    last_page: 1
  })

  // Debounced search function
  const debouncedSearch = debounce((query: string) => {
    fetchProducts({
      search_key: query || undefined,
      category_uuid: selectedCategoryId.value || undefined,
      page: 1, // Reset to first page on new search
      per_page: pagination.value.per_page
    })
  }, 500)

  // Watch for search query changes
  watch(searchQuery, (newQuery) => {
    debouncedSearch(newQuery)
  })

  const fetchProducts = async (params?: ProductParams) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await ShopService.getProducts(params)
      products.value = response.data || []
      
      // Update pagination if available
      if (response.meta) {
        pagination.value = response.meta
      }
    } catch (err: any) {
      error.value = err.message || 'Error al cargar los productos'
      console.error('Error fetching products:', err)
    } finally {
      isLoading.value = false
    }
  }

  const filterByCategory = (categoryId: string | null) => {
    selectedCategoryId.value = categoryId
    fetchProducts({
      category_uuid: categoryId || undefined,
      search_key: searchQuery.value || undefined,
      page: 1, // Reset to first page on category change
      per_page: pagination.value.per_page
    })
  }

  const changePage = (page: number) => {
    fetchProducts({
      category_uuid: selectedCategoryId.value || undefined,
      search_key: searchQuery.value || undefined,
      page,
      per_page: pagination.value.per_page
    })
  }

  const hasProducts = computed(() => products.value.length > 0)

  return {
    products,
    isLoading,
    error,
    searchQuery,
    selectedCategoryId,
    pagination,
    fetchProducts,
    filterByCategory,
    changePage,
    hasProducts
  }
}