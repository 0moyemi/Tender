import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { Mail, Lock, User, ArrowLeft, Building } from "lucide-react"
import axios from 'axios'

const VendorSignUp = () => {
  // Removed global keydown event for Enter key for SPA best practice

  const [businessName, setbusinessName] = useState('')
  const [ownerName, setownerName] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')

  const [error, seterror] = useState('')
  const [loading, setloading] = useState(false)
  const [message, setmessage] = useState('')


  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{9,}$/
  const nameRegex = /^[A-Za-z ]{2,50}$/
  const emailRegex = /^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

  const validateForm = () => {
    const normalizedEmail = email.trim().toLowerCase()
    const normalizedOwnerName = ownerName.trim()
    const normalizedBusinessName = businessName.trim()

    if (!nameRegex.test(normalizedOwnerName)) {
      seterror("Name should contain only letters (minimum of 2) and spaces.")
      return false
    } if (!emailRegex.test(normalizedEmail)) {
      seterror("Enter a valid e-mail address.")
      return false
    }

    seterror('')
    return true
  }

  const [passwordError, setpasswordError] = useState('')

  const handleSubmit = () => {
    if (!passwordRegex.test(password)) {
      // alert("Password too weak! Must be at least 9 characters and include uppercase, lowercase, number and special character.")
      return
    }

    signUp()
  }

  const [touched, settouched] = useState({
    businessName: false,
    ownerName: false,
    email: false,
    password: false
  })

  // SIGN UP
  // API URL is loaded from environment variable for security; never hardcode secrets in frontend
  let URL = `${import.meta.env.VITE_APP_API_URL}/vendor/signup`
  let navigate = useNavigate()

  const signUp = () => {
    setloading(true)
    setmessage("Creating account...")

    if (!validateForm()) return

    const normalizedEmail = email.trim().toLowerCase()
    const normalizedBusinessName = businessName.trim()
    const normalizedOwnerName = ownerName.trim()

    axios.post(URL, { businessName: normalizedBusinessName, ownerName: normalizedOwnerName, email: normalizedEmail, password })
      .then((response) => {
        // console.log removed for production

        if (response.data.status) {
          navigate("/vendor/signin")
        } else {
          seterror(response.data.message || "Something went wrong.")
        }
      })
      .catch((err) => {
        // console.error removed for production
        seterror(err.response.data.message || err.message || "Something went wrong.")
      })
      .finally(() => {
        setloading(false)
      })
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3">
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <div className="mb-4">
          <Link
            to="/"
            className="btn btn-link text-white text-decoration-none p-0 mb-3 d-inline-flex align-items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Marketplace
          </Link>
          <h1 className="h3 text-white mb-2">Vendor Sign Up</h1>
          <p className="text-muted">Create your vendor account on Tender</p>
        </div>

        {error && <p className="text-danger small mb-2">{error}</p>}


        <div className="card bg-dark border-secondary p-4">
          <div className="mb-3">
            <label htmlFor="businessName" className="form-label text-white small" required>
              Business Name
            </label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary">
                <Building size={18} className="text-muted" />
              </span>
              <input
                type="text"
                id="businessName"
                name="businessName"
                className="form-control bg-dark border-secondary text-white"
                placeholder="Your business name"
                onChange={(e) => setbusinessName(e.target.value)}
                onBlur={() => settouched({ ...touched, businessName: true })}
                required
              />
            </div>
            {touched.businessName && !businessName && (
              <div className="text-danger small mt-1">Business Name is required</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="ownerName" className="form-label text-white small" required>
              Owner Name
            </label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary">
                <User size={18} className="text-muted" />
              </span>
              <input
                type="text"
                id="ownerName"
                name="ownerName"
                className="form-control bg-dark border-secondary text-white"
                placeholder="Your full name"
                onChange={(e) => setownerName(e.target.value)}
                onBlur={() => settouched({ ...touched, ownerName: true })}
                required
              />
            </div>
            {touched.ownerName && !ownerName && (
              <div className="text-danger small mt-1">Owner Name is required</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label text-white small" required>
              Email Address
            </label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary">
                <Mail size={18} className="text-muted" />
              </span>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control bg-dark border-secondary text-white"
                placeholder="vendor@example.com"
                onChange={(e) => setemail(e.target.value)}
                onBlur={() => settouched({ ...touched, email: true })}
                required
              />
            </div>
            {touched.email && !email && (
              <div className="text-danger small mt-1">e-mail is required</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label text-white small" required>
              Password
            </label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary">
                <Lock size={18} className="text-muted" />
              </span>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control bg-dark border-secondary text-white"
                placeholder="Create a password"
                onChange={(e) => {
                  setpassword(e.target.value);

                  // Password error
                  if (!e.target.value) {
                    setpasswordError("Password is required.")
                  } else if (!passwordRegex.test(e.target.value)) {
                    setpasswordError("Password too weak! Must be at least 9 characters and include uppercase, lowercase, number and special character.")
                  } else {
                    setpasswordError("")
                  }
                }}
                onBlur={() => settouched({ ...touched, password: true })}
                required
              />
            </div>
            {touched.password && (passwordError || !password) && (
              <div className="text-danger small mt-1">{passwordError || "Password is required."}</div>
            )}
          </div>
          {/* {error && <p className="text-danger small mb-2">{error}</p>} */}


          <button className="btn btn-danger w-100 mb-3" onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating account..." : "Create Vendor Account"}
          </button>

          {loading && (
            <p className="text-muted small mt-2 text-center">
              This may take a few seconds. Please don’t refresh.
            </p>
          )}

          <div className="text-center">
            <p className="text-muted small mb-0">
              Already have a vendor account?{" "}
              <Link to="/vendor/signin" className="text-danger text-decoration-none">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorSignUp