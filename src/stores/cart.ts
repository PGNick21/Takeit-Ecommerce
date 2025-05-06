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
  const isFetching = ref(false)
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
    // Evitar múltiples solicitudes simultáneas
    if (isFetching.value) return
    if (!shouldRefreshCart()) return

    isFetching.value = true
    isLoading.value = true
    error.value = null

    try {
      const cartData = await cartService.getCart()
      
      if (!cartData) {
        console.warn('[Cart] No data received from API')
        cart.value = {
          id: '',
          user_id: '',
          items: [],
          total: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      } else {
        cart.value = cartData
        console.log('[Cart] Updated successfully:', {
          itemCount: cartData.items.length,
          total: cartData.total
        })
      }
      
      lastUpdate.value = Date.now()
    } catch (err: any) {
      console.error('[Cart] Error:', err.message)
      error.value = err.message || 'Error al cargar el carrito'
      cart.value = null
    } finally {
      isLoading.value = false
      isFetching.value = false
    }
  }

  const addToCart = async (productId: string, stock: number) => {
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
      if (currentQuantity + stock > product.stock) {
        throw new Error(`Solo hay ${product.stock} unidades disponibles`)
      }

      const data: AddToCartRequest = {
        product_id: productId,
        stock: stock
      }

      const response = await cartService.addToCart(data)

      // Actualizar el estado local del carrito
      if (!cart.value) {
        await fetchCart()
      } else {
        if (existingItem) {
          existingItem.stock = stock
          console.log('[Cart] Updated item quantity:', { productId, newStock: stock })
        } else {
          cart.value.items.push({
            id: response.id.toString(),
            product_id: response.product.id.toString(),
            product: response.product,
            stock: response.stock,
            price: parseFloat(response.product.price),
            total: parseFloat(response.product.price) * response.stock
          })
          console.log('[Cart] Added new item:', { productId, stock })
        }
      }

      lastUpdate.value = Date.now()
      return response
    } catch (err: any) {
      error.value = err.message || 'Error al agregar al carrito'
      console.error('[Cart] Error adding item:', err.message)
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

  const updateCartItem = async (id: string, stock: number) => {
    isLoading.value = true
    error.value = null

    try {
      await cartService.updateCartItem(id, { stock })
      await fetchCart()
      console.log('[Cart] Updated item:', { id, newStock: stock })
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar el carrito'
      console.error('[Cart] Error updating item:', err.message)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const removeFromCart = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      await cartService.removeFromCart(id)
      await fetchCart()
      console.log('[Cart] Removed item:', { id })
    } catch (err: any) {
      error.value = err.message || 'Error al eliminar del carrito'
      console.error('[Cart] Error removing item:', err.message)
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
      console.log('[Cart] Cleared successfully')
    } catch (err: any) {
      error.value = err.message || 'Error al vaciar el carrito'
      console.error('[Cart] Error clearing cart:', err.message)
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