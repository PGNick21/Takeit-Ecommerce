<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card class="mb-4">
            <v-card-title class="text-h5">
              {{ $t('checkout.title') }}
            </v-card-title>
            <v-card-text>
              <p class="text-body-1">{{ $t('checkout.description') }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <v-row>
        <v-col cols="12" md="8">
          <!-- Resumen del carrito -->
          <v-card class="mb-4">
            <v-card-title>{{ $t('checkout.orderSummary') }}</v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item v-for="item in cart?.items" :key="item.id">
                  <template v-slot:prepend>
                    <v-avatar size="40" rounded>
                      <v-img :src="item.product.images[0] || '/placeholder-product.png'" cover></v-img>
                    </v-avatar>
                  </template>
                  <v-list-item-title>{{ item.product.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ $t('checkout.quantity') }}: {{ item.quantity }}
                  </v-list-item-subtitle>
                  <template v-slot:append>
                    <div class="text-body-1 font-weight-medium">
                      {{ formatPrice(item.total) }}
                    </div>
                  </template>
                </v-list-item>
              </v-list>
              
              <v-divider class="my-4"></v-divider>
              
              <div class="d-flex justify-space-between align-center">
                <div class="text-h6">{{ $t('checkout.total') }}</div>
                <div class="text-h6 font-weight-bold">{{ formattedTotal }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="4">
          <!-- Formulario de pago -->
          <v-card>
            <v-card-title>{{ $t('checkout.paymentMethod') }}</v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="isFormValid">
                <v-radio-group v-model="paymentMethod" class="mb-4">
                  <v-radio value="card" :label="$t('checkout.creditCard')"></v-radio>
                  <v-radio value="paypal" :label="$t('checkout.paypal')"></v-radio>
                </v-radio-group>
                
                <v-btn
                  color="primary"
                  block
                  size="large"
                  :loading="isProcessing"
                  :disabled="!isFormValid || isProcessing"
                  @click="processPayment"
                >
                  {{ $t('checkout.placeOrder') }}
                </v-btn>
                
                <v-btn
                  variant="text"
                  block
                  class="mt-2"
                  @click="goBack"
                >
                  {{ $t('checkout.backToCart') }}
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useCart } from '@/composables/useCart'
  import { useErrorHandler } from '@/composables/useErrorHandler'
  import { useNotifier } from '@/composables/useNotifier'
  
  const router = useRouter()
  const { cart, totalAmount, fetchCart } = useCart()
  const { showError } = useErrorHandler()
  const { notify } = useNotifier()
  
  const isFormValid = ref(true)
  const paymentMethod = ref('card')
  const isProcessing = ref(false)
  
  const formattedTotal = computed(() => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(totalAmount.value)
  })
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }
  
  const paymentSuccessful = ref(false)
  
  const processPayment = async () => {
    isProcessing.value = true
    
    try {
      // Simulamos un proceso de pago
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      paymentSuccessful.value = true
      
      // Mostrar mensaje de éxito
      notify('Tu pedido ha sido procesado correctamente', 'success')

      // Redirigir al dashboard
      router.push({ name: 'dashboard' })
    } catch (error) {
      paymentSuccessful.value = false
      showError({
        type: 'serverError',
        message: 'Error al procesar el pago. Por favor, inténtalo de nuevo.'
      })
    } finally {
      isProcessing.value = false
    }
  }
  
  const goBack = () => {
    router.back()
  }
  
  onMounted(async () => {
    await fetchCart()
  })
  </script>