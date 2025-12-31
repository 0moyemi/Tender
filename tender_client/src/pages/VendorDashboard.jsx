import React, { useEffect } from 'react'
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"
import axios from 'axios'

const VendorDashboard = () => {
  const categories = [
    "Electronics",
    "Fashion",
    "Home & Living",
    "Sports",
    "Beauty",
    "Toys",
    "Automotive",
    "Gadgets"
  ]

  const navigate = useNavigate()

  const getAuthHeader = () => {
    let token = localStorage.getItem("token");
    if (token) token = token.replace(/^"(.*)"$/, '$1').trim(); // Remove quotes and trim
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  }

  const [formData, setformData] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    category: '',
    features: ''
  })

  // ...existing code...

  const handleInputChange = (e) => {
    setformData({
      ...formData, [e.target.name]: e.target.value
    })
  }

  const uploadProduct = (e) => {
    if (e) e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Token not found.");
      return;
    }
    const URL = editingId ? `${import.meta.env.VITE_APP_API_URL}/vendor/dashboard/${editingId}` : `${import.meta.env.VITE_APP_API_URL}/vendor/dashboard`;
    const method = editingId ? axios.put : axios.post;
    const processedData = {
      ...formData,
      features: formData.features.split(",").map(f => f.trim()).filter(Boolean)
    };
    method(URL, processedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    })
      .then((response) => {
        if (response.data.status) {
          console.log(editingId ? "Product updated!" : "Product uploaded successfully!");
          setformData({ name: '', price: '', image: '', description: '', category: '', features: '' });
          seteditingId(null);
          fetchProducts();
        } else {
          console.log("Failed to upload products: " + response.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const [products, setproducts] = useState([]);

  const fetchProducts = () => {
    let URL = `${import.meta.env.VITE_APP_API_URL}/vendor/dashboard`

    axios.get(URL, getAuthHeader())
      .then((response) => {
        console.log("Fetch products response:", response.data);
        if (response.data.products) {
          setproducts(response.data.products)
          console.log("Products loaded:", response.data.products.length);
        } else {
          console.log("No products found in response:", response.data);
        }
      })
      .catch((err) => {
        console.log("Error fetching products:", err)
      })

  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token || token === 'null' || token === 'undefined') {
      navigate("/vendor/signin")
      return
    }

    axios.get(`${import.meta.env.VITE_APP_API_URL}/vendor/dashboard/auth`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (res.data && res.data.status) {
          fetchProducts();
        } else {
          localStorage.removeItem("token");
          navigate("/vendor/signin");
        }
      })
      .catch((err) => {
        console.log('DEBUG useEffect catch block error:', err);
        // If error is 401/403 or message contains 'unauthorized', clear token and redirect
        if (
          (err.response && (err.response.status === 401 || err.response.status === 403)) ||
          (err.response && err.response.data && typeof err.response.data.message === 'string' && err.response.data.message.toLowerCase().includes('unauthorized'))
        ) {
          localStorage.removeItem("token")
          navigate("/vendor/signin")
        } else {
          // Log other errors for debugging
          console.log(err)
        }
      })
  }, [])

  const deleteProduct = (_id) => {
    const token = localStorage.getItem("token")

    axios.delete(`${import.meta.env.VITE_APP_API_URL}/vendor/dashboard/${_id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(() => {
        fetchProducts()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const [editingId, seteditingId] = useState(null)

  const startEdit = (product) => {
    seteditingId(product._id)
    setformData({
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      category: product.category,
      features: Array.isArray(product.features) ? product.features.join(", ") : (product.features || "")
    })
  }
  return (
    <div className="min-vh-100">
      <nav className="navbar navbar-dark border-bottom border-secondary">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <Link to="/" className="navbar-brand p-0 m-0">
          <img src="https://i.postimg.cc/pVnM03Gg/New-Tender.png" width={80} className="navbar-brand mb-0 h1" alt="" />
          </Link>
          <div className="d-flex align-items-center gap-3">
            <span className="text-white small d-none d-md-inline">Vendor Panel</span>
            <Link to="/" className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2">
              <LogOut size={16} />
              Logout
            </Link>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <div className="card bg-dark border-secondary">
              <div className="card-header bg-dark border-secondary">
                <h5 className="text-white mb-0">{editingId ? "Edit Product" : "Add Product"}</h5>
              </div>
              <div className="card-body">
                <form onSubmit={uploadProduct}>
                  {/* Product Name */}
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label text-white small">
                      Product Name
                    </label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      id="name"
                      name="name"
                      value={formData.name ?? ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  {/* Category */}
                  <div className="mb-3">
                    <label htmlFor="category" className="form-label text-white small">
                      Category
                    </label>
                    <select
                      className="form-select bg-dark text-white border-secondary shadow-none"
                      id="category"
                      name="category"
                      value={formData.category ?? ''}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Price */}
                  <div className="mb-3">
                    <label htmlFor="price" className="form-label text-white small">
                      Price (₦)
                    </label>
                    <input
                      type="number"
                      className="form-control bg-dark text-white border-secondary"
                      id="price"
                      name="price"
                      value={formData.price ?? ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  {/* Image URL */}
                  <div className="mb-3">
                    <label htmlFor="image" className="form-label text-white small">
                      Image URL
                    </label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      id="image"
                      name="image"
                      value={formData.image ?? ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  {/* Description */}
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label text-white small">
                      Description
                    </label>
                    <textarea
                      className="form-control bg-dark text-white border-secondary"
                      id="description"
                      name="description"
                      rows="3"
                      value={formData.description ?? ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  {/* Key Features */}
                  <div className="mb-3">
                    <label htmlFor="features" className="form-label text-white small">
                      Key Features (minimum of 2)
                    </label>
                    <textarea
                      className="form-control bg-dark text-white border-secondary"
                      id="features"
                      name="features"
                      rows="2"
                      value={formData.features ?? ''}
                      onChange={handleInputChange}
                      placeholder="e.g. Noise cancellation, 30h battery"
                      required
                    />
                    <div className="form-text text-muted small">Separate features with commas</div>
                  </div>
                  <button type="submit" className="btn btn-danger w-100">
                    {editingId ? "Update Product" : "Add Product"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card bg-dark border-secondary">
              <div className="card-header bg-dark border-secondary">
                <h5 className="text-white mb-0">Product Inventory</h5>
              </div>
              <div className="card-body p-0">
                {products.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    No products listed. Add your first item to start selling.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-dark table-hover align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product._id}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <img
                                  src={product.image || "/placeholder.svg"}
                                  alt=""
                                  style={{ width: "32px", height: "32px", objectFit: "cover" }}
                                  className="rounded"
                                />
                                <span>{product.name}</span>
                              </div>
                            </td>
                            <td className="small">{product.category}</td>
                            <td className="text-danger">₦{Number(product.price).toLocaleString()}</td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button className="btn btn-outline-primary" onClick={() => startEdit(product)}>
                                  Edit
                                </button>
                                <button className="btn btn-outline-danger" onClick={() => deleteProduct(product._id)}>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorDashboard