<template>
  <v-container fluid class="dashboard-container pa-0 fill-height">
    <v-layout class="fill-height no-gap">
      <!-- Sidebar para categorías -->
      <v-navigation-drawer
        v-model="drawer"
        :rail="rail"
        permanent
        :width="rail ? 100 : 280"
        class="border-r sidebar"
        :class="{ 'sidebar--collapsed': rail }"
      >
        <div class="user-section" :class="{ 'user-section--collapsed': rail }">
          <div class="avatar-container">
            <v-avatar
              :size="rail ? 48 : 40"
              class="user-avatar"
            >
              <v-img src="https://randomuser.me/api/portraits/men/85.jpg" />
            </v-avatar>
            
            <v-btn
              v-if="rail"
              variant="text"
              @click.stop="toggleRail"
              class="toggle-btn toggle-btn--collapsed"
            >
              <v-icon class="toggle-icon">
                mdi-chevron-right
              </v-icon>
            </v-btn>
          </div>
          
          <div v-if="!rail" class="user-info">
            <div class="text-subtitle-1 font-weight-medium">{{ user?.name || $t('dashboard.welcome') }}</div>
            <div class="text-caption text-medium-emphasis">{{ user?.email || '' }}</div>
          </div>

          <v-btn
            v-if="!rail"
            variant="text"
            @click.stop="toggleRail"
            class="toggle-btn"
          >
            <v-icon class="toggle-icon">
              mdi-chevron-left
            </v-icon>
          </v-btn>
        </div>

        <v-divider></v-divider>

        <div class="category-container">
          <category-list @category-selected="handleCategorySelected" />
        </div>
      </v-navigation-drawer>

      <!-- Contenido principal -->
      <v-main class="main-content">
        <v-container fluid class="pa-4 main-container">
          <v-row no-gutters>
            <v-col cols="12">
              <h2 class="text-h5 mb-4">{{ $t('products.title') }}</h2>

              <product-grid 
                :category-id="selectedCategoryId ?? undefined"
              />
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

const authStore = useAuthStore()
const { locale } = useI18n()

const user = computed(() => authStore.user)
const drawer = ref(true)
const rail = ref(false)
const selectedCategoryId = ref<string | null>(null)

// Función para manejar el toggle del sidebar
const toggleRail = () => {
  rail.value = !rail.value
  localStorage.setItem('sidebarCollapsed', String(rail.value))
}

// Restaurar el estado del sidebar al montar el componente
onMounted(() => {
  const storedLocale = localStorage.getItem('locale')
  if (storedLocale) {
    locale.value = storedLocale
  }

  const sidebarCollapsed = localStorage.getItem('sidebarCollapsed')
  if (sidebarCollapsed) {
    rail.value = sidebarCollapsed === 'true'
  }
})

const handleCategorySelected = (categoryId: string | null) => {
  selectedCategoryId.value = categoryId
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.dashboard-container {
  /* min-height: 100vh; */
  max-width: 100vw;
  overflow-x: hidden;
}

.no-gap {
  gap: 0 !important;
}

.sidebar {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100vh;
  position: fixed;
  overflow-x: hidden;
  z-index: 1000;
}

.sidebar--collapsed {
  width: 130px !important;
}

.user-section {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
}

.user-section--collapsed {
  padding: 16px 8px;
  justify-content: center;
}

.avatar-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.user-info {
  flex-grow: 1;
  min-width: 0;
}

.user-info :deep(.text-subtitle-1),
.user-info :deep(.text-caption) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toggle-btn {
  transition: all 0.3s ease;
  min-width: 32px !important;
  width: 32px !important;
  height: 32px !important;
  flex-shrink: 0;
}

.toggle-btn--collapsed {
  position: relative;
  margin-left: 8px;
}

.toggle-icon {
  transition: transform 0.3s ease;
  font-size: 20px;
}

.icon--collapsed {
  transform: none;
}

.category-container {
  height: calc(100vh - 120px);
  overflow-y: auto;
  overflow-x: hidden;
}

.main-content {
  margin-left: 20px;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: calc(100% - 280px);
  overflow-x: hidden;
}

.main-container {
  max-width: 100%;
  padding: 16px !important;
}

.sidebar--collapsed + .main-content {
  margin-left: 90px;
  width: calc(100% - 100px);
}

/* Estilos responsivos */
@media (max-width: 960px) {
  .sidebar {
    position: fixed !important;
    z-index: 1000;
  }

  .main-content {
    margin-left: 0;
    width: 100%;
  }
}

@media (max-width: 600px) {
  .dashboard-container {
    padding: 0 !important;
  }

  .main-content {
    padding: 4px !important;
  }

  .main-container {
    padding: 4px !important;
  }
}
</style>