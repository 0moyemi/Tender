import React, { useContext, useEffect } from 'react'
import { useState } from "react"
import { Link, useParams, useLocation } from "react-router-dom"
import { ArrowLeft, ShoppingCart, Plus, Minus, Menu } from "lucide-react"
import axios from 'axios'
import { CartContext } from '../context/CartContext'

const ProductDetails = () => {
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
  const { cartCount, updateCartCount } = useContext(CartContext)
  const { _id } = useParams()
  const [product, setproduct] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_APP_API_URL}/marketplace/products/${_id}`)
      .then((res) => {
        setproduct(res.data.product)
      })
      .catch((err) => {
        // console.log removed for production
      })
  }, [_id])

  if (!product) return <p className="text-center mt-5">Loading...</p>

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || []
    const existing = cart.find(item => item._id === product._id)

    if (existing) {
      existing.quantity += quantity
    } else {
      cart.push({ ...product, quantity })
    }

    localStorage.setItem("cart", JSON.stringify(cart))

    // TO RESET TO 1
    setQuantity(1)
    setShowSuccessModal(true)

    // UPDATE GLOBAL BADGE
    updateCartCount(cart)
  }

  return (
    <div className="min-vh-100">
      <nav className="navbar navbar-dark border-bottom border-secondary">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/" className="navbar-brand p-0 m-0">
            <img src="https://i.postimg.cc/pVnM03Gg/New-Tender.png" width={80} className="navbar-brand mb-0 h1" alt="" />
          </Link>
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-link text-white text-decoration-none position-relative p-0 border-0 bg-transparent"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#menuOffcanvas"
            >
              <Menu size={24} />
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              )}
            </button>
            <Link
              to="/"
              className="btn btn-link text-white text-decoration-none p-0 d-inline-flex align-items-center gap-2"
            >
              <ArrowLeft size={20} />
              Back
            </Link>
          </div>
        </div>
      </nav>

      {/* Offcanvas Menu */}
      <div className="offcanvas offcanvas-end text-bg-dark" id="menuOffcanvas">
        <div className="offcanvas-header border-bottom border-secondary">
          <h5 className="offcanvas-title">Menu</h5>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          <ul className="list-unstyled">
            <li className="mb-3">
              <Link to="/cart" className="text-decoration-none text-white d-flex align-items-center gap-2 position-relative">
                <ShoppingCart size={20} />
                Cart
                {cartCount > 0 && (
                  <span className="badge bg-danger ms-2">{cartCount}</span>
                )}
              </Link>
            </li>
            <li className="mb-3">
              <Link to="/checkout" className="text-decoration-none text-white">
                Checkout
              </Link>
            </li>
            <li className="mb-3">
              <Link to="/" className="text-decoration-none text-white">
                Marketplace
              </Link>
            </li>
            <li className="mb-3">
              <Link to="/about" className="text-decoration-none text-white">
                About / Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card bg-dark border-secondary">
              <img
                src={product.image || "/placeholder.svg"}
                className="card-img-top"
                alt={product.name}
                style={{ height: "400px", objectFit: "cover" }}
              />
            </div>
          </div>

          <div className="col-lg-6">
            <h1 className="h3 text-white mb-2">{product.name}</h1>
            <div className="d-flex align-items-center gap-3 mb-3">
              <span className="text-muted small">
                Sold by <span className="text-danger">{product.vendorName}</span>
              </span>
            </div>

            <p className="text-danger h4 mb-4">₦{product.price.toLocaleString()}</p>

            <div className="card bg-dark border-secondary p-3 mb-4">
              <h5 className="text-white h6 mb-3">Description:</h5>
              <p className="text-muted mb-3">{product.description}</p>
              <h5 className="text-white h6 mb-2">Features:</h5>
              <ul className="text-muted mb-0">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="card bg-dark border-secondary p-3 mb-3">
              <div className="d-flex align-items-center gap-3 mb-3">
                <span className="text-white">Quantity:</span>
                <div className="btn-group">
                  <button className="btn btn-outline-danger" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus size={16} />
                  </button>
                  <button className="btn btn-outline-danger" disabled>
                    {quantity}
                  </button>
                  <button className="btn btn-outline-danger" onClick={() => setQuantity(quantity + 1)}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <button className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2" onClick={addToCart}>
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            </div>

            <button
              className="btn btn-outline-danger w-100"
              onClick={() => {
                const cart = JSON.parse(localStorage.getItem("cart")) || [];
                const existing = cart.find(item => item._id === product._id);
                if (existing) {
                  existing.quantity += quantity;
                } else {
                  cart.push({ ...product, quantity });
                }
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartCount(cart);
                window.location.href = "/checkout";
              }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <div className={`modal fade ${showSuccessModal ? 'show' : ''}`} style={{ display: showSuccessModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-dark border-secondary">
            <div className="modal-header border-secondary">
              <h5 className="modal-title text-white">Success!</h5>
              <button type="button" className="btn-close btn-close-white" onClick={() => setShowSuccessModal(false)}></button>
            </div>
            <div className="modal-body text-white">
              <p className="mb-0">{product?.name} has been added to your cart.</p>
            </div>
            <div className="modal-footer border-secondary">
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowSuccessModal(false)}>Continue Shopping</button>
              <Link to="/cart" className="btn btn-danger" onClick={() => setShowSuccessModal(false)}>View Cart</Link>
            </div>
          </div>
        </div>
      </div>
      {showSuccessModal && <div className="modal-backdrop fade show" onClick={() => setShowSuccessModal(false)}></div>}
    </div>
  )
}

export default ProductDetails