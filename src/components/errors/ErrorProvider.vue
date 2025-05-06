<template>
    <div class="error-provider">
      <error-alert :show-retry="props.showRetry" @retry="handleRetry" />
      <slot></slot>
    </div>
  </template>
  
  <script setup lang="ts">
  import { provide } from 'vue'
  import ErrorAlert from './ErrorAlert.vue'
  import { useErrorHandler } from '@/composables/useErrorHandler'
  
  const props = defineProps({
    showRetry: {
      type: Boolean,
      default: false
    }
  })
  
  const errorHandler = useErrorHandler()
  
  // Proporcionar el manejador de errores a los componentes hijos
  provide('errorHandler', errorHandler)
  
  const handleRetry = () => {
    errorHandler.hideError()
    emit('retry')
  }
  
  const emit = defineEmits(['retry'])
  </script>