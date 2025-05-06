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

  // Función para fetch products con debouncing
  const debouncedFetchProducts = debounce(async (params?: ProductParams) => {
    isLoading.value = true
    error.value = null
    try {
      // Si todos los filtros están vacíos, no pasamos parámetros de filtrado
      const hasFilters = searchQuery.value
      const fetchParams: ProductParams = {
        page: pagination.value.current_page,
        per_page: pagination.value.per_page
      };

      // Solo añadimos parámetros de filtrado si hay algún valor
      if (hasFilters) {
        fetchParams.search_key = searchQuery.value || undefined;
        // fetchParams.category_uuid = selectedCategoryId.value || undefined;
        // fetchParams.brand = selectedBrand.value || undefined;
        // fetchParams.color = selectedColor.value || undefined;
      }

      const response = await ShopService.getProducts({
        ...params,
        ...fetchParams
      });
      products.value = response.data || [];
      if (response.meta) {
        pagination.value = response.meta;
      }
    } catch (err: any) {
      error.value = err.message || 'Error al cargar los productos';
      console.error('Error fetching products:', err);
    } finally {
      isLoading.value = false;
    }
  }, 500); // Debounce de 500ms

  const fetchProducts = (params?: ProductParams) => {
    debouncedFetchProducts(params);
  };

  // Watchers para los filtros
  watch([searchQuery, selectedBrand, selectedColor, selectedCategoryId], () => {
    pagination.value.current_page = 1; // Reset a la primera página
    fetchProducts();
  });

  const filterByCategory = (categoryId: string | null) => {
    selectedCategoryId.value = categoryId;
    fetchProducts({
      category_uuid: categoryId || undefined,
      page: 1,
      per_page: pagination.value.per_page
    });
  };

  const changePage = (page: number) => {
    pagination.value.current_page = page;
    fetchProducts();
  };

  const hasProducts = computed(() => products.value.length > 0);

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
  };
}