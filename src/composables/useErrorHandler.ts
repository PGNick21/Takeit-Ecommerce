import { ref, computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'

export type ErrorType = 
  | 'general'
  | 'network'
  | 'unauthorized'
  | 'forbidden'
  | 'notFound'
  | 'serverError'
  | 'validation'
  | 'timeout'
  | 'unknown'

export interface ErrorDetails {
  type: ErrorType
  message?: string
  statusCode?: number
  errors?: Record<string, string[]>
}

// Estado global del error
const error = ref<ErrorDetails | null>(null)
const isVisible = ref(false)
const timeout = ref<number | null>(null)

// Función para manejar errores HTTP sin depender de i18n
const handleHttpError = (errorResponse: any): ErrorDetails => {
  const status = errorResponse.status || 500
  let type: ErrorType = 'unknown'
  
  switch (status) {
    case 401:
      type = 'unauthorized'
      break
    case 403:
      type = 'forbidden'
      break
    case 404:
      type = 'notFound'
      break
    case 422:
      type = 'validation'
      break
    case 500:
      type = 'serverError'
      break
    default:
      if (!navigator.onLine) {
        type = 'network'
      }
  }

  const errorDetails: ErrorDetails = {
    type,
    statusCode: status,
    message: errorResponse.message,
    errors: errorResponse.details
  }

  error.value = errorDetails
  return errorDetails
}

// Función para mostrar errores
const showError = (errorDetails: ErrorDetails) => {
  error.value = errorDetails
  isVisible.value = true

  if (timeout.value) {
    clearTimeout(timeout.value)
  }

  timeout.value = window.setTimeout(() => {
    hideError()
  }, 5000)
}

const hideError = () => {
  isVisible.value = false
  if (timeout.value) {
    clearTimeout(timeout.value)
    timeout.value = null
  }
}

const clearError = () => {
  error.value = null
  isVisible.value = false
  if (timeout.value) {
    clearTimeout(timeout.value)
    timeout.value = null
  }
}

// Composable para usar en componentes
export function useErrorHandler() {
  const { t } = useI18n()

  const errorMessage = computed(() => {
    if (!error.value) return ''
    
    if (error.value.message) return error.value.message

    return t(`errors.${error.value.type}`)
  })

  return {
    error,
    isVisible,
    errorMessage,
    showError,
    hideError,
    clearError
  }
}

// Exportar funciones globales que no dependen de i18n
export const globalErrorHandler = {
  handleHttpError,
  showError,
  hideError,
  clearError,
  error,
  isVisible
}