<template>
  <v-app>
    <error-provider>
      <app-header v-if="authStore.isAuthenticated" />
      <v-main>
        <router-view />
      </v-main>
      <cart-drawer v-if="authStore.isAuthenticated" />
    </error-provider>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppHeader from '@/components/layout/AppHeader.vue'
import ErrorProvider from '@/components/errors/ErrorProvider.vue'
import CartDrawer from '@/components/cart/CartDrawer.vue'

const authStore = useAuthStore()

onMounted(async () => {
  // Verificar si hay un token almacenado e inicializar el estado de autenticación
  await authStore.checkAuth()
})
</script>