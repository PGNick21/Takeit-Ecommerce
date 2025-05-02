<template>
  <div>
    <!-- Estado de carga -->
    <div v-if="isLoading" class="d-flex justify-center my-8">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>
    
    <!-- Mensaje de error -->
    <v-alert
      v-else-if="error"
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
    
    <!-- Sin resultados -->
    <v-alert
      v-else-if="products.length === 0"
      type="info"
      variant="tonal"
      class="my-4"
    >
      {{ $t('products.noResults') }}
      <div class="text-body-2 mt-2">
        {{ $t('products.tryDifferentSearch') }}
      </div>
    </v-alert>
    
    <!-- Grid de productos -->
    <v-row v-else>
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
        
          <!-- Placeholder totalmente cubriendo, pero detrás -->
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
              <div class="text-h6 font-weight-bold">S/. {{ product.price }}</div>              <div class="text-caption text-medium-emphasis">
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
              @click="addToCart(product.uuid)"
              :disabled="product.stock === 0 || addingToCart[product.id]"
              :loading="addingToCart[product.id]"
            >
              {{ $t('products.addToCart') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

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

const { products, isLoading, error, fetchProducts, pagination } = useProducts()
const { addToCart: addProductToCart } = useCart()
const { showError } = useErrorHandler()

// Estado para controlar los productos que se están agregando al carrito
const addingToCart = ref<Record<string, boolean>>({})

// Control local de la página actual
const currentPage = ref(1)

// Manejar cambio de página
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchProducts({
    category_uuid: props.categoryId || undefined,
    per_page: 12,
    page: page
  })
}

// Cargar productos cuando cambia la categoría
watch(() => props.categoryId, () => {
  currentPage.value = 1 // Reset a la primera página
  fetchProducts({
    category_uuid: props.categoryId || undefined,
    per_page: 12,
    page: 1
  })
})

// Agregar al carrito
const addToCart = async (productId: string) => {
  const product = products.value.find(p => p.uuid === productId)
  
  if (!product) return
  
  // Validar stock
  if (product.stock <= 0) {
    showError({
      type: 'validation',
      message: 'Este producto está agotado'
    })
    return
  }
  
  // Marcar como agregando
  addingToCart.value = { ...addingToCart.value, [productId]: true }
  
  try {
    const success = await addProductToCart(productId, 1)
    
    if (success) {
      // Mostrar mensaje de éxito
      // Aquí podríamos usar un sistema de notificaciones toast
    }
  } finally {
    // Desmarcar como agregando
    setTimeout(() => {
      addingToCart.value = { ...addingToCart.value, [productId]: false }
    }, 500)
  }
}

onMounted(() => {
  fetchProducts({
    category_uuid: props.categoryId || undefined,
    per_page: 12,
    page: currentPage.value
  })
})
</script>

<style scoped>
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