import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { Mail, Lock, ArrowLeft, Shield } from "lucide-react"
import axios from 'axios'

const AdminLogin = () => {
  const URL = `${import.meta.env.VITE_APP_API_URL}/admin/login`;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    axios.post(URL, { email, password })
      .then((response) => {
        if (response.data && response.data.token) {
          localStorage.adminToken = response.data.token;
          navigate('/admin/dashboard');
        } else {
          setError(response.data.message || 'Login failed');
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Login failed');
      });
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3">
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <div className="mb-4 text-center">
          <Shield className="text-danger mb-3" size={48} />
          <h1 className="h3 text-white mb-2">Admin Access</h1>
          <p className="text-muted">Sign in to manage the platform</p>
        </div>
        <form onSubmit={handleSubmit} className="card bg-dark border-secondary p-4">
          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-white small">
              Admin Email
            </label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary">
                <Mail size={18} className="text-muted" />
              </span>
              <input
                type="email"
                id="email"
                className="form-control bg-dark border-secondary text-white"
                placeholder="admin@marketplace.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label text-white small">
              Admin Password
            </label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary">
                <Lock size={18} className="text-muted" />
              </span>
              <input
                type="password"
                id="password"
                className="form-control bg-dark border-secondary text-white"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-danger w-100 mb-3">
            Admin Sign In
          </button>
          <div className="text-center">
            <Link to="/" className="text-muted small text-decoration-none d-inline-flex align-items-center gap-1">
              <ArrowLeft size={14} />
              Back to Marketplace
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;