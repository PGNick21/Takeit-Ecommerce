import { ref, watch, computed } from 'vue'
import { useTheme as useVuetifyTheme } from 'vuetify'

// Tipo para el tema
export type ThemeMode = 'light' | 'dark' | 'system'

export function useTheme() {
  // Obtener el tema de Vuetify
  const vuetifyTheme = useVuetifyTheme()
  
  // Estado para el modo del tema
  const themeMode = ref<ThemeMode>(
    localStorage.getItem('theme') as ThemeMode || 'system'
  )
  
  // Detectar preferencia del sistema
  const systemPrefersDark = ref(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  
  // Escuchar cambios en la preferencia del sistema
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    systemPrefersDark.value = e.matches
  })
  
  // Computar si el tema actual es oscuro
  const isDark = computed(() => {
    if (themeMode.value === 'system') {
      return systemPrefersDark.value
    }
    return themeMode.value === 'dark'
  })
  
  // Cambiar el tema
  const setTheme = (mode: ThemeMode) => {
    themeMode.value = mode
    localStorage.setItem('theme', mode)
    applyTheme()
  }
  
  // Alternar entre temas
  const toggleTheme = () => {
    if (isDark.value) {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }
  
  // Aplicar el tema a Vuetify
  const applyTheme = () => {
    vuetifyTheme.global.name.value = isDark.value ? 'darkTheme' : 'lightTheme'
  }
  
  // Observar cambios en isDark para aplicar el tema
  watch(isDark, () => {
    applyTheme()
  }, { immediate: true })
  
  return {
    themeMode,
    isDark,
    setTheme,
    toggleTheme
  }
}