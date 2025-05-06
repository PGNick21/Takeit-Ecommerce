import { ref, computed, watch } from 'vue'
import { debounce } from 'lodash'
import { ShopService } from '@/services/shop.service'
import type { Product, ProductParams, PaginationMeta } from '@/types/shop.types'

export function useProducts() {
  const products = ref<Product[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const selectedCategoryId = ref<string | null>(null)
  const selectedBrand = ref('')
  const selectedColor = ref('')
  const pagination = ref<PaginationMeta>({
    current_page: 1,
    per_page: 12,
    total: 0,
    last_page: 1
  })

  // Función principal para fetch products
  const fetchProducts = async (params?: ProductParams) => {
    isLoading.value = true
    error.value = null
    try {
      const fetchParams: ProductParams = {
        page: params?.page || 1,
        per_page: 12
      }

      // Añadir parámetros de búsqueda y filtros
      if (searchQuery.value) {
        fetchParams.search_key = searchQuery.value
      }
      if (selectedCategoryId.value) {
        fetchParams.category_uuid = selectedCategoryId.value
      }

      console.log('Fetching products with params:', fetchParams)
      const response = await ShopService.getProducts(fetchParams)
      
      if (response && response.data) {
        products.value = response.data
        if (response.meta) {
          pagination.value = {
            current_page: response.meta.current_page,
            per_page: response.meta.per_page,
            total: response.meta.total,
            last_page: response.meta.last_page
          }
        }
      } else {
        products.value = []
        pagination.value = {
          current_page: 1,
          per_page: 12,
          total: 0,
          last_page: 1
        }
      }
    } catch (err: any) {
      console.error('Error fetching products:', err)
      error.value = err.message || 'Error al cargar los productos'
      products.value = []
      pagination.value = {
        current_page: 1,
        per_page: 12,
        total: 0,
        last_page: 1
      }
    } finally {
      isLoading.value = false
    }
  }

  // Debounce para búsquedas
  const debouncedSearch = debounce(() => {
    pagination.value.current_page = 1
    fetchProducts({ page: 1 })
  }, 500)

  // Watchers para los filtros
  watch(searchQuery, () => {
    debouncedSearch()
  })

  watch([selectedBrand, selectedColor], () => {
    pagination.value.current_page = 1
    fetchProducts({ page: 1 })
  })

  const filterByCategory = (categoryId: string | null) => {
    selectedCategoryId.value = categoryId
    pagination.value.current_page = 1
    fetchProducts({ page: 1 })
  }

  const changePage = (page: number) => {
    console.log('Changing to page:', page)
    fetchProducts({ page })
  }

  const hasProducts = computed(() => products.value.length > 0)

  return {
    products,
    isLoading,
    error,
    searchQuery,
    selectedCategoryId,
    selectedBrand,
    selectedColor,
    pagination,
    fetchProducts,
    filterByCategory,
    changePage,
    hasProducts
  }
}