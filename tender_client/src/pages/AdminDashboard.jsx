import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { LogOut, Users, Package, DollarSign, TrendingUp, Edit2 } from "lucide-react"
import axios from 'axios'

const AdminDashboard = () => {
  const [vendors, setvendors] = useState([])
  const [stats, setStats] = useState([
    { label: 'Vendors', value: 0, icon: Users, color: 'primary' },
    { label: 'Revenue', value: '$0', icon: DollarSign, color: 'success' },
  ])
  const [editingVendor, setEditingVendor] = useState(null)
  const [editForm, setEditForm] = useState({ businessName: '', ownerName: '' })
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [vendorToSuspend, setVendorToSuspend] = useState(null);
  const navigate = useNavigate()

  const getAdminHeader = () => {
    const token = localStorage.getItem("adminToken")
    if (!token) return {}
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  }

  const fetchVendors = () => {
    axios.get(`${import.meta.env.VITE_APP_API_URL}/admin/vendors`, getAdminHeader())
      .then((res) => {
        if (res.data.status) {
          setvendors(res.data.message)
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        } else {
          console.log(err)
        }
      })
  }

  // Token check on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    // Optionally check expiry with jwt-decode here
    fetchVendors();
  }, [])

  const deleteVendor = (_id) => {
    axios.delete(`${import.meta.env.VITE_APP_API_URL}/admin/vendors/${_id}`, getAdminHeader())
      .then((res) => {
        if (res.data && res.data.status) {
          setvendors(prev => prev.filter(v => v._id !== _id))
        } else {
          console.warn('deleteVendor: unexpected response', res.data)
        }
        closeSuspendModal();
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        } else {
          console.error('deleteVendor error:', err.response || err.message || err)
        }
        closeSuspendModal();
      })
  }

  const openEdit = (vendor) => {
    setEditingVendor(vendor);
    setEditForm({ businessName: vendor.businessName, ownerName: vendor.ownerName });
  }

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  }

  const editVendor = () => {
    if (!editingVendor) return;
    axios.put(
      `${import.meta.env.VITE_APP_API_URL}/admin/vendors/${editingVendor._id}`,
      { ...editingVendor, ...editForm },
      getAdminHeader()
    )
      .then((res) => {
        if (res.data.status) {
          setvendors(prev => prev.map(v => v._id === editingVendor._id ? { ...v, ...editForm } : v));
          setEditingVendor(null);
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        } else {
          console.error('editVendor error:', err.response || err.message || err);
        }
      });
  }

  const openSuspendModal = (vendor) => {
    setVendorToSuspend(vendor);
    setShowSuspendModal(true);
  };

  const closeSuspendModal = () => {
    setShowSuspendModal(false);
    setVendorToSuspend(null);
  };

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
                    name="businessName"
                    className="form-control bg-dark text-white border-secondary"
                    value={editForm.businessName}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white small">Owner Name</label>
                  <input
                    type="text"
                    name="ownerName"
                    className="form-control bg-dark text-white border-secondary"
                    value={editForm.ownerName}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="col-12">
                  <button className="btn btn-danger btn-sm px-4" onClick={editVendor}>
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
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendors.map((vendor) => (
                        <tr key={vendor._id}>
                          <td>{vendor.businessName}</td>
                          <td>{vendor.ownerName}</td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button className="btn btn-outline-primary" onClick={() => openEdit(vendor)}>
                                <Edit2 size={14} />
                              </button>
                              <button className="btn btn-outline-danger" onClick={() => openSuspendModal(vendor)}>
                                Suspend
                              </button>
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

        {/* Suspend Confirmation Modal */}
        {showSuspendModal && vendorToSuspend && (
          <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content bg-dark text-white border-danger">
                <div className="modal-header border-danger">
                  <h5 className="modal-title">Suspend Vendor</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={closeSuspendModal}></button>
                </div>
                <div className="modal-body">
                  Are you sure you want to suspend <b>{vendorToSuspend.businessName}</b>?
                </div>
                <div className="modal-footer border-danger">
                  <button type="button" className="btn btn-secondary" onClick={closeSuspendModal}>Cancel</button>
                  <button type="button" className="btn btn-danger" onClick={() => deleteVendor(vendorToSuspend._id)}>Suspend</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard