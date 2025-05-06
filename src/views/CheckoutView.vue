<template>
  <v-container class="fill-height d-flex flex-column align-center justify-center">
    <v-alert type="info" class="text-center mt-12" border="start" color="primary">
      {{ $t('checkout.disabled') }}
      <div class="text-body-2 mt-2">
        {{ $t('checkout.disabledDescription') }}
      </div>
    </v-alert>
    <v-btn color="primary" class="mt-6" @click="goHome">
      <v-icon left>mdi-arrow-left</v-icon>
      {{ $t('common.backToHome') }}
    </v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t: $t } = useI18n()

const goHome = () => {
  router.push({ name: 'dashboard' })
}
</script>