import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext({})

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('moonweaver_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem('moonweaver_cart', JSON.stringify(cart))
    } catch {
      // ignore storage errors (e.g. private browsing quota)
    }
  }, [cart])

  function addToCart(product, qty = 1) {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i =>
          i.id === product.id ? { ...i, qty: i.qty + qty } : i
        )
      }
      return [...prev, { ...product, qty }]
    })
    setCartOpen(true)
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(i => i.id !== id))
  }

  function updateQty(id, qty) {
    if (qty < 1) {
      removeFromCart(id)
      return
    }
    setCart(prev => prev.map(i => (i.id === id ? { ...i, qty } : i)))
  }

  function clearCart() {
    setCart([])
  }

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{
      cart, cartOpen, setCartOpen, addToCart, removeFromCart,
      updateQty, clearCart, cartCount, cartTotal,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
