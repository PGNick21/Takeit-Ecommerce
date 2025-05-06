<template>
    <v-alert
      v-if="isVisible"
      :type="alertType"
      variant="tonal"
      closable
      class="mb-4 error-alert"
      @click:close="hideError"
    >
      <div class="d-flex align-center">
        <v-icon :icon="alertIcon" class="mr-2" />
        <div>
          <div class="font-weight-bold">{{ alertTitle }}</div>
          <div>{{ errorMessage }}</div>
          <div v-if="error?.errors" class="mt-2">
            <ul class="pl-4">
              <li v-for="(messages, field) in error.errors" :key="field">
                <strong>{{ field }}:</strong> {{ messages.join(', ') }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div v-if="props.showRetry" class="mt-2">
        <v-btn
          variant="text"
          size="small"
          color="primary"
          @click="$emit('retry')"
        >
          {{ $t('common.retry') }}
        </v-btn>
      </div>
    </v-alert>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { useErrorHandler } from '@/composables/useErrorHandler'
  import { useI18n } from 'vue-i18n'
  
  const props = defineProps({
    showRetry: {
      type: Boolean,
      default: false
    }
  })
  
  defineEmits(['retry'])
  
  const { t } = useI18n()
  const { error, isVisible, errorMessage, hideError } = useErrorHandler()
  
  // Initialize alertType with a default value
  const defaultAlertType = 'error';
  const alertType = computed(() => {
    if (!error.value) return defaultAlertType;
    
    switch (error.value.type) {
      case 'unauthorized':
      case 'forbidden':
        return 'warning'
      case 'serverError':
        return 'error'
      case 'network':
      case 'timeout':
        return 'info'
      case 'validation':
        return 'warning'
      default:
        return 'error'
    }
  });
  
  const defaultAlertIcon = 'mdi-alert-circle';
  const alertIcon = computed(() => {
    if (!error.value) return defaultAlertIcon
    
    switch (error.value.type) {
      case 'unauthorized':
        return 'mdi-account-lock'
      case 'forbidden':
        return 'mdi-shield-lock'
      case 'notFound':
        return 'mdi-file-search'
      case 'serverError':
        return 'mdi-server-off'
      case 'network':
        return 'mdi-wifi-off'
      case 'timeout':
        return 'mdi-timer-sand-empty'
      case 'validation':
        return 'mdi-form-textbox'
      default:
        return 'mdi-alert-circle'
    }
  })
  
  const defaultAlertTitle = t('common.error');
  const alertTitle = computed(() => {
    if (!error.value) return defaultAlertTitle
    
    switch (error.value.type) {
      case 'unauthorized':
        return t('errors.unauthorized')
      case 'forbidden':
        return t('errors.forbidden')
      case 'notFound':
        return t('errors.notFound')
      case 'serverError':
        return t('errors.serverError')
      case 'network':
        return t('errors.network')
      case 'timeout':
        return t('errors.timeout')
      case 'validation':
        return t('errors.validation')
      default:
        return t('errors.general')
    }
  })
  </script>
  
  <style scoped>
  .error-alert {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>