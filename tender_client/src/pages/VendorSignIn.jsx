import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { Mail, Lock, ArrowLeft } from "lucide-react"
import axios from 'axios'
import { motion } from 'framer-motion'

const VendorSignIn = () => {
  window.addEventListener('keydown', (event) => {
    if (event.code === 'Enter') {
      signIn()
    }
  })

  const [touched, settouched] = useState({
    email: false,
    password: false
  })

  const [error, seterror] = useState('')
  const [loading, setloading] = useState(false)
  const [message, setmessage] = useState('')

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  let navigate = useNavigate()
  let URL = `${import.meta.env.VITE_APP_API_URL}/vendor/signin`

  const signIn = () => {
    setloading(true)
    setmessage("Signing in...")

    seterror("");
    axios.post(URL, { email, password })
      .then((response) => {
        // console.log removed for production

        // Only proceed when the server returns a token
        if (response.data && response.data.token) {
          localStorage.setItem("token", response.data.token);
          window.location.href = "/vendor/dashboard";
        } else {
          seterror(response.data.message || "Invalid email or password");
          setloading(false);
          setmessage("");
        }
      })
      .catch((err) => {
        // Set error message for failed request or invalid credentials
        if (err.response && err.response.data && err.response.data.message) {
          seterror(err.response.data.message);
        } else {
          seterror("Sign in failed. Please try again.");
        }
        setloading(false);
        setmessage("");
        // console.log removed for production
      })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="min-vh-100 d-flex align-items-center justify-content-center p-3"
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <div className="mb-4">
          <Link
            to="/"
            className="btn btn-link text-white text-decoration-none p-0 mb-3 d-inline-flex align-items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Marketplace
          </Link>
          <h1 className="h3 text-white mb-2">Vendor Sign In</h1>
          <p className="text-muted">Access your vendor dashboard</p>
        </div>

        {error && <p className="text-danger small mb-2">{error}</p>}


        <div className="card bg-dark border-secondary p-4">
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-white small">
              Email Address
            </label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary">
                <Mail size={18} className="text-muted" />
              </span>
              <input
                type="email"
                id="email"
                className="form-control bg-dark border-secondary text-white"
                placeholder="vendor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => settouched({ ...touched, email: true })}
                required
              />
            </div>
            {touched.email && !email && (
              <div className="text-danger small mt-1">e-mail is required</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label text-white small">
              Password
            </label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary">
                <Lock size={18} className="text-muted" />
              </span>
              <input
                type="password"
                id="password"
                className="form-control bg-dark border-secondary text-white"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => settouched({ ...touched, password: true })}
                required
              />
            </div>
            {touched.password && !password && (
              <div className="text-danger small mt-1">Password is required</div>
            )}
          </div>

          <button className="btn btn-danger w-100 mb-3" onClick={signIn} disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>

          {loading && (
            <p className="text-muted small mt-2 text-center">
              This may take a few seconds. Please don’t refresh.
            </p>
          )}

          <div className="text-center">
            <p className="text-muted small mb-0">
              {"Don't have a vendor account? "}
              <Link to="/vendor/signup" className="text-danger text-decoration-none">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default VendorSignIn