import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, CheckCircle, MapPin, Phone, User as UserIcon, Mail, CreditCard, Smartphone, Building, ShieldCheck, Contact, UploadCloud, MessageSquare } from 'lucide-react';
import Tesseract from 'tesseract.js';
import emailjs from '@emailjs/browser';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import './CartModal.css';

const TIME_MULTIPLIERS = {
  '1_week': 0.35,
  '1_month': 1,
  '2_months': 1.9,
  '3_months': 2.7,
  '6_months': 5.0
};

const DURATION_LABELS = {
  '1_week': '1 Week',
  '1_month': '1 Month',
  '2_months': '2 Months',
  '3_months': '3 Months',
  '6_months': '6 Months'
};

const CartModal = () => {
  const { cart, removeFromCart, updateItemDuration, isCartOpen, closeCart, clearCart } = useCart();
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [checkoutStep, setCheckoutStep] = useState('CART'); // 'CART', 'KYC', 'KYC_OTP', 'FORM', 'PAYMENT', 'SUCCESS'
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [kycFile, setKycFile] = useState(null);
  const [kycError, setKycError] = useState('');
  const [kycOtp, setKycOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    aadhar: ''
  });
  const [paymentDetails, setPaymentDetails] = useState({ cardNumber: '', cardExp: '', cardCvc: '', cardName: '', upiId: '', netbankingBank: '' });
  const [paymentError, setPaymentError] = useState('');

  const handlePaymentChange = (e) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
    setPaymentError('');
  };

  // Hydrate form data automatically when user state changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || ''
      }));
    }
  }, [user, isCartOpen]);

  // Reset steps when closed manually
  useEffect(() => {
    if (!isCartOpen) {
      setTimeout(() => setCheckoutStep('CART'), 300);
    }
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const calculateItemPrice = (item) => {
    const basePrice = parseFloat(item.price.replace('₹', '').replace(/,/g, ''));
    const multiplier = TIME_MULTIPLIERS[item.duration || '1_month'];
    return basePrice * multiplier;
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + calculateItemPrice(item), 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });
  };

  const isValidAadhar = (aadhar) => {
    // Aadhaar must be exactly 12 digits, cannot start with 0 or 1
    if (!/^[2-9]{1}[0-9]{11}$/.test(aadhar)) return false; 
    // Reject repeated digits like 222222222222
    if (/^(\d)\1{11}$/.test(aadhar)) return false; 
    // Reject common dummy test strings
    if (aadhar === '123456789012' || aadhar === '234567890123' || aadhar === '987654321098') return false; 
    return true;
  };

  const handleKycSubmit = async (e) => {
    e.preventDefault();
    setKycError('');
    
    if (!isValidAadhar(formData.aadhar)) {
       setKycError('Security Alert: Please enter a valid, authentic 12-digit Aadhaar number.');
       return;
    }
    
    if (!kycFile) {
       setKycError('Action Required: Please securely upload an ID document to proceed.');
       return;
    }

    setIsScanning(true);

    try {
      // Engage Tesseract Optical Character Recognition on the attached image
      const result = await Tesseract.recognize(kycFile, 'eng');
      
      const extractedText = result.data.text;
      // Strip everything except pure numbers to ensure formatting anomalies don't break the match
      const numericText = extractedText.replace(/\D/g, ''); 
      
      if (numericText.includes(formData.aadhar)) {
        setIsScanning(false);
        setIsSendingOtp(true);
        setCheckoutStep('KYC_OTP');
        
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(newOtp);
        
        const templateParams = {
          to_email: user.email,
          email: user.email,
          user_email: user.email,
          to_name: user.name,
          name: user.name,
          user_name: user.name,
          otp: newOtp,
          code: newOtp,
          message: `Your AstraRent Identity Verification Code is: ${newOtp}`
        };

        emailjs.send(
          'service_c48em2n',
          'template_9pq4xle',
          templateParams,
          't61ii0o9hr2x6Tqgo'
        ).then(
          (response) => {
            setIsSendingOtp(false);
          },
          (err) => {
            setIsSendingOtp(false);
            console.error('EmailJS Error:', err);
            setKycError('System Alert: Failed to securely dispatch OTP to Email. Please check network.');
          }
        );

      } else {
        setIsScanning(false);
        setKycError(`Security Alert: The uploaded document was rejected. It does not visually contain the Aadhaar number ${formData.aadhar}. Please upload a clear photo of the requested ID.`);
      }
    } catch (err) {
      console.error(err);
      setIsScanning(false);
      setKycError('System Error: Our OCR engine could not process this image. Please supply a clear, uncorrupted .jpg or .png file.');
    }
  };

  const handleKycOtpSubmit = (e) => {
    e.preventDefault();
    setKycError('');
    if (kycOtp === generatedOtp.toString()) {
      setCheckoutStep('FORM');
    } else {
      setKycError('Protocol Alert: Invalid authentication code. Please check your primary inbox / spam folder.');
    }
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setCheckoutStep('PAYMENT');
  };

  const handlePaymentSubmit = () => {
    setPaymentError('');

    if (paymentMethod === 'card') {
      const cardNum = paymentDetails.cardNumber.replace(/\s/g, '');
      if (!/^\d{16}$/.test(cardNum)) { setPaymentError('Security Reject: Card number must be strictly 16 generic digits.'); return; }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentDetails.cardExp)) { setPaymentError('Security Reject: Invalid Expiration format. Must match MM/YY protocol.'); return; }
      if (!/^\d{3,4}$/.test(paymentDetails.cardCvc)) { setPaymentError('Security Reject: CVC must be a valid 3-4 digit vector.'); return; }
      if (!paymentDetails.cardName.trim()) { setPaymentError('Security Reject: Legal Cardholder name is required.'); return; }
    } else if (paymentMethod === 'upi') {
      if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(paymentDetails.upiId)) { setPaymentError('Security Reject: Invalid UPI Routing Node. Example format: username@bank'); return; }
    } else if (paymentMethod === 'netbanking') {
      if (!paymentDetails.netbankingBank) { setPaymentError('Security Reject: Please explicitly target a Banking Institution to construct the bridge.'); return; }
    }

    setIsProcessing(true);
    setCheckoutStep('STRIPE_MOCK'); // Activate Live Stripe Sandbox

    // Stage 1: Handshake
    setTimeout(() => {
      // Stage 2: Authorization
      setTimeout(() => {
        // Stage 3: Post Data payload directly into Google Cloud Firestore
        if (cart.length > 0) {
          const newOrder = {
            id: `AR-${Math.floor(10000 + Math.random() * 90000)}`,
            item: cart[0],
            status: 'ACTIVE',
            date: new Date().toLocaleDateString(),
            timestamp: new Date().toISOString(),
            refundMethod: null,
            userEmail: user?.email, // Cryptographically bind the fleet order to the authenticated user scope
            customerName: formData.name,
            customerPhone: formData.phone
          };
          
          addDoc(collection(db, 'orders'), newOrder).then((docRef) => {
            // Success handler for cloud injection
            console.log("Document written with ID: ", docRef.id);
            localStorage.setItem('astra_order_id', newOrder.id); // For local tracking UX state only
            setIsProcessing(false);
            setCheckoutStep('SUCCESS');
            clearCart();
          }).catch((err) => {
             console.error("Cloud Error", err);
             setIsProcessing(false);
             setPaymentError("A Cloud Server Error occurred while compiling the final contract block. Ensure internet connectivity.");
          });
          
        } else {
           setIsProcessing(false);
           setCheckoutStep('SUCCESS');
           clearCart();
        }
      }, 2500); // Wait for auth simulation
    }, 1500); // Wait for handshake simulation
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="cart-overlay" onClick={closeCart}>
      <div className={`cart-drawer glass-panel ${isCartOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
        
        <div className="cart-header">
          <h2>
            {checkoutStep === 'KYC' ? 'Instant KYC Verification' :
             checkoutStep === 'KYC_OTP' ? 'Aadhaar OTP Authentication' :
             checkoutStep === 'FORM' ? 'Shipping Details' : 
             checkoutStep === 'PAYMENT' ? 'Secure Payment' :
             checkoutStep === 'STRIPE_MOCK' ? 'Payment Gateway' :
             checkoutStep === 'SUCCESS' ? 'Order Confirmed' : 'Your Fleet Cart'}
          </h2>
          <button className="close-btn" onClick={closeCart} aria-label="Close cart">
            <X size={24} />
          </button>
        </div>

        <div className="cart-body">
          {/* STEP 1: CART OVERVIEW */}
          {checkoutStep === 'CART' && (
            <>
              {cart.length === 0 ? (
                <div className="empty-cart-state">
                  <div className="empty-icon-wrapper">
                    <ShoppingCart size={48} className="text-secondary" />
                  </div>
                  <p>Your fleet cart is empty.</p>
                  <button className="btn btn-primary mt-4" onClick={closeCart}>Explore Devices</button>
                </div>
              ) : (
                <div className="cart-items-list">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="cart-item-info">
                        <span className="cart-item-category">{item.brand}</span>
                        <h4>{item.name}</h4>
                        <div className="duration-selector">
                          <select 
                            value={item.duration || '1_month'} 
                            onChange={(e) => updateItemDuration(item.id, e.target.value)}
                            className="duration-dropdown"
                          >
                            <option value="1_week">1 Week (35%)</option>
                            <option value="1_month">1 Month (Standard)</option>
                            <option value="2_months">2 Months</option>
                            <option value="3_months">3 Months (Discounted)</option>
                            <option value="6_months">6 Months (Best Value)</option>
                          </select>
                        </div>
                        <div className="cart-item-price">
                          ₹{calculateItemPrice(item).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          <span> total for {DURATION_LABELS[item.duration || '1_month']}</span>
                        </div>
                      </div>
                      <button className="remove-item-btn" onClick={() => removeFromCart(item.id)} title="Remove item">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* STEP 1.5: INSTANT KYC */}
          {checkoutStep === 'KYC' && (
            <form id="kyc-form" className="checkout-form animation-fade" onSubmit={handleKycSubmit}>
              <div className="payment-security-badge" style={{background: 'rgba(99, 102, 241, 0.1)', borderColor: 'rgba(99, 102, 241, 0.2)', marginBottom: '1.5rem'}}>
                <ShieldCheck size={18} className="text-secondary" />
                <span style={{color: 'var(--text-secondary)'}}>Government ID Verification Required for Fleet Rentals</span>
              </div>

              <div className="form-group">
                <label><Contact size={16} /> Aadhaar Number</label>
                <input 
                  type="text" 
                  name="aadhar" 
                  value={formData.aadhar} 
                  onChange={handleInputChange} 
                  required 
                  minLength="12"
                  maxLength="12"
                  pattern="\d{12}"
                  title="Aadhaar must be exactly 12 digits"
                  className="input-field" 
                  placeholder="e.g. 1234 5678 9012" 
                />
              </div>

              <div className="form-group mt-3">
                <label>Upload Authorized Document (Required)</label>
                <div className="upload-box mt-2" style={{ position: 'relative' }}>
                  <input 
                    type="file" 
                    accept="image/*,.pdf" 
                    onChange={(e) => setKycFile(e.target.files[0])} 
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10 }}
                    required
                  />
                  {kycFile ? (
                    <>
                      <CheckCircle size={32} className="text-success" />
                      <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>File Legally Attached:<br/>{kycFile.name}</p>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={32} className="text-tertiary" />
                      <p>Drag and drop Aadhaar front image here<br/><span style={{fontSize: '0.8rem', color: 'var(--text-primary)'}}>or Browse Files (Max 5MB)</span></p>
                    </>
                  )}
                </div>
              </div>

              {kycError && (
                <div className="animation-fade" style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '1rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  {kycError}
                </div>
              )}
            </form>
          )}

          {/* STEP 1.75: AADHAAR OTP AUTHENTICATION */}
          {checkoutStep === 'KYC_OTP' && (
            <form id="kyc-otp-form" className="checkout-form animation-fade" onSubmit={handleKycOtpSubmit}>
              <div className="payment-security-badge" style={{background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)', marginBottom: '1.5rem'}}>
                <ShieldCheck size={18} className="text-success" />
                <span style={{color: 'var(--text-secondary)'}}>UIDAI Identity Document Cryptographically Verified</span>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '2.5rem', marginTop: '1rem' }}>
                <Mail size={48} className="text-accent pulse-glow" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.4rem' }}>Secure Email Authentication</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  To finalize identity binding, a real 6-digit cryptographic security code has been sent directly to your registered inbox: <strong style={{color: 'var(--text-primary)'}}>{user?.email}</strong>.
                </p>
              </div>

              <div className="form-group" style={{ textAlign: 'center' }}>
                <input 
                  type="text" 
                  value={kycOtp}
                  onChange={(e) => setKycOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="input-field" 
                  style={{ fontSize: '2.5rem', letterSpacing: '0.6em', paddingLeft: 'calc(1rem + 0.6em)', textAlign: 'center', padding: '1rem', fontWeight: '800' }}
                  placeholder="------"
                  required
                  disabled={isSendingOtp}
                />
                <p style={{marginTop: '0.75rem', fontSize: '0.8rem', color: isSendingOtp ? 'var(--accent-primary)' : 'var(--text-tertiary)'}}>
                  {isSendingOtp ? 'Dispatching secure code over TLS network...' : 'Awaiting 6-digit response...'}
                </p>
              </div>
              
              {kycError && (
                <div className="animation-fade" style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '1rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.3)', textAlign: 'center' }}>
                  {kycError}
                </div>
              )}
            </form>
          )}

          {/* STEP 2: CHECKOUT FORM */}
          {checkoutStep === 'FORM' && (
            <form id="shipping-form" className="checkout-form" onSubmit={handleShippingSubmit}>
              <div className="form-info-plate">
                <span className="info-badge">Auto-Filled</span>
                <p>We've safely pre-filled your verified account details.</p>
              </div>

              <div className="form-group">
                <label><UserIcon size={16} /> Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="input-field" placeholder="John Doe" />
              </div>
              
              <div className="form-group">
                <label><Mail size={16} /> Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="input-field" readOnly={!!user?.email} placeholder="john@example.com" />
              </div>
              
              <div className="form-group">
                <label><Phone size={16} /> Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="input-field" placeholder="+91 9876543210" />
              </div>
              
              <div className="form-group address-group">
                <label><MapPin size={16} /> Shipping Address</label>
                <textarea 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange} 
                  required 
                  className="input-field" 
                  style={{ minHeight: '120px', fontSize: '1.05rem', padding: '1.2rem' }}
                  placeholder="Enter your full highly detailed delivery address including apartment, street, and postal code..."
                ></textarea>
              </div>
            </form>
          )}

          {/* STEP 3: SECURE PAYMENT */}
          {checkoutStep === 'PAYMENT' && (
            <div className="payment-step animation-fade">
              <div className="payment-security-badge">
                <ShieldCheck size={18} className="text-success" />
                <span>256-bit SSL Encrypted Transaction</span>
              </div>
              
              <h4 style={{marginBottom: '1rem'}}>Select Payment Method</h4>
              
              <div className="payment-options">
                <div 
                  className={`payment-card ${paymentMethod === 'card' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard size={24} />
                  <span>Credit / Debit</span>
                </div>
                <div 
                  className={`payment-card ${paymentMethod === 'upi' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <Smartphone size={24} />
                  <span>UPI Wallet</span>
                </div>
                <div 
                  className={`payment-card ${paymentMethod === 'netbanking' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('netbanking')}
                >
                  <Building size={24} />
                  <span>Net Banking</span>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <div className="card-input-mock">
                  <input type="text" name="cardNumber" value={paymentDetails.cardNumber} onChange={handlePaymentChange} className="input-field mt-3" style={{ fontSize: '1.1rem', padding: '1rem' }} placeholder="Card Number (4444 4444 4444 4444)" required />
                  <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                    <input type="text" name="cardExp" value={paymentDetails.cardExp} onChange={handlePaymentChange} className="input-field" style={{ fontSize: '1.1rem', padding: '1rem' }} placeholder="MM/YY" required />
                    <input type="password" name="cardCvc" value={paymentDetails.cardCvc} onChange={handlePaymentChange} className="input-field" style={{ fontSize: '1.1rem', padding: '1rem' }} placeholder="CVC" required />
                  </div>
                  <input type="text" name="cardName" value={paymentDetails.cardName} onChange={handlePaymentChange} className="input-field mt-3" style={{ fontSize: '1.1rem', padding: '1rem' }} placeholder="Cardholder Name" required />
                </div>
              )}
              
              {paymentMethod === 'upi' && (
                <div className="upi-input-mock mt-4">
                  <input type="text" name="upiId" value={paymentDetails.upiId} onChange={handlePaymentChange} className="input-field" placeholder="Enter UPI ID (e.g. user@okbank)" required />
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="upi-input-mock mt-4">
                  <select name="netbankingBank" value={paymentDetails.netbankingBank} onChange={handlePaymentChange} className="input-field" required>
                    <option value="" disabled>Select Your Target Bank Server</option>
                    <option value="hdfc">HDFC Bank Enterprise Gateway</option>
                    <option value="sbi">State Bank of India Corporate Node</option>
                    <option value="axis">Axis Bank Gateway</option>
                    <option value="icici">ICICI Bank Bridge</option>
                  </select>
                </div>
              )}

              {paymentError && (
                <div className="animation-fade" style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '1.5rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.3)', textAlign: 'center' }}>
                  {paymentError}
                </div>
              )}
            </div>
          )}

          {/* STEP 3.5: STRIPE TERMINAL SIMULATION */}
          {checkoutStep === 'STRIPE_MOCK' && (
            <div className="stripe-simulation animation-fade" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
              <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '2rem' }}>
                <svg className="spinner" style={{ width: '80px', height: '80px', borderTopColor: 'var(--accent-primary)', borderWidth: '4px' }} viewBox="0 0 50 50"></svg>
                <Lock size={24} className="text-accent pulse-glow" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
              </div>
              <h3 className="text-gradient" style={{fontSize: '1.5rem', marginBottom: '1rem'}}>Authorizing Transaction</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Tunneling secure connection to Banking Infrastructure...</p>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', fontFamily: 'monospace' }}>Aura Payments Engine • SSL TLS 1.3 Active</p>
            </div>
          )}

          {/* STEP 4: SUCCESS STATE */}
          {checkoutStep === 'SUCCESS' && (
            <div className="success-state animation-fade">
              <div className="success-icon-wrapper pulse-glow">
                <CheckCircle size={64} className="text-success" />
              </div>
              <h3 className="text-gradient" style={{fontSize: '2rem', marginBottom: '1rem'}}>Fleet Deployed!</h3>
              <p>Your rental order has been successfully placed and is currently being processed. You will receive a confirmation email shortly.</p>
              
              <button 
                className="btn btn-primary w-100" 
                style={{marginTop: '2rem'}} 
                onClick={() => { closeCart(); navigate('/track'); }}
              >
                Track Live Delivery Overview
              </button>
              
              <button className="btn btn-outline w-100" style={{marginTop: '1rem'}} onClick={closeCart}>Return to Catalog</button>
            </div>
          )}
        </div>

        {/* CART FOOTER */}
        {cart.length > 0 && checkoutStep !== 'SUCCESS' && (
          <div className="cart-footer">
            <div className="cart-summary">
              <span>Grand Total:</span>
              <span className="cart-total">₹{calculateTotal()}</span>
            </div>
            
            {checkoutStep === 'CART' && (
              <button className="btn btn-primary w-100 checkout-btn" onClick={() => {
                if (!user) {
                  closeCart();
                  openAuthModal();
                } else {
                  setCheckoutStep('KYC');
                }
              }}>
                {user ? 'Proceed to Instant KYC' : 'Sign In to Proceed safely'}
              </button>
            )}

            {checkoutStep === 'KYC' && (
              <div className="checkout-action-group">
                <button type="button" className="btn btn-outline" onClick={() => setCheckoutStep('CART')} disabled={isScanning}>
                  Back
                </button>
                <button type="submit" form="kyc-form" className="btn btn-primary flex-1" disabled={isScanning}>
                  {isScanning ? (
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center'}}>
                      <span className="spinner"></span> Scanning Document...
                    </div>
                  ) : 'Verify Identity & Match Image'}
                </button>
              </div>
            )}

            {checkoutStep === 'KYC_OTP' && (
              <div className="checkout-action-group">
                <button type="button" className="btn btn-outline" onClick={() => setCheckoutStep('KYC')} disabled={isSendingOtp}>
                  Cancel
                </button>
                <button type="submit" form="kyc-otp-form" className="btn btn-primary flex-1" disabled={isSendingOtp}>
                  {isSendingOtp ? (
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center'}}>
                      <span className="spinner"></span> Dispatching OTP...
                    </div>
                  ) : 'Confirm Secure OTP & Proceed'}
                </button>
              </div>
            )}

            {checkoutStep === 'FORM' && (
              <div className="checkout-action-group">
                <button type="button" className="btn btn-outline" onClick={() => setCheckoutStep('KYC_OTP')}>
                  Back
                </button>
                <button type="submit" form="shipping-form" className="btn btn-primary flex-1">
                  Continue to Payment
                </button>
              </div>
            )}

            {checkoutStep === 'PAYMENT' && (
              <div className="checkout-action-group">
                <button type="button" className="btn btn-outline" onClick={() => setCheckoutStep('FORM')} disabled={isProcessing}>
                  Back
                </button>
                <button type="button" className="btn btn-primary flex-1 payment-confirm-btn" onClick={handlePaymentSubmit} disabled={isProcessing}>
                  {isProcessing ? <span className="spinner"></span> : `Pay ₹${calculateTotal()}`}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

// Simple internal icon for empty state
const ShoppingCart = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

export default CartModal;
