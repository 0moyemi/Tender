import React from 'react'
import { Link } from "react-router-dom"
import { LogOut, Users, Package, DollarSign, TrendingUp, Edit2 } from "lucide-react"
import { useState } from "react"

const AdminDashboard = () => {
  const stats = [
    { label: "Total Vendors", value: "156", icon: Users, color: "primary" },
    { label: "Total Products", value: "1,245", icon: Package, color: "info" },
    { label: "Platform Revenue", value: "₦12.5M", icon: DollarSign, color: "success" },
    { label: "Total Orders", value: "3,428", icon: TrendingUp, color: "warning" },
  ]

  const [vendors, setVendors] = useState([
    { id: 1, businessName: "TechPro Store", ownerName: "John Doe", products: 24, sales: "₦450,000", status: "Active" },
    {
      id: 2,
      businessName: "Fashion Hub",
      ownerName: "Jane Smith",
      products: 156,
      sales: "₦1,200,000",
      status: "Active",
    },
    {
      id: 3,
      businessName: "Home Essentials",
      ownerName: "Mike Johnson",
      products: 89,
      sales: "₦780,000",
      status: "Pending",
    },
  ])
  return (
    <div className="min-vh-100">
      <nav className="navbar navbar-dark border-bottom border-secondary">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand p-0 m-0">
            <img src="/images/tender.png" alt="Tender" height="30" />
          </Link>
          <div className="d-flex align-items-center gap-3">
            <span className="text-white small d-none d-md-inline">Admin Panel</span>
            <Link to="/" className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2">
              <LogOut size={16} />
              Logout
            </Link>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        {editingVendor && (
          <div className="card bg-dark border-danger mb-4">
            <div className="card-header bg-dark border-danger d-flex justify-content-between align-items-center">
              <h5 className="text-white mb-0">Edit Vendor: {editingVendor.businessName}</h5>
              <button className="btn-close btn-close-white" onClick={() => setEditingVendor(null)}></button>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-white small">Business Name</label>
                  <input
                    type="text"
                    className="form-control bg-dark text-white border-secondary"
                    defaultValue={editingVendor.businessName}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white small">Owner Name</label>
                  <input
                    type="text"
                    className="form-control bg-dark text-white border-secondary"
                    defaultValue={editingVendor.ownerName}
                  />
                </div>
                <div className="col-12">
                  <button className="btn btn-danger btn-sm px-4" onClick={() => setEditingVendor(null)}>
                    Save Changes
                  </button>
                  <button className="btn btn-outline-secondary btn-sm ms-2" onClick={() => setEditingVendor(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <h1 className="h3 text-white mb-4">Platform Overview</h1>

        <div className="row g-3 mb-4">
          {stats.map((stat, index) => (
            <div key={index} className="col-sm-6 col-lg-3">
              <div className="card bg-dark border-secondary p-3">
                <div className="d-flex align-items-center gap-3">
                  <div className={`text-${stat.color}`}>
                    <stat.icon size={32} />
                  </div>
                  <div>
                    <p className="text-muted small mb-0">{stat.label}</p>
                    <h3 className="h5 text-white mb-0">{stat.value}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          <div className="col-lg-12">
            <div className="card bg-dark border-secondary">
              <div className="card-header bg-dark border-secondary">
                <h5 className="text-white mb-0">Vendor Management</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-dark table-hover align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Business Name</th>
                        <th>Owner</th>
                        <th>Products</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendors.map((vendor) => (
                        <tr key={vendor.id}>
                          <td>{vendor.businessName}</td>
                          <td>{vendor.ownerName}</td>
                          <td>{vendor.products}</td>
                          <td>
                            <span className={`badge bg-${vendor.status === "Active" ? "success" : "warning"}`}>
                              {vendor.status}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button className="btn btn-outline-primary" onClick={() => setEditingVendor(vendor)}>
                                <Edit2 size={14} />
                              </button>
                              <button className="btn btn-outline-danger">Suspend</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard