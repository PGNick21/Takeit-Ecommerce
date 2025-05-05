import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartService } from '@/services/cart.service'
import { productService } from '@/services/product.service'
import type { Cart, AddToCartRequest, CartItem } from '@/types/cart.types'
// import { useNotifier } from '@/composables/useNotifier'

export const useCartStore = defineStore('cart', () => {
  // Estado
  const cart = ref<Cart | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isCartOpen = ref(false)
  const lastUpdate = ref<number>(0)
  // const { notify } = useNotifier()

  // Getters
  const itemCount = computed(() => {
    if (!cart.value || !cart.value.items) return 0
    return cart.value.items.reduce((total, item: CartItem) => total + item.stock, 0)
  })

  const totalAmount = computed(() => {
    if (!cart.value || !cart.value.items) return 0
    return cart.value.items.reduce((total, item: CartItem) => total + item.total, 0)
  })

  const isEmpty = computed(() => {
    return !cart.value || !cart.value.items || cart.value.items.length === 0
  })

  // Acciones
  const fetchCart = async () => {
    isLoading.value = true
    error.value = null

    try {
      cart.value = await cartService.getCart()
      lastUpdate.value = Date.now()
    } catch (err: any) {
      error.value = err.message || 'Error al cargar el carrito'
      console.error('Error fetching cart:', err)
    } finally {
      isLoading.value = false
    }
  }

  const addToCart = async (productId: string, quantity: number) => {
    isLoading.value = true
    error.value = null

    try {
      // Verificar si el producto ya está en el carrito
      const existingItem = cart.value?.items.find(
        (item: CartItem) => item.product.id === productId
      )
      const currentQuantity = existingItem?.stock || 0

      // Obtener el stock disponible del producto
      const product = await productService.getProduct(productId)

      // Validar stock disponible
      if (currentQuantity + quantity > product.stock) {
        throw new Error(`Solo hay ${product.stock} unidades disponibles`)
      }

      const data: AddToCartRequest = {
        product_id: productId,
        stock: quantity // Changed from stock to quantity for consistency
      }

      const response = await cartService.addToCart(data)

      // Actualizar el estado local del carrito
      if (!cart.value) {
        // Obtener el carrito completo si no existe
        cart.value = await cartService.getCart()
      } else {
        // Si el producto ya existía, actualizamos la cantidad
        if (existingItem) {
          existingItem.stock = quantity
        } else {
          // Agregar el nuevo item
          cart.value.items.push(response.data)
          // notify('Producto agregado al carrito', 'success')
        }
      }

      lastUpdate.value = Date.now()
      return response
    } catch (err: any) {
      error.value = err.message || 'Error al agregar al carrito'
      console.error('Error adding to cart:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const shouldRefreshCart = () => {
    // Refrescar si no hay carrito o si han pasado más de 5 minutos desde la última actualización
    const REFRESH_INTERVAL = 5 * 60 * 1000 // 5 minutos
    return !cart.value || !lastUpdate.value || (Date.now() - lastUpdate.value) > REFRESH_INTERVAL
  }

  const getCart = async (forceRefresh = false) => {
    if (forceRefresh || shouldRefreshCart()) {
      await fetchCart()
    }
    return cart.value
  }

  const updateCartItem = async (itemId: string, stock: number) => {
    isLoading.value = true
    error.value = null

    try {
      await cartService.updateCartItem(itemId, { stock })

      // Actualizar el carrito después de modificar un producto
      await fetchCart()
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar el carrito'
      console.error('Error updating cart item:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const removeFromCart = async (itemId: string) => {
    isLoading.value = true
    error.value = null

    try {
      await cartService.removeFromCart(itemId)

      // Actualizar el carrito después de eliminar un producto
      await fetchCart()
    } catch (err: any) {
      error.value = err.message || 'Error al eliminar del carrito'
      console.error('Error removing from cart:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const clearCart = async () => {
    isLoading.value = true
    error.value = null

    try {
      await cartService.clearCart()
      cart.value = null
    } catch (err: any) {
      error.value = err.message || 'Error al vaciar el carrito'
      console.error('Error clearing cart:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const openCart = () => {
    isCartOpen.value = true
  }

  const closeCart = () => {
    isCartOpen.value = false
  }

  const toggleCart = () => {
    isCartOpen.value = !isCartOpen.value
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // Estado
    cart,
    isLoading,
    error,
    isCartOpen,

    // Getters
    itemCount,
    totalAmount,
    isEmpty,

    // Acciones
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    clearError
  }
})