import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartService } from '@/services/cart.service'
import type { Cart, CartItem, AddToCartRequest } from '@/types/cart.types'
import { useErrorHandler } from '@/composables/useErrorHandler'

export const useCartStore = defineStore('cart', () => {
  // Estado
  const cart = ref<Cart | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isCartOpen = ref(false)

  // Getters
  const itemCount = computed(() => {
    if (!cart.value || !cart.value.items) return 0
    return cart.value.items.reduce((total, item) => total + item.quantity, 0)
  })

  const totalAmount = computed(() => {
    if (!cart.value || !cart.value.items) return 0
    return cart.value.items.reduce((total, item) => total + item.total, 0)
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
      const data: AddToCartRequest = {
        product_id: productId,
        quantity
      }
      
      const response = await cartService.addToCart(data)
      
      // Actualizar el carrito después de agregar un producto
      await fetchCart()
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Error al agregar al carrito'
      console.error('Error adding to cart:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateCartItem = async (itemId: string, quantity: number) => {
    isLoading.value = true
    error.value = null
    
    try {
      await cartService.updateCartItem(itemId, { quantity })
      
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

// import { defineStore } from 'pinia'
// import { ref, computed } from 'vue'
// import { cartService } from '@/services/cart.service'
// import type { Cart, AddToCartRequest } from '@/types/cart.types'
// import { useErrorHandler } from '@/composables/useErrorHandler'

// export const useCartStore = defineStore('cart', () => {
//   // Estado
//   const cart = ref<Cart | null>(null)
//   const isLoading = ref(false)
//   const error = ref<string | null>(null)
//   const isCartOpen = ref(false)

//   // Error handler personalizado
//   const { handleError } = useErrorHandler()

//   // Getters
//   const itemCount = computed(() =>
//     cart.value?.items?.reduce((total, item) => total + item.quantity, 0) ?? 0
//   )

//   const totalAmount = computed(() =>
//     cart.value?.items?.reduce((total, item) => total + item.total, 0) ?? 0
//   )

//   const isEmpty = computed(() =>
//     !cart.value || !cart.value.items || cart.value.items.length === 0
//   )

//   // Wrapper para llamadas asíncronas
//   const runWithLoader = async (
//     fn: () => Promise<void>,
//     customErrorMsg: string
//   ) => {
//     isLoading.value = true
//     error.value = null
//     try {
//       await fn()
//     } catch (err) {
//       handleError(err, error, customErrorMsg)
//       throw err
//     } finally {
//       isLoading.value = false
//     }
//   }

//   // Acciones
//   const fetchCart = async () => {
//     await runWithLoader(async () => {
//       cart.value = await cartService.getCart()
//     }, 'Error al cargar el carrito')
//   }

//   const addToCart = async (productId: string, quantity: number) => {
//     return await runWithLoader(async () => {
//       const data: AddToCartRequest = {
//         product_id: productId,
//         quantity
//       }
//       const response = await cartService.addToCart(data)
//       await fetchCart()
//       return response
//     }, 'Error al agregar al carrito')
//   }

//   const updateCartItem = async (itemId: string, quantity: number) => {
//     await runWithLoader(async () => {
//       await cartService.updateCartItem(itemId, { quantity })
//       await fetchCart()
//     }, 'Error al actualizar el carrito')
//   }

//   const removeFromCart = async (itemId: string) => {
//     await runWithLoader(async () => {
//       await cartService.removeFromCart(itemId)
//       await fetchCart()
//     }, 'Error al eliminar del carrito')
//   }

//   const clearCart = async () => {
//     await runWithLoader(async () => {
//       await cartService.clearCart()
//       await fetchCart() // por consistencia, no se asigna null
//     }, 'Error al vaciar el carrito')
//   }

//   const openCart = () => {
//     isCartOpen.value = true
//   }

//   const closeCart = () => {
//     isCartOpen.value = false
//   }

//   const toggleCart = () => {
//     isCartOpen.value = !isCartOpen.value
//   }

//   const clearError = () => {
//     error.value = null
//   }

//   return {
//     // Estado
//     cart,
//     isLoading,
//     error,
//     isCartOpen,

//     // Getters
//     itemCount,
//     totalAmount,
//     isEmpty,

//     // Acciones
//     fetchCart,
//     addToCart,
//     updateCartItem,
//     removeFromCart,
//     clearCart,
//     openCart,
//     closeCart,
//     toggleCart,
//     clearError
//   }
// })
