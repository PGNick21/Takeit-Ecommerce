import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

// Temas personalizados
const lightTheme = {
  dark: false,
  colors: {
    primary: '#0c4a6e',
    secondary: '#f97316',
    info: '#e0f2fe',
    background: '#ffffff',
    surface: '#ffffff',
    error: '#B00020',
    success: '#4CAF50',
    warning: '#FB8C00',
  }
}

const darkTheme = {
  dark: true,
  colors: {
    primary: '#38bdf8', // Azul más claro para modo oscuro
    secondary: '#f97316',
    info: '#1e3a8a', // Azul oscuro para modo oscuro
    background: '#1f2937', // Fondo oscuro
    surface: '#111827', // Superficie oscura
    error: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
  }
}

// Determinar el tema inicial
const savedTheme = localStorage.getItem('theme') || 'system'
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const initialTheme = savedTheme === 'system' 
  ? (systemPrefersDark ? 'darkTheme' : 'lightTheme')
  : (savedTheme === 'dark' ? 'darkTheme' : 'lightTheme')

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    }
  },
  theme: {
    defaultTheme: initialTheme,
    themes: {
      lightTheme,
      darkTheme,
    }
  }
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(i18n)

app.mount('#app')