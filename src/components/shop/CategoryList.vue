<template>
  <div class="category-list">
    <v-list density="compact">
      <v-list-subheader class="d-flex align-center justify-space-between px-1">
        {{ $t('categories.title') }}
      </v-list-subheader>
      
      <v-list-item
        @click="selectCategory(null)"
        :active="!selectedCategory"
        class="mb-1 rounded-lg"
        min-height="40"
      >
        <template v-slot:prepend>
          <v-icon
            icon="mdi-view-grid"
            size="20"
            class="ms-1"
          ></v-icon>
        </template>
        <v-list-item-title class="text-body-2">{{ $t('categories.all') }}</v-list-item-title>
      </v-list-item>
      
      <div v-if="isLoading" class="d-flex justify-center my-2">
        <v-progress-circular indeterminate color="primary" size="20"></v-progress-circular>
      </div>
      
      <div v-else-if="error" class="text-center my-2">
        <v-icon icon="mdi-alert-circle" color="error" size="20" class="mb-1"></v-icon>
        <p class="text-caption">{{ error }}</p>
        <v-btn
          variant="text"
          color="primary"
          size="x-small"
          @click="fetchCategories()"
        >
          {{ $t('common.retry') }}
        </v-btn>
      </div>
      
      <template v-else>
        <div v-if="hasCategories">
          <v-list-item
            v-for="category in categories"
            :key="category.uuid"
            @click="selectCategory(category)"
            :active="selectedCategory?.uuid === category.uuid"
            class="mb-1 rounded-lg"
            min-height="40"
          >
            <template v-slot:prepend>
              <v-icon
                icon="mdi-tag"
                size="20"
                class="ms-1"
              ></v-icon>
            </template>
            <v-list-item-title class="text-body-2">{{ category.name }}</v-list-item-title>
          </v-list-item>
        </div>
        
        <div v-else class="text-center my-2 text-medium-emphasis">
          <v-icon icon="mdi-tag-off" class="mb-1"></v-icon>
          <p class="text-caption">{{ $t('categories.empty') }}</p>
        </div>
      </template>
    </v-list>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCategories } from '@/composables/useCategories'
import type { Category } from '@/types/shop.types'
import { ref } from 'vue';

const emit = defineEmits(['category-selected'])

const {
  categories,
  isLoading,
  error,
  selectedCategory,
  fetchCategories,
  selectCategory: selectCategoryInternal,
  hasCategories
} = useCategories()

const selectCategory = (category: Category | null) => {
  selectCategoryInternal(category)
  emit('category-selected', category?.uuid || null)
}

const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
  fetchCategories({ per_page: 0 }) // Traer todas las categorías
})
</script>

<style scoped>
.category-list {
  height: 100%;
  overflow-y: auto;
}
</style>