import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import CartModal from './components/CartModal';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import OrderTracking from './pages/OrderTracking';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="app-wrapper">
            <div className="ambient-glow glow-1"></div>
            <div className="ambient-glow glow-2"></div>
            <div className="ambient-glow glow-3"></div>

            <Navbar />

            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/track" element={<OrderTracking />} />
                <Route path="/admin" element={<AdminPanel />} />
              </Routes>
            </main>
            
            <Footer />
            <AuthModal />
            <CartModal />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
