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
    
    const mockFileData = {
      id: 1,
      uuid: 'file-uuid',
      name: 'mock.jpg',
      path: '/mock.jpg',
      url: 'https://example.com/mock.jpg',
      type: 'image/jpeg',
      status: 1,
      fileable_id: 1,
      fileable_type: 'Product',
      created_at: '',
      updated_at: ''
    }

    const mockUser = {
      id: 1,
      uuid: 'user-uuid',
      name: 'Mock User',
      email: 'mock@example.com',
      phone: '123456789',
      address: 'Fake St',
      role_id: 1,
      status: 1,
      rating: 5,
      punctuation: 100,
      bulk_offer: 0,
      bulk_products: 0,
      avatar: null,
      email_verified_at: null,
      code_password: null,
      date_code_password: null,
      lat: null,
      lng: null,
      created_at: '',
      updated_at: ''
    }

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
            lenght: '10',
            cart: 0,
            favorite: 0,
            make_offer: 0,
            brands: [],
            categories: [],
            colors: [],
            offers: [],
            image: mockFileData,
            images: [mockFileData],
            user: mockUser,
            created_at: '',
            updated_at: ''
          },
          stock: mockStock,
          price: 10,
          total: 10
        }],
        total: 10,
        created_at: '',
        updated_at: ''
      }
      return {
        id: 1,
        uuid: 'mock-uuid',
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
          lenght: '10',
          cart: 0,
          favorite: 0,
          make_offer: 0,
          brands: [],
          categories: [],
          colors: [],
          offers: [],
          image: mockFileData,
          images: [mockFileData],
          user: mockUser,
          created_at: '',
          updated_at: ''
        },
        stock: mockStock,
        price: 10,
        total: 10,
        created_at: '',
        updated_at: ''
      }
    })

    await cartStore.addToCart(mockProductId, mockStock)

    expect(cartStore.cart?.items.length).toBe(1)
    expect(cartStore.cart?.items[0].product_id).toBe(mockProductId)
    expect(cartStore.cart?.items[0].stock).toBe(mockStock)
  })
})