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

  // Inicializar el carrito solo una vez cuando el componente se monta
  onMounted(async () => {
    if (authStore.isAuthenticated && !cartStore.cart) {
      await cartStore.fetchCart()
    }
  })

  // Método para agregar al carrito
  const addToCart = async (productId: string, stock: number) => {
    if (!authStore.isAuthenticated) {
      showError({
        type: 'unauthorized',
        message: 'Debes iniciar sesión para agregar productos al carrito'
      })
      router.push({ name: 'login' })
      return false
    }

    try {
      await cartStore.addToCart(productId, stock)
      return true
    } catch (error) {
      return false
    }
  }

  // Método para actualizar la cantidad de un producto
  const updateQuantity = async (id: string, quantity: number) => {
    try {
      await cartStore.updateCartItem(id, quantity)
      return true
    } catch (error) {
      return false
    }
  }

  // Método para incrementar la cantidad de un producto
  const incrementQuantity = async (id: string, currentQuantity: number) => {
    return updateQuantity(id, currentQuantity + 1)
  }

  // Método para decrementar la cantidad de un producto
  const decrementQuantity = async (id: string, currentQuantity: number) => {
    if (currentQuantity <= 1) {
      return removeFromCart(id)
    }
    return updateQuantity(id, currentQuantity - 1)
  }

  // Método para eliminar un producto del carrito
  const removeFromCart = async (id: string) => {
    try {
      await cartStore.removeFromCart(id)
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