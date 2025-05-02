<template>
    <v-container>
      <v-row>
        <v-col cols="12" md="8" offset-md="2">
          <v-card>
            <v-card-title class="text-h5 mb-2">
              {{ $t('profile.title') }}
            </v-card-title>
            
            <v-card-text>
              <v-row>
                <v-col cols="12" md="4" class="text-center">
                  <v-avatar color="orange" size="120">
                    <span class="text-h4 text-white">{{ userInitials }}</span>
                  </v-avatar>
                </v-col>
                
                <v-col cols="12" md="8">
                  <v-list>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon>mdi-email</v-icon>
                      </template>
                      <v-list-item-title>{{ user?.email }}</v-list-item-title>
                    </v-list-item>
                    
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon>mdi-account</v-icon>
                      </template>
                      <v-list-item-title>{{ user?.name || $t('profile.name_placeholder') }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { useAuthStore } from '@/stores/auth'
  
  const authStore = useAuthStore()
  const user = computed(() => authStore.user)
  
  const userInitials = computed(() => {
    if (!user.value?.name) return 'U'
    return user.value.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  })
  </script>