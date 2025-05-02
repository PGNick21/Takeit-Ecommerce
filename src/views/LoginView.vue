<template>
  <v-container fluid class="fill-height bg-primary-lighten-4">
    <!-- Controles fijos en la esquina superior izquierda -->
    <div class="language-theme-toggle">
      <theme-toggle :show-menu="false" class="me-2" />
    </div>

    <!-- Contenido principal centrado -->
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="login-card elevation-8">
          <!-- Header -->
          <v-card-item class="pb-2 text-center">
            <div class="d-flex align-center justify-center mb-4 mt-8">
              <v-icon icon="mdi-shopping" size="32" color="primary" class="me-2" />
              <h1 class="text-h4 font-weight-bold text-primary mb-0">TakeIt</h1>
            </div>
            <p class="text-subtitle-1 text-medium-emphasis">{{ $t('auth.loginDescription') }}</p>
          </v-card-item>

          <!-- Formulario -->
          <v-card-text class="pt-2">
            <v-form ref="form" v-model="isFormValid" @submit.prevent="handleLogin">
              <!-- Error -->
              <v-alert
                v-if="authStore.error"
                type="error"
                variant="tonal"
                class="mb-4"
                closable
                @click:close="authStore.clearError()"
              >
                {{ authStore.error }}
              </v-alert>

              <!-- Email -->
              <v-text-field
                v-model="email"
                :label="$t('auth.email')"
                type="email"
                :rules="emailRules"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                required
                autocomplete="email"
                class="mb-2"
                color="primary"
              />

              <!-- Contraseña -->
              <v-text-field
                v-model="password"
                :label="$t('auth.password')"
                :type="showPassword ? 'text' : 'password'"
                :rules="passwordRules"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
                variant="outlined"
                required
                autocomplete="current-password"
                class="mb-4"
                color="primary"
              />

              <!-- Recordar y Olvidé -->
              <div class="d-flex justify-space-between align-center mb-6">
                <v-checkbox
                  v-model="rememberMe"
                  :label="$t('auth.rememberMe')"
                  color="primary"
                  hide-details
                />
                <v-btn
                  variant="text"
                  color="primary"
                  class="text-body-2"
                  @click="forgotPassword"
                >
                  {{ $t('auth.forgotPassword') }}
                </v-btn>
              </div>

              <!-- Botón Iniciar sesión -->
              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="authStore.isLoading"
                :disabled="!isFormValid || authStore.isLoading"
                class="mb-6"
              >
                <v-icon start icon="mdi-login" class="me-2" />
                {{ $t('auth.login') }}
              </v-btn>
            </v-form>

            <!-- Enlace a registro -->
            <div class="text-center mb-4">
              <span class="text-body-2 text-medium-emphasis">{{ $t('auth.noAccount') }}</span>
              <v-btn
                variant="text"
                color="primary"
                class="ms-1 text-body-2"
                @click="goToRegister"
              >
                {{ $t('auth.register') }}
                <v-icon end icon="mdi-arrow-right" class="ms-1" />
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import { emailValidator, passwordValidator } from '@/utils/validators'
import ThemeToggle from '@/components/theme/ThemeToggle.vue'

const router = useRouter()
const authStore = useAuthStore()
const { t, locale } = useI18n()

// Formulario
const form = ref<any>(null)
const isFormValid = ref(false)
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)

// Idioma
const initialLocale = localStorage.getItem('locale') || 'es'
locale.value = initialLocale
const currentLocale = ref(initialLocale)

watch(currentLocale, (newLocale) => {
  locale.value = newLocale
  localStorage.setItem('locale', newLocale)
})

// Validaciones
const emailRules = [
  (v: string) => !!v || t('validation.required'),
  (v: string) => emailValidator(v) || t('validation.email')
]

const passwordRules = [
  (v: string) => !!v || t('validation.required'),
  (v: string) => passwordValidator(v) || t('validation.minLength', { min: 6 })
]

// Métodos
const handleLogin = async () => {
  if (!isFormValid.value) return

  try {
    await authStore.login({
      email: email.value,
      password: password.value,
      remember: rememberMe.value
    })

    router.push({ name: 'dashboard' })
  } catch (error) {
    console.error('Login error:', error)
  }
}

const forgotPassword = () => {
  alert(t('auth.forgotPassword') + ' - ' + t('common.loading'))
}

const goToRegister = () => {
  router.push({ name: 'register' })
}
</script>

<style scoped>
.login-card {
  border-radius: 16px;
  overflow: hidden;
}

.v-card-item {
  border-bottom: 1px solid rgba(var(--v-border-color), 0.22);
}

.v-container {
  display: flex;
  min-height: 100vh;
}

/* Estilo para el contenedor del toggle y el idioma */
.language-theme-toggle {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  z-index: 10;
}

.language-select {
  background-color: white;
  border-radius: 8px;
  font-size: 13px;
}
</style>
