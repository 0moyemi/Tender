import { useState } from 'react'
import './App.css'
import { Route, Routes, Navigate } from 'react-router-dom'
import VendorSignUp from './pages/VendorSignUp'
import VendorSignIn from './pages/VendorSignIn'
import VendorDashboard from './pages/VendorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import About from './pages/About'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Marketplace from './pages/Marketplace'
import ProductDetails from './pages/ProductDetails'
import AdminLogin from './pages/AdminLogin'
import { CartProvider } from './context/CartContext'

function App() {
  let token = localStorage.token;

  return (
    <CartProvider>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/" element={<Marketplace />} />
        <Route path="/product/:_id" element={<ProductDetails />} />
        <Route path="/vendor/dashboard" element={token ? <VendorDashboard /> : <Navigate to={"/vendor/signin"} />} />
        <Route path="/vendor/signin" element={<VendorSignIn />} />
        <Route path="/vendor/signup" element={<VendorSignUp />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </CartProvider>
  )
}

export default App
