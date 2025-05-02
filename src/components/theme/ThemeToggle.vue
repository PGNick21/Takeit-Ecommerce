<template>
    <v-card-title class="d-flex align-center py-2 px-4">
      <v-spacer></v-spacer>
  
      <!-- Cambio de tema -->
      <v-tooltip :text="$t(`theme.${isDark ? 'switchToLight' : 'switchToDark'}`)">
        <template v-slot:activator="{ props }">
          <v-btn
            icon
            v-bind="props"
            @click="toggleTheme"
            :color="isDark ? 'primary-darken-1' : 'primary-darken-4'"
            variant="text"
          >
            <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
  
      <!-- Cambio directo de idioma -->
      <v-btn
        variant="text"
        class="ml-2"
        prepend-icon="mdi-translate"
        @click="toggleLocale"
        :color="isDark ? 'primary-darken-1' : 'primary-darken-4'"
      >
        {{ currentLocale === 'es' ? 'Español' : 'English' }}
      </v-btn>
    </v-card-title>
  </template>
  
  <script setup lang="ts">
  import { useTheme } from '@/composables/useTheme'
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  
  // Tema
  const { isDark, toggleTheme } = useTheme()
  
  // i18n
  const { locale } = useI18n()
  const currentLocale = computed(() => locale.value)
  
  const toggleLocale = () => {
    const next = currentLocale.value === 'es' ? 'en' : 'es'
    locale.value = next
    localStorage.setItem('locale', next)
  }
  </script>
  