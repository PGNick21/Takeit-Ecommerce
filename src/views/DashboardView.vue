<template>
  <v-container fluid class="pa-0 fill-height mt-3">
    <v-layout class="fill-height">
      <!-- Sidebar para categorías -->
      <v-navigation-drawer
        v-model="drawer"
        :rail="rail"
        permanent
        width="280"
        class="border-r"
      >
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
          :title="user?.name || $t('dashboard.welcome')"
          :subtitle="user?.email || ''"
          class="mb-4"
        >
          <template v-slot:append>
            <v-btn
              variant="text"
              icon="mdi-chevron-left"
              @click.stop="rail = !rail"
            ></v-btn>
          </template>
        </v-list-item>

        <v-divider></v-divider>

        <category-list @category-selected="handleCategorySelected" />
      </v-navigation-drawer>

      <!-- Contenido principal -->
      <v-main>
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <h2 class="text-h5 mb-4">{{ $t('products.title') }}</h2>
              <product-grid :category-id="selectedCategoryId ?? undefined" />
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import CategoryList from '@/components/shop/CategoryList.vue'
import ProductGrid from '@/components/shop/ProductGrid.vue'
// import ThemeToggle from '@/components/theme/ThemeToggle.vue'

const authStore = useAuthStore()
const { locale } = useI18n()

const user = computed(() => authStore.user)
const drawer = ref(true)
const rail = ref(false)
const selectedCategoryId = ref<string | null>(null)
// const currentLocale = computed(() => locale.value)

// const availableLocales = [
//   { code: 'es', name: 'Español' },
//   { code: 'en', name: 'English' }
// ]

const handleCategorySelected = (categoryId: string | null) => {
  selectedCategoryId.value = categoryId
}

// const changeLocale = (localeCode: string) => {
//   locale.value = localeCode
//   localStorage.setItem('locale', localeCode)
// }

// const logout = async () => {
//   await authStore.logout()
//   router.push({ name: 'login' })
// }

onMounted(() => {
  // Cargar el idioma guardado
  const storedLocale = localStorage.getItem('locale')
  if (storedLocale) {
    locale.value = storedLocale
  }
})
</script>

<style scoped>
.v-navigation-drawer {
  transition: width 0.3s ease;
}
</style>