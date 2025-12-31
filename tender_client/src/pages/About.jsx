import React from 'react'
import { Link } from "react-router-dom"
import { ArrowLeft, Mail, Phone, Smartphone } from "lucide-react"
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa'

const About = () => {
  return (
    <div className="min-vh-100">
      <nav className="navbar navbar-dark border-bottom border-secondary">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/" className="navbar-brand p-0 m-0">
            <img src="https://i.postimg.cc/pVnM03Gg/New-Tender.png" width={80} className="navbar-brand mb-0 h1" alt="" />
          </Link>
          <Link
            to="/"
            className="btn btn-link text-white text-decoration-none p-0 d-inline-flex align-items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back
          </Link>
        </div>
      </nav>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">

            <h1 className="h2 text-white mb-4">🛒 About Tender</h1>
            <div className="card bg-dark border-secondary p-4 mb-4">
              <p className="text-white mb-3">
                Tender is a simple, reliable marketplace that connects vendors and customers in one place.
              </p>
              <ul className="text-muted mb-3 ps-3">
                <li>Vendors can list their products and reach new buyers.</li>
                <li>Customers can easily discover and shop from trusted sellers.</li>
              </ul>
              <p className="text-muted mb-3">
                Our goal is a smooth, secure, and enjoyable experience for everyone.
              </p>
              <h3 className="h6 text-danger d-flex align-items-center gap-2 mb-2 mt-4">
                <Smartphone size={18} />
                Get the App (PWA)
              </h3>
              <p className="text-muted small mb-3">
                Tender works as a Progressive Web App (PWA), so you can install it directly on your device—no app store needed.
              </p>
              <p className="text-muted small mb-3">
                Installing the app gives you faster access, a cleaner interface, and an app-like experience. You can install it using your browser’s Install App option or the button below.
              </p>
              <div className="d-flex justify-content-center mt-3">
                <button className="btn btn-danger d-flex align-items-center gap-2 px-4 py-2" onClick={() => window.prompt('To install, use your browser\'s Install App option!')}>
                  <span style={{ fontSize: '1.5rem' }}></span> Install Tender &#8595;
                </button>
              </div>
            </div>

            <h2 className="h4 text-white mb-3">📞 Contact</h2>

            <div className="card bg-dark border-secondary p-4">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3 mb-3">
                    <Mail className="text-danger mt-1" size={20} />
                    <div>
                      <h4 className="h6 text-white mb-1">Email</h4>
                      <p className="text-muted mb-0">muhammadomoyemi@gmail.com</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-3">
                    <Phone className="text-danger mt-1" size={20} />
                    <div>
                      <h4 className="h6 text-white mb-1">WhatsApp</h4>
                      <p className="text-muted mb-0">+234 9040991849</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <h4 className="h6 text-white mb-3">Follow us on:</h4>
                  <div className="d-flex gap-3">
                    <a href="#" className="text-muted hover-text-danger">
                      <FaInstagram size={24} />
                    </a>
                    <a href="#" className="text-muted hover-text-danger">
                      <FaTwitter size={24} />
                    </a>
                    <a href="#" className="text-muted hover-text-danger">
                      <FaFacebook size={24} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About