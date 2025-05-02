<template>
    <slot />
  
    <v-snackbar
      v-model="visible"
      :color="color"
      :timeout="timeout"
      location="top right"
    >
      {{ message }}
    </v-snackbar>
  </template>
  
  <script setup lang="ts">
  import { ref, provide } from 'vue'
  
  const visible = ref(false)
  const message = ref('')
  const color = ref('info')
  const timeout = ref(3000)
  
  function notify(text: string, type: 'success' | 'error' | 'info' = 'info') {
    message.value = text
    color.value = {
      success: 'green',
      error: 'red',
      info: 'blue'
    }[type] || 'info'
    visible.value = true
  }
  
  provide('notifier', notify)
  </script>
  