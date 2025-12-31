import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { Search, Menu, ShoppingCart, CreditCard, UserPlus, Info } from "lucide-react"
import axios from 'axios'
import { CartContext } from '../context/CartContext'

const Marketplace = () => {
  const { cartCount, updateCartCount } = useContext(CartContext)
  const navigate = useNavigate()
  const [products, setproducts] = useState([])
  const [search, setsearch] = useState('')
  const [selectCategory, setselectCategory] = useState('All Products')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [addedProduct, setAddedProduct] = useState(null)

  const addToCart = (e, product) => {
    e.stopPropagation()
    const cart = JSON.parse(localStorage.getItem("cart")) || []
    const existing = cart.find(item => item._id === product._id)

    if (existing) {
      existing.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    updateCartCount(cart)
    setAddedProduct(product)
    setShowSuccessModal(true)
  }

  const fetchProducts = () => {
    axios.get(`${import.meta.env.VITE_APP_API_URL}/marketplace/products`)
      .then((res) => {
        if (res.data.status) {
          setproducts(res.data.message || [])
          console.log(res.data)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const normalizeSearch = (str = '') => str.toLocaleLowerCase().replace(/\s+/g, "")

  const filteredProducts = products.filter(product => {
    const matchesSearch = normalizeSearch(product.name).includes(normalizeSearch(search))
    const matchesCategory = selectCategory === 'All Products' || product.category === selectCategory
    return matchesSearch && matchesCategory
  })

  const categories = [
    "Electronics",
    "Fashion",
    "Home & Living",
    "Sports",
    "Books",
    "Beauty",
    "Toys",
    "Automotive",
    "Food",
    "Health",
    "Gadgets"
  ]

  return (
    <div className="min-vh-100">
      {/* Sticky Navbar */}
      <nav className="navbar navbar-dark sticky-top border-bottom border-secondary">
        <div className="container-fluid">
          <img src="https://i.postimg.cc/pVnM03Gg/New-Tender.png" width={80} className="navbar-brand mb-0 h1" alt="" />
          <button
            className="navbar-toggler border-0 position-relative"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#menuOffcanvas"
          >
            <Menu className="text-white" size={24} />
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartCount}
              </span>
            )}
          </button>
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
              <Link to="/checkout" className="text-decoration-none text-white d-flex align-items-center gap-2">
                <CreditCard size={20} />
                Checkout
              </Link>
            </li>
            <li className="mb-3">
              <Link to="/vendor/signin" className="text-decoration-none text-white d-flex align-items-center gap-2">
                <UserPlus size={20} />
                Become a Vendor
              </Link>
            </li>
            <li className="mb-3">
              <Link to="/about" className="text-decoration-none text-white d-flex align-items-center gap-2">
                <Info size={20} />
                About / Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container py-4">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="input-group">
            <span className="input-group-text bg-dark border-secondary">
              <Search size={20} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control bg-dark border-secondary text-white"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setsearch(e.target.value)}
            />
          </div>
        </div>

        <div className="d-flex gap-2 flex-wrap mb-3">
        </div>

        {/* Category Pills */}
        <div className="mb-4 d-flex flex-wrap gap-2">
          {['All Products', ...categories].map((cat) => (
            <button
              key={cat}
              className={`btn btn-outline-light btn-sm rounded-pill ${selectCategory === cat ? '' : 'btn-outline-secondary'}`}
              style={selectCategory === cat ? { backgroundColor: '#dc3545', color: '#fff', borderColor: '#dc3545' } : {}}
              onClick={() => setselectCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="row g-3">
          {filteredProducts.map((product) => (
            <div key={product._id} className="col-6 col-lg-3">
              <div
                className="card bg-dark border-secondary h-100"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img
                  src={product.image || "/placeholder.svg"}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title text-white mb-1">{product.name}</h6>
                  <p className="text-danger fw-bold mb-2">₦{product.price.toLocaleString()}</p>
                  <p className="card-text small Products mb-3">{product.description}</p>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <button
                      onClick={(e) => addToCart(e, product)}
                      className="btn btn-danger btn-sm rounded-circle"
                      style={{ width: "35px", height: "36px" }}
                    >
                      <ShoppingCart size={16} />
                    </button>
                    <Link
                      to={`/product/${product._id}`}
                      className="btn btn-outline-danger btn-sm rounded-pill px-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
              <p className="mb-0">{addedProduct?.name} has been added to your cart.</p>
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

export default Marketplace