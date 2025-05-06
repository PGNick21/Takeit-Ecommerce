<template>
    <v-card variant="flat" class="cart-item mb-4">
      <div class="d-flex">
        <!-- Imagen del producto -->
        <!-- <v-img
          :src="item.product.images[0] || '/placeholder-product.png'"
          :alt="item.product.name"
          width="80"
          height="80"
          cover
          class="rounded"
        ></v-img> -->

        <div v-for="(image, index) in item.product.images" :key="index">
            <v-img
              :src="image.url"
              :alt="item.product.name"
              width="80"
              height="80"
              cover
              class="rounded"
            ></v-img>
          </div>
        
        <!-- Detalles del producto -->
        <div class="ml-4 flex-grow-1">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-subtitle-1 font-weight-medium">{{ item.product.name }}</div>
              <div class="text-caption text-medium-emphasis">{{ formatPrice(item.price) }}</div>
            </div>
            
            <!-- Botón para eliminar -->
            <v-btn
              icon
              variant="text"
              density="comfortable"
              color="error"
              @click="showConfirmDialog = true"
              :loading="isRemoving"
              disabled
            >
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </div>
          
          <!-- Control de cantidad -->
          <div class="d-flex align-center mt-2">
            <v-btn
              icon
              variant="outlined"
              size="small"
              @click="handleDecrement"
              disabled
            >
              <v-icon>mdi-minus</v-icon>
            </v-btn>
            
            <span class="mx-3 text-body-1">{{ item.stock }}</span>
            
            <v-btn
              icon
              variant="outlined"
              size="small"
              @click="handleIncrement"
              disabled
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            
            <v-spacer></v-spacer>
            
            <div class="text-subtitle-1 font-weight-bold">
              {{ formatPrice(item.total) }}
            </div>
          </div>
        </div>
      </div>
    </v-card>

    <v-dialog v-model="showConfirmDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">
          Eliminar producto
        </v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar "{{ item.product.name }}" del carrito?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="showConfirmDialog = false"
            :disabled="isRemoving"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            @click="handleRemove"
            :loading="isRemoving"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import type { CartItem } from '@/types/cart.types'
  import { useCart } from '@/composables/useCart'
  
  const props = defineProps<{
    item: CartItem
  }>()
  
  const { incrementQuantity, decrementQuantity, removeFromCart } = useCart()
  
  const isUpdating = ref(false)
  const isRemoving = ref(false)
  const showConfirmDialog = ref(false)
  
  const handleIncrement = async () => {
    isUpdating.value = true
    try {
      await incrementQuantity(props.item.id, props.item.stock)
    } finally {
      isUpdating.value = false
    }
  }
  
  const handleDecrement = async () => {
    isUpdating.value = true
    try {
      await decrementQuantity(props.item.id, props.item.stock)
    } finally {
      isUpdating.value = false
    }
  }
  
  const handleRemove = async () => {
    isRemoving.value = true
    try {
      await removeFromCart(props.item.id)
      showConfirmDialog.value = false
    } finally {
      isRemoving.value = false
    }
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }
  </script>
  
  <style scoped>
  .cart-item {
    transition: all 0.3s ease;
  }
  
  .cart-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  </style>