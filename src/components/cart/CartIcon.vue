<template>
  <v-badge
    :content="itemCount"
    :model-value="itemCount > 0"
    color="error"
    location="top end"
    offset-x="3"
    offset-y="3"
    class="cart-badge"
  >
    <v-btn
      icon
      variant="text"
      @click="toggleCart"
      :loading="isLoading"
    >
      <v-icon>mdi-cart</v-icon>
    </v-btn>
  </v-badge>
</template>

<script setup lang="ts">
import { useCart } from '@/composables/useCart'

const { itemCount, isLoading, toggleCart } = useCart()
</script>

<style scoped>
.cart-badge :deep(.v-badge__badge) {
  font-weight: bold;
  font-size: 0.875rem;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
}
</style>