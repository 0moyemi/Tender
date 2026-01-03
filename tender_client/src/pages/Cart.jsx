import React, { useContext, useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import { ArrowLeft, Trash2, Plus, Minus } from "lucide-react"
import { CartContext } from '../context/CartContext'

const Cart = () => {
  const { updateCartCount } = useContext(CartContext)
  const [cart, setcart] = useState([])
  const [itemToDelete, setItemToDelete] = useState(null)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || []
    setcart(stored)
  }, [])

  const updateCart = (newCart) => {
    setcart(newCart)
    localStorage.setItem("cart", JSON.stringify(newCart))
    updateCartCount(newCart)
  }

  const increaseQuantity = (_id) => {
    const newCart = cart.map(item =>
      item._id === _id ? { ...item, quantity: item.quantity + 1 } : item
    )
    updateCart(newCart)
  }

  const decreaseQuantity = (_id) => {
    const newCart = cart.map(item =>
      item._id === _id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
    )
    updateCart(newCart)
  }

  const confirmDelete = () => {
    if (itemToDelete) {
      const newCart = cart.filter(item => item._id !== itemToDelete)
      updateCart(newCart)
      setItemToDelete(null)
    }
  }

  // const cartItems = [
  //   { id: 1, name: "Wireless Headphones", price: 25000, quantity: 1, image: "/wireless-headphones.png" },
  //   { id: 2, name: "Smart Watch", price: 45000, quantity: 2, image: "/modern-smartwatch.png" },
  // ]

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const shipping = 0
  const total = subtotal + shipping

  return (
    <div className="min-vh-100">
      <nav className="navbar navbar-dark border-bottom border-secondary">
        <div className="container">
          <Link
            to="/"
            className="btn btn-link text-white text-decoration-none p-0 d-inline-flex align-items-center gap-2"
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </Link>
        </div>
      </nav>

      <div className="container py-4">
        <h1 className="h3 text-white mb-4">Shopping Cart ({cart.length} items)</h1>

        <div className="row g-4">
          <div className="col-lg-8">
            {cart.map((item) => (
              <div key={item._id} className="card bg-dark border-secondary mb-3">
                <div className="card-body">
                  <div className="row g-3 align-items-center">
                    <div className="col-auto">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                        className="rounded"
                      />
                    </div>
                    <div className="col">
                      <h5 className="text-white mb-1">{item.name}</h5>
                      <p className="text-danger mb-0">₦{item.price.toLocaleString()}</p>
                    </div>
                    <div className="col-auto">
                      <div className="btn-group">
                        <button className="btn btn-outline-danger btn-sm" onClick={() => decreaseQuantity(item._id)}>
                          <Minus size={14} />
                        </button>
                        <button className="btn btn-outline-danger btn-sm" disabled>
                          {item.quantity}
                        </button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => increaseQuantity(item._id)}>
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="col-auto">
                      <p className="text-white mb-0 fw-bold">₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                    <div className="col-auto">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteModal"
                        onClick={() => setItemToDelete(item._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="col-lg-4">
            <div className="card bg-dark border-secondary p-4">
              <h5 className="text-white mb-3">Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span className="text-white">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 pb-3 border-bottom border-secondary">
                <span className="text-muted">Shipping (free)</span>
                <span className="text-white">₦{shipping.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-4">
                <span className="text-white fw-bold">Total</span>
                <span className="text-danger fw-bold h5 mb-0">₦{total.toLocaleString()}</span>
              </div>
              <button
                className="btn btn-danger w-100 mb-2"
                disabled={cart.length === 0}
                onClick={() => {
                  if (cart.length === 0) {
                    alert('Your cart is empty. Add items before proceeding to checkout.');
                  } else {
                    window.location.href = '/checkout';
                  }
                }}
              >
                Proceed to Checkout
              </button>
              <Link to="/" className="btn btn-outline-danger w-100">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div className="modal fade" id="deleteModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-dark border-secondary">
            <div className="modal-header border-secondary">
              <h5 className="modal-title text-white">Confirm Delete</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body text-white">
              Are you sure you want to remove this item from your cart?
            </div>
            <div className="modal-footer border-secondary">
              <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">No, keep item.</button>
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={confirmDelete}>Yes, remove item.</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart