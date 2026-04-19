import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User, Phone, AlertCircle, KeyRound, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import './AuthModal.css';

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, login, signup } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [authStep, setAuthStep] = useState('form'); // 'form' | 'otp' | 'reset'
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  useEffect(() => {
    setError('');
    setAuthStep('form');
    setOtp('');
    setGeneratedOtp('');
    setIsSending(false);
  }, [isLoginMode, isForgotMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); 
  };
  
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isForgotMode) {
      setIsSending(true);
      setError('');
      
      const registeredUsers = JSON.parse(localStorage.getItem('astra_users') || '[]');
      if (!registeredUsers.some(u => u.email === formData.email)) {
        setIsSending(false);
        setError('No account found with that email address.');
        return;
      }
      
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(newOtp);
      
      const templateParams = {
        to_email: formData.email,
        email: formData.email,
        user_email: formData.email,
        to_name: 'AstraRent User',
        name: 'AstraRent User',
        user_name: formData.email.split('@')[0],
        otp: newOtp,
        code: newOtp,
        message: `Your AstraRent Password Reset Code is: ${newOtp}`
      };

      emailjs.send('service_c48em2n', 'template_9pq4xle', templateParams, 't61ii0o9hr2x6Tqgo')
        .then(() => {
          setIsSending(false);
          setAuthStep('otp');
        })
        .catch((err) => {
          setIsSending(false);
          setError('Failed to send reset email. Please try again.');
        });
    } else if (isLoginMode) {
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        setError(result.error);
      } else {
        setFormData({ name: '', email: '', phone: '', password: '' });
        setError('');
      }
    } else {
      setIsSending(true);
      setError('');
      
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(newOtp);
      
      const templateParams = {
        to_email: formData.email,
        email: formData.email,
        user_email: formData.email,
        to_name: formData.name,
        name: formData.name,
        user_name: formData.name,
        otp: newOtp,
        code: newOtp,
        message: `Your AstraRent Verification Code is: ${newOtp}`
      };

      emailjs.send('service_c48em2n', 'template_9pq4xle', templateParams, 't61ii0o9hr2x6Tqgo')
        .then(() => {
          setIsSending(false);
          setAuthStep('otp');
        })
        .catch((err) => {
          setIsSending(false);
          console.error('EmailJS Error:', err);
          setError('Failed to send verification email. Please check your network or try again later.');
        });
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    
    if (otp === generatedOtp) {
      if (isForgotMode) {
        setAuthStep('reset');
      } else {
        const result = await signup(formData.name, formData.email, formData.phone, formData.password);
        if (!result.success) {
          setError(result.error);
          setAuthStep('form'); 
        } else {
          setFormData({ name: '', email: '', phone: '', password: '' });
          setOtp('');
          setGeneratedOtp('');
          setAuthStep('form');
          setError('');
        }
      }
    } else {
      setError('Invalid verification code. Please check the email we sent you.');
    }
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    const registeredUsers = JSON.parse(localStorage.getItem('astra_users') || '[]');
    const targetUserIdx = registeredUsers.findIndex(u => u.email === formData.email);
    if (targetUserIdx !== -1) {
      registeredUsers[targetUserIdx].password = formData.password;
      localStorage.setItem('astra_users', JSON.stringify(registeredUsers));
      setError('');
      setOtp('');
      setGeneratedOtp('');
      setIsForgotMode(false);
      setIsLoginMode(true);
      setAuthStep('form');
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setIsForgotMode(false);
    setFormData({ name: '', email: '', phone: '', password: '' });
    setAuthStep('form');
    setOtp('');
    setGeneratedOtp('');
    setError('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <button className="close-btn" onClick={closeAuthModal} aria-label="Close modal" disabled={isSending}>
          <X size={24} />
        </button>

        <div className="modal-header">
          <h2 className="modal-title">
            {authStep === 'otp' ? 'Verification' : authStep === 'reset' ? 'New Password' : (isForgotMode ? 'Reset Password' : (isLoginMode ? 'Welcome Back' : 'Create an Account'))}
          </h2>
          <p className="modal-subtitle">
            {authStep === 'otp' 
              ? `We sent a code to ${formData.email}` 
              : authStep === 'reset' ? 'Enter a highly secure new password' : (isForgotMode ? 'We will send a 6-digit OTP to your registered email' : (isLoginMode ? 'Enter your credentials to access your account' : 'Join AstraRent to start renting premium hardware'))}
          </p>
        </div>

        {authStep === 'form' ? (
          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="auth-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {!isLoginMode && !isForgotMode && (
              <>
                <div className="input-group">
                  <label htmlFor="name">Full Name</label>
                  <div className="input-wrapper">
                    <User size={18} className="input-icon" />
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      placeholder="John Doe" 
                      value={formData.name}
                      onChange={handleChange}
                      required={!isLoginMode}
                      disabled={isSending}
                    />
                  </div>
                </div>
                
                <div className="input-group">
                  <label htmlFor="phone">Phone Number</label>
                  <div className="input-wrapper">
                    <Phone size={18} className="input-icon" />
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      placeholder="+91 98765 43210" 
                      value={formData.phone}
                      onChange={handleChange}
                      required={!isLoginMode}
                      disabled={isSending}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="you@example.com" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSending}
                />
              </div>
            </div>

            {!isForgotMode && (
              <div className="input-group" style={{ marginBottom: isLoginMode ? '0.5rem' : '1.5rem' }}>
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    placeholder="••••••••" 
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isSending}
                  />
                </div>
              </div>
            )}

            {isLoginMode && !isForgotMode && (
              <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                <button type="button" onClick={() => {setIsForgotMode(true); setIsLoginMode(false);}} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}>
                  Forgot Password?
                </button>
              </div>
            )}

            <button type="submit" className="btn btn-primary submit-btn" disabled={isSending}>
              {isSending ? (
                <><Loader2 size={18} className="spin-icon" /> Sending OTP...</>
              ) : (
                isForgotMode ? 'Send Reset OTP' : (isLoginMode ? 'Sign In' : 'Continue')
              )}
            </button>
          </form>
        ) : authStep === 'reset' ? (
          <form onSubmit={handleResetSubmit} className="auth-form animation-fade">
             {error && (
              <div className="auth-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            <div className="input-group">
              <label htmlFor="password">New Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <p className="otp-hint" style={{marginTop: '0.5rem'}}>Enter your desired new secure password.</p>
            </div>
            <button type="submit" className="btn btn-primary submit-btn">Save New Password</button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="auth-form animation-fade">
             {error && (
              <div className="auth-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            
            <div className="input-group">
              <label htmlFor="otp">Enter 6-digit Code</label>
              <div className="input-wrapper otp-wrapper">
                <KeyRound size={18} className="input-icon" />
                <input 
                  type="text" 
                  id="otp" 
                  name="otp" 
                  maxLength={6}
                  placeholder="123456" 
                  value={otp}
                  onChange={handleOtpChange}
                  required
                />
              </div>
              <p className="otp-hint">Please check your email inbox (and spam folder) for the verification code.</p>
            </div>
            
            <button type="submit" className="btn btn-primary submit-btn">
              Verify & Sign Up
            </button>
            <button type="button" className="btn btn-outline submit-btn" onClick={() => setAuthStep('form')} style={{marginTop: '0.5rem'}}>
              Back
            </button>
          </form>
        )}

        {authStep === 'form' && (
          <div className="modal-footer">
            <p>
              {isLoginMode || isForgotMode ? "Don't have an account? " : "Already have an account? "}
              <button type="button" className="text-btn text-gradient" onClick={toggleMode} disabled={isSending}>
                {isLoginMode || isForgotMode ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
