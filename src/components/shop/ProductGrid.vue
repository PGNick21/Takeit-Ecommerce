<template>
  <div class="product-grid">
    <!-- Filtros arriba -->
    <div class="mb-2">
      <v-row>
        <v-col>
          <v-text-field
            v-model="searchQuery"
            :label="$t('products.searchBy')"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            clearable
            @click:clear="searchQuery = ''"
          ></v-text-field>
        </v-col>
      </v-row>
    </div>

    <!-- Grid de productos o mensaje de no resultados -->
    <v-row>
      <template v-if="products.length > 0">
        <v-col
          v-for="product in products"
          :key="product.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card
            class="product-card h-100 d-flex flex-column"
            :elevation="2"
            :loading="addingToCart[product.id]"
          >
            <v-img
              :src="product?.image?.url"
              height="200"
              cover
              class="align-end"
            >
              <!-- Chips de stock: siempre encima -->
              <v-chip
                v-if="product.stock <= 5 && product.stock > 0"
                color="warning"
                size="small"
                class="ma-2"
                style="position: relative; z-index: 2"
              >
                {{ $t('products.lowStock', { stock: product.stock }) }}
              </v-chip>
              <v-chip
                v-else-if="product.stock === 0"
                color="error"
                size="small"
                class="ma-2"
                style="position: relative; z-index: 2"
              >
                {{ $t('products.outOfStock') }}
              </v-chip>
              <template #placeholder>
                <div
                  class="d-flex align-center justify-center fill-height"
                  style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; background-color: #f5f5f5;"
                >
                  <v-icon icon="mdi-image" size="90" color="grey-lighten-1"></v-icon>
                </div>
              </template>
            </v-img>
            <v-card-title class="text-truncate">{{ product.name }}</v-card-title>
            <v-card-text>
              <div class="d-flex justify-space-between align-center mb-2">
                <div class="text-h6 font-weight-bold">${{ product.price }},00</div>
                <div class="text-caption text-medium-emphasis">
                  {{ $t('products.stock', { stock: product.stock }) }}
                </div>
              </div>
              <div class="text-body-2 product-description">{{ product.description }}</div>
            </v-card-text>
            <v-card-actions class="mb-2 mr-2 mt-auto">
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                variant="elevated"
                @click="addToCart(product.id)"
                :disabled="product.stock === 0 || addingToCart[product.id]"
                :loading="addingToCart[product.id]"
              >
                {{ $t('products.addToCart') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </template>
      <template v-else>
        <v-col cols="12" class="d-flex flex-column align-center justify-center py-12">
          <v-alert
            type="info"
            variant="tonal"
            class="text-center"
            border="start"
            color="primary"
          >
            {{ $t('products.noResults') }}
            <div class="text-body-2 mt-2">
              {{ $t('products.tryDifferentSearch') }}
            </div>
          </v-alert>
        </v-col>
      </template>
    </v-row>

    <!-- Loading state -->
    <div v-if="isLoading" class="loading-indicator">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>

    <!-- Error state -->
    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      class="my-4"
    >
      {{ error }}
      <template v-slot:append>
        <v-btn variant="text" @click="fetchProducts">
          {{ $t('common.retry') }}
        </v-btn>
      </template>
    </v-alert>

    <!-- Paginación -->
    <div v-if="pagination.last_page > 1" class="d-flex justify-center mt-6">
      <v-pagination
        v-model="currentPage"
        :length="pagination.last_page"
        :total-visible="7"
        @update:model-value="handlePageChange"
      ></v-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useProducts } from '@/composables/useProducts'
import { useCart } from '@/composables/useCart'
import { useErrorHandler } from '@/composables/useErrorHandler'

const props = defineProps({
  categoryId: {
    type: String,
    default: null
  }
})

const { products, isLoading, error, searchQuery, fetchProducts, pagination, filterByCategory, changePage } = useProducts()
const { addToCart: addProductToCart } = useCart()
const { showError } = useErrorHandler()

const addingToCart = ref<Record<string, boolean>>({})
const currentPage = ref(1)

// Sincronizar currentPage con pagination.current_page
watch(() => pagination.current_page, (newPage) => {
  currentPage.value = newPage
})

const handlePageChange = (page: number) => {
  currentPage.value = page
  changePage(page)
}

watch([() => props.categoryId], () => {
  currentPage.value = 1
  filterByCategory(props.categoryId)
})

const addToCart = async (productId: string) => {
  const product = products.value.find(p => p.id === productId)
  
  if (!product) return
  
  if (product.stock <= 0) {
    showError({
      type: 'validation',
      message: 'Este producto está agotado'
    })
    return
  }
  
  addingToCart.value = { ...addingToCart.value, [productId]: true }
  
  try {
    const success = await addProductToCart(product.id, 1)
    if (success) {
      // Mostrar mensaje de éxito
      // Aquí podríamos usar un sistema de notificaciones toast
    }
  } finally {
    setTimeout(() => {
      addingToCart.value = { ...addingToCart.value, [productId]: false }
    }, 500)
  }
}

onMounted(() => {
  // Cargar productos iniciales
  console.log('ProductGrid mounted, initial category:', props.categoryId)
  filterByCategory(props.categoryId)
})
</script>

<style scoped>
.product-grid {
  position: relative;
  min-height: 200px;
}

.loading-indicator {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.product-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important;
}

.product-description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>