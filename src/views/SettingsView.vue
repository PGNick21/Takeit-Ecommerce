<template>
    <v-container>
      <!-- Cabecera con botón de regreso -->
      <v-row align="center" class="mb-4">
        <v-col cols="auto mt-9">
          <v-btn icon @click="goHome">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="8" offset-md="2">
          <v-card>
            <v-card-title class="text-h5 mb-2">
              {{ $t('settings.title') }}
            </v-card-title>
            
            <v-card-text>
              <v-list>
                <!-- Appearance Section -->
                <v-list-subheader>{{ $t('settings.appearance') }}</v-list-subheader>
                
                <!-- Theme Selection -->
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon>{{ isDark ? 'mdi-weather-night' : 'mdi-weather-sunny' }}</v-icon>
                  </template>
                  <v-list-item-title>{{ $t('settings.theme.title') }}</v-list-item-title>
                  <template v-slot:append>
                    <v-select
                      v-model="selectedTheme"
                      :items="themeOptions"
                      variant="outlined"
                      density="compact"
                      hide-details
                      class="max-width-200"
                    ></v-select>
                  </template>
                </v-list-item>
  
                <!-- Language Selection -->
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon>mdi-translate</v-icon>
                  </template>
                  <v-list-item-title>{{ $t('settings.language') }}</v-list-item-title>
                  <template v-slot:append>
                    <v-select
                      v-model="selectedLocale"
                      :items="localeOptions"
                      variant="outlined"
                      density="compact"
                      hide-details
                      class="max-width-200"
                    ></v-select>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { useTheme, type ThemeMode } from '@/composables/useTheme'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  
  // Theme
  const { isDark, setTheme, themeMode } = useTheme()
  
  const themeOptions = computed(() => [
    { title: 'settings.theme.light', value: 'light' },
    { title: 'settings.theme.dark', value: 'dark' },
    { title: 'settings.theme.system', value: 'system' }
  ].map(option => ({
    title: $t(option.title),
    value: option.value
  })))
  
  const selectedTheme = computed({
    get: () => themeMode.value,
    set: (value: ThemeMode) => setTheme(value)
  })
  
  // i18n
  const { locale, t: $t } = useI18n()
  const localeOptions = computed(() => [
    { title: 'settings.language_options.es', value: 'es' },
    { title: 'settings.language_options.en', value: 'en' }
  ].map(option => ({
    title: $t(option.title),
    value: option.value
  })))
  
  const selectedLocale = computed({
    get: () => locale.value,
    set: (value: string) => {
      locale.value = value
      localStorage.setItem('locale', value)
    }
  })
  
  // Botón de regreso
  const router = useRouter()
  const goHome = () => {
    router.push({ name: 'dashboard' })
  }
  </script>
  
  <style scoped>
  .max-width-200 {
    max-width: 200px;
  }
  </style>