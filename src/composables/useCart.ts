import { computed, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useErrorHandler } from '@/composables/useErrorHandler'

export function useCart() {
  const cartStore = useCartStore()
  const authStore = useAuthStore()
  const router = useRouter()
  const { showError } = useErrorHandler()

  // Inicializar el carrito si el usuario está autenticado
  onMounted(async () => {
    if (authStore.isAuthenticated) {
      await cartStore.fetchCart()
    }
  })

  // Método para agregar un producto al carrito
  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!authStore.isAuthenticated) {
      showError({
        type: 'unauthorized',
        message: 'Debes iniciar sesión para agregar productos al carrito'
      })
      router.push({ name: 'login' })
      return
    }

    try {
      await cartStore.addToCart(productId, quantity)
      return true
    } catch (error) {
      return false
    }
  }

  // Método para actualizar la cantidad de un producto
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(itemId)
    }
    
    try {
      await cartStore.updateCartItem(itemId, quantity)
      return true
    } catch (error) {
      return false
    }
  }

  // Método para incrementar la cantidad de un producto
  const incrementQuantity = async (itemId: string, currentQuantity: number) => {
    return updateQuantity(itemId, currentQuantity + 1)
  }

  // Método para decrementar la cantidad de un producto
  const decrementQuantity = async (itemId: string, currentQuantity: number) => {
    if (currentQuantity <= 1) {
      return removeFromCart(itemId)
    }
    return updateQuantity(itemId, currentQuantity - 1)
  }

  // Método para eliminar un producto del carrito
  const removeFromCart = async (itemId: string) => {
    try {
      await cartStore.removeFromCart(itemId)
      return true
    } catch (error) {
      return false
    }
  }

  // Método para proceder al checkout
  const proceedToCheckout = () => {
    router.push({ name: 'checkout' })
  }

  return {
    // Estado del carrito
    cart: computed(() => cartStore.cart),
    isLoading: computed(() => cartStore.isLoading),
    error: computed(() => cartStore.error),
    isCartOpen: computed(() => cartStore.isCartOpen),
    itemCount: computed(() => cartStore.itemCount),
    totalAmount: computed(() => cartStore.totalAmount),
    isEmpty: computed(() => cartStore.isEmpty),
    
    // Acciones
    fetchCart: cartStore.fetchCart,
    addToCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart: cartStore.clearCart,
    openCart: cartStore.openCart,
    closeCart: cartStore.closeCart,
    toggleCart: cartStore.toggleCart,
    proceedToCheckout
  }
}