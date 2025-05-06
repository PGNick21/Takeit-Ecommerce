# E-Commerce App

Aplicación web robusta y escalable para una tienda en línea, desarrollada con Vue 3, Vuetify, TypeScript y Pinia.

## Características principales

- **Vue 3 + Composition API**
- **Vuetify 3** para UI moderna y responsiva
- **TypeScript** para tipado estático
- **Pinia** para gestión de estado global
- **Vite** como build tool ultrarrápido
- **ESLint y Prettier** para código limpio y consistente
- **Arquitectura modular**: módulos para auth, productos, carrito, etc.
- **Composables personalizados** para lógica reutilizable (APIs, paginación, búsqueda)
- **Consumo de API** con interceptores para autenticación y manejo global de errores
- **Lista de productos** con paginación, skeleton loaders y optimización de rendimiento
- **Búsqueda avanzada**: filtra por nombre, categoría, marca y color, con debouncing
- **Autenticación**: login, registro, protección de rutas y almacenamiento seguro de tokens
- **Carrito de compras**: agregar productos, vista previa y gestión con Pinia (agregar/eliminar productos: parcialmente implementado por limitaciones de la API)
- **Responsividad y accesibilidad**: diseño adaptativo y prácticas WCAG
- **Optimización de rendimiento**: code splitting, lazy loading, memoization
- **Pruebas unitarias e integración**: Vitest + Testing Library + msw
- **Internacionalización (i18n)**: soporte multi-idioma con Vue I18n
- **Gestión de errores global**
- **Dark mode** con preferencia persistente
- **Uso de `<script setup>`** para componentes más limpios

---

## Instalación

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/e-commerce-app.git
   cd e-commerce-app
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configura las variables de entorno:**
   - Copia `.env.example` a `.env` y ajusta los valores según tu entorno/API.

4. **Ejecuta la aplicación en modo desarrollo:**
   ```bash
   npm run dev
   # o
   yarn dev
   ```

5. **Compila para producción:**
   ```bash
   npm run build
   # o
   yarn build
   ```

6. **Corre las pruebas:**
   ```bash
   npm run test
   # o
   yarn test
   ```

---

## Notas

- El sistema de agregar/eliminar productos del carrito está parcialmente implementado debido a limitaciones de la API.
- El resto de funcionalidades cumple con los requisitos de la prueba técnica.
- El sistema es completamente internacionalizable y soporta dark mode.

---

## Licencia

MIT
