<template>
    <v-badge
      :content="itemCount"
      :model-value="itemCount > 0"
      color="error"
      location="top end"
      offset-x="3"
      offset-y="3"
    >
      <v-btn
        icon
        @click="toggleCart"
        :loading="isLoading"
        :disabled="isLoading"
      >
        <v-icon>mdi-cart-outline</v-icon>
      </v-btn>
    </v-badge>
  </template>
  
  <script setup lang="ts">
  import { useCart } from '@/composables/useCart'
  
  const { itemCount, isLoading, toggleCart } = useCart()
  </script>