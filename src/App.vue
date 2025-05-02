<template>
  <v-app>
    <snackbar-provider>
      <error-provider>
        <app-header v-if="authStore.isAuthenticated" />
        <v-main>
          <router-view />
        </v-main>
      </error-provider>
    </snackbar-provider>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppHeader from '@/components/layout/AppHeader.vue'
import ErrorProvider from '@/components/errors/ErrorProvider.vue'
import SnackbarProvider from '@/components/notifications/SnackbarProvider.vue'

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.checkAuth()
})
</script>
