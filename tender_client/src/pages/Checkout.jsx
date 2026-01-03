import React, { useContext, useEffect } from 'react'
import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, CreditCard } from "lucide-react"
import { CartContext } from '../context/CartContext'

const Checkout = () => {
  const location = useLocation();
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  // Scroll lock for modal
  useEffect(() => {
    if (showSuccessModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showSuccessModal]);

  // Clean up modal on route change
  useEffect(() => {
    setShowSuccessModal(false);
    document.body.style.overflow = '';
  }, [location.pathname]);
  const { updateCartCount } = useContext(CartContext)
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [trackingNumber, setTrackingNumber] = useState('')
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  })

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || []
    setCart(stored)
  }, [])

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const shipping = 0
  const total = subtotal + shipping

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Generate tracking number
    const tracking = 'TND' + Math.floor(Math.random() * 1000000)
    setTrackingNumber(tracking)

    // Clear cart
    localStorage.setItem("cart", JSON.stringify([]))
    setCart([])
    updateCartCount([])

    // Show success modal
    setShowSuccessModal(true)
  }
  return (
    <div className="min-vh-100">
      <nav className="navbar navbar-dark border-bottom border-secondary">
        <div className="container">
          <Link
            to="/cart"
            className="btn btn-link text-white text-decoration-none p-0 d-inline-flex align-items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Cart
          </Link>
        </div>
      </nav>

      <div className="container py-4">
        <h1 className="h3 text-white mb-4">Checkout</h1>

        <div className="row g-4">
          <div className="col-lg-8">
            <form onSubmit={handleSubmit}>
              <div className="card bg-dark border-secondary p-4 mb-4">
                <h5 className="text-white mb-3">Shipping Information</h5>
                <div className="row g-3">
                  <div className="col-12">
                    <label htmlFor="fullName" className="form-label text-white small">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="form-control bg-dark border-secondary text-white"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label text-white small">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control bg-dark border-secondary text-white"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label text-white small">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="form-control bg-dark border-secondary text-white"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="address" className="form-label text-white small">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      className="form-control bg-dark border-secondary text-white"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="city" className="form-label text-white small">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      className="form-control bg-dark border-secondary text-white"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="state" className="form-label text-white small">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      className="form-control bg-dark border-secondary text-white"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="card bg-dark border-secondary p-4">
                <h5 className="text-white mb-3 d-flex align-items-center gap-2">
                  <CreditCard size={20} />
                  Payment Method
                </h5>
                <div className="form-check mb-2">
                  <input className="form-check-input" type="radio" name="payment" id="card" defaultChecked />
                  <label className="form-check-label text-white" htmlFor="card">
                    Credit/Debit Card
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input className="form-check-input" type="radio" name="payment" id="transfer" />
                  <label className="form-check-label text-white" htmlFor="transfer">
                    Bank Transfer
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="payment" id="delivery" />
                  <label className="form-check-label text-white" htmlFor="delivery">
                    Pay on Delivery
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-danger w-100 mt-4">
                Place Order
              </button>
            </form>
          </div>

          <div className="col-lg-4">
            <div className="card bg-dark border-secondary p-4">
              <h5 className="text-white mb-3">Order Summary</h5>
              <div className="mb-3">
                <p className="text-muted small mb-2">{cart.length} item(s)</p>
                {cart.map((item) => (
                  <div key={item._id} className="d-flex justify-content-between mb-2">
                    <span className="text-white small">{item.name} x {item.quantity}</span>
                    <span className="text-white small">₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span className="text-white">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 pb-3 border-bottom border-secondary">
                <span className="text-muted">Shipping (free)</span>
                <span className="text-white">₦{shipping.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-white fw-bold">Total</span>
                <span className="text-danger fw-bold h5 mb-0">₦{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Success Modal */}
      <div className={`modal fade ${showSuccessModal ? 'show' : ''}`} style={{ display: showSuccessModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-dark border-secondary">
            <div className="modal-header border-secondary">
              <h5 className="modal-title text-white">Order Confirmed!🎉</h5>
              <button type="button" className="btn-close btn-close-white" onClick={() => { setShowSuccessModal(false); navigate('/'); }}></button>
            </div>
            <div className="modal-body text-white">
              <p className="mb-3">Thank you for shopping on <strong>Tender!</strong> Your purchase has been confirmed.</p>
              <div className="card bg-secondary bg-opacity-25 border-0 p-3 mb-3">
                <p className="mb-1 small text-muted">Tracking Number:</p>
                <p className="mb-0 h5 text-danger">{trackingNumber}</p>
              </div>
              <p className="mb-2"><strong>Estimated Delivery:</strong> 24-48 hours</p>
              <p className="mb-2"><strong>Confirmation:</strong> Check your email for order details and updates.</p> <br />
              <p className="mb-0 small text-muted">Visit our <Link to="/about" className="text-danger" onClick={() => setShowSuccessModal(false)}>Contact page</Link> for any issues or questions.</p>
            </div>
            <div className="modal-footer border-secondary">
              <button type="button" className="btn btn-outline-danger" onClick={() => { setShowSuccessModal(false); navigate('/'); }}>Continue Shopping</button>
            </div>
          </div>
        </div>
      </div>
      {showSuccessModal && <div className="modal-backdrop fade show" onClick={() => { setShowSuccessModal(false); navigate('/'); }}></div>}
    </div>
  )
}

export default Checkout