import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import es from './locales/es.json'

// Obtener el idioma guardado o usar el idioma del navegador
const savedLocale = localStorage.getItem('locale')
const browserLocale = navigator.language.split('-')[0]
const defaultLocale = savedLocale || (browserLocale === 'es' ? 'es' : 'en')

export const i18n = createI18n({
  legacy: false, // Usar la API de Composition
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    es
  }
})

export default i18n