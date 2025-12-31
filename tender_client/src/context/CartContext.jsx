import React, { createContext, useState, useEffect } from 'react'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0)

    const updateCartCount = (cart) => {
        const total = cart.reduce((acc, item) => acc + item.quantity, 0)
        setCartCount(total)
    }

    // Initialize cart count on mount
    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart")) || []
        updateCartCount(cart)
    }, [])

    return (
        <CartContext.Provider value={{ cartCount, updateCartCount }}>
            {children}
        </CartContext.Provider>
    )
}
