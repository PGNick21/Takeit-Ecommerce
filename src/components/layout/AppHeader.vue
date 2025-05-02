<template>
  <v-app-bar color="primary" app flat>
    <v-app-bar-title class="font-weight-bold">TakeIt</v-app-bar-title>
    
    <v-spacer></v-spacer>
    
    <theme-toggle />
    
    <cart-icon class="mx-2" />
    
    <v-menu location="bottom">
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props" class="ml-2">
          <v-avatar size="36" color="secondary">
            <span class="text-white">{{ userInitials }}</span>
          </v-avatar>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="navigateTo('profile')">
          <v-list-item-title>{{ $t('profile.title') }}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="navigateTo('settings')">
          <v-list-item-title>{{ $t('settings.title') }}</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="logout">
          <v-list-item-title>{{ $t('auth.logout') }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ThemeToggle from '@/components/theme/ThemeToggle.vue'
import CartIcon from '@/components/cart/CartIcon.vue'

const router = useRouter()
const authStore = useAuthStore()

// Initialize userInitials with a default value
const userInitials = ref('?')

// Use a computed property to update userInitials when the user object changes
const updateUserInitials = computed(() => {
  const user = authStore.user
  if (!user || !user.name) {
    userInitials.value = '?'
    return '?'
  }
  
  const names = user.name.split(' ')
  if (names.length >= 2) {
    userInitials.value = `${names[0][0]}${names[1][0]}`.toUpperCase()
    return `${names[0][0]}${names[1][0]}`.toUpperCase()
  }
  userInitials.value = names[0][0].toUpperCase()
  return names[0][0].toUpperCase()
})
updateUserInitials.value

const navigateTo = (route: string) => {
  router.push({ name: route })
}

const logout = async () => {
  await authStore.logout()
  router.push({ name: 'login' })
}
</script>