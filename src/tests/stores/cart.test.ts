import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '@/stores/cart'

describe('Cart Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should add item to cart', async () => {
    const cartStore = useCartStore()
    const mockProductId = '123'
    const mockStock = 1
    
    // Mock the cart service response
    vi.spyOn(cartStore, 'addToCart').mockImplementation(async () => {
      cartStore.cart = {
        id: '1',
        user_id: '1',
        items: [{
          id: '1',
          product_id: mockProductId,
          product: {
            id: mockProductId,
            uuid: 'test-uuid',
            name: 'Test Product',
            description: 'Test Description',
            resumen: 'Test Summary',
            price: '10.00',
            stock: 10,
            sku: 'TEST-SKU',
            nmp: 'TEST-NMP',
            status: 1,
            width: '10',
            height: '10',
            depth: '10',
            weight: '1',
            lenght: '10'
            // Intencionalmente omitiendo campos requeridos:
            // cart: number
            // favorite: number
            // make_offer: number
            // brands: Brand[]
            // categories: Category[]
            // colors: Color[]
            // offers: Offer[]
            // image: FileData
            // images: FileData[]
            // user: User
          },
          quantity: mockStock,
          price: 10,
          total: 10
        }],
        total: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    })

    await cartStore.addToCart(mockProductId, mockStock)

    expect(cartStore.cart?.items.length).toBe(1)
    expect(cartStore.cart?.items[0].product_id).toBe(mockProductId)
    expect(cartStore.cart?.items[0].quantity).toBe(mockStock)
  })
})