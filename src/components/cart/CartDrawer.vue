<template>
    <v-navigation-drawer
      v-model="isOpen"
      location="right"
      temporary
      width="400"
      class="cart-drawer"
    >
      <v-card flat class="h-100 d-flex flex-column">
        <!-- Cabecera del carrito -->
        <v-card-title class="d-flex justify-space-between align-center py-4 px-4">
          <div class="d-flex align-center">
            <v-icon size="24" class="mr-2">mdi-cart</v-icon>
            <span class="text-h6">{{ $t('cart.title') }}</span>
            <v-chip
              v-if="itemCount > 0"
              color="primary"
              size="small"
              class="ml-2"
            >
              {{ itemCount }}
            </v-chip>
          </div>
          <v-btn icon variant="text" @click="closeCart">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-divider></v-divider>
        
        <!-- Contenido del carrito -->
        <v-card-text class="flex-grow-1 overflow-y-auto px-4 py-4">
          <!-- Estado de carga -->
          <div v-if="isLoading" class="d-flex justify-center align-center h-100">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          
          <!-- Carrito vacío -->
          <div v-else-if="isEmpty" class="d-flex flex-column justify-center align-center h-100">
            <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-cart-outline</v-icon>
            <h3 class="text-h6 text-medium-emphasis mb-2">{{ $t('cart.empty') }}</h3>
            <p class="text-body-2 text-medium-emphasis text-center">
              {{ $t('cart.emptyMessage') }}
            </p>
            <v-btn
              color="primary"
              variant="text"
              class="mt-4"
              prepend-icon="mdi-shopping"
              @click="closeCart"
            >
              {{ $t('cart.continueShopping') }}
            </v-btn>
          </div>
          
          <!-- Lista de productos -->
          <template v-else>
            <transition-group name="cart-item" tag="div">
              <cart-item
                v-for="item in cart?.items"
                :key="item.id"
                :item="item"
              ></cart-item>
            </transition-group>
          </template>
        </v-card-text>
        
        <!-- Footer con total y botones -->
        <template v-if="!isEmpty && !isLoading">
          <v-divider></v-divider>
          
          <v-card-text class="px-4 py-3">
            <div class="d-flex justify-space-between align-center mb-2">
              <span class="text-body-1">{{ $t('cart.subtotal') }}</span>
              <span class="text-subtitle-1 font-weight-bold">{{ formattedTotal }}</span>
            </div>
            <div class="text-caption text-medium-emphasis mb-4">
              {{ $t('cart.taxesIncluded') }}
            </div>
            
            <v-btn
              color="primary"
              block
              size="large"
              @click="handleCheckout"
              :loading="isCheckingOut"
              :disabled="isCheckingOut"
            >
              {{ $t('cart.checkout') }}
            </v-btn>
            
            <v-btn
              variant="text"
              block
              class="mt-2"
              @click="closeCart"
            >
              {{ $t('cart.continueShopping') }}
            </v-btn>
          </v-card-text>
        </template>
      </v-card>
    </v-navigation-drawer>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useCart } from '@/composables/useCart'
  import CartItem from './CartItem.vue'
  
  const { 
    cart, 
    isLoading, 
    itemCount, 
    totalAmount, 
    isEmpty, 
    isCartOpen, 
    closeCart,
    proceedToCheckout
  } = useCart()
  
  const isOpen = ref(false)
  const isCheckingOut = ref(false)
  
  // Sincronizar el estado del drawer con el store
  watch(isCartOpen, (newValue) => {
    isOpen.value = newValue
  })
  
  watch(isOpen, (newValue) => {
    if (!newValue) {
      closeCart()
    }
  })
  
  const formattedTotal = computed(() => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(totalAmount.value)
  })
  
  const handleCheckout = async () => {
    isCheckingOut.value = true
    try {
      await proceedToCheckout()
    } finally {
      isCheckingOut.value = false
    }
  }
  </script>
  
  <style scoped>
  .cart-item-enter-active,
  .cart-item-leave-active {
    transition: all 0.3s ease;
  }
  
  .cart-item-enter-from {
    opacity: 0;
    transform: translateX(30px);
  }
  
  .cart-item-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
  </style>