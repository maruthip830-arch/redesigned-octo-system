import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, query, where } from 'firebase/firestore';
import { User, Package, Clock, Settings, ShieldCheck, MapPin, Phone, Mail, Edit3, CheckCircle, XCircle } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelStep, setCancelStep] = useState(1);
  const [refundMethod, setRefundMethod] = useState('Original Payment Method');
  const [orders, setOrders] = useState([]);
  const [cancelTargetId, setCancelTargetId] = useState(null);
  const [cancelTargetDocId, setCancelTargetDocId] = useState(null);
  
  const [bankDetails, setBankDetails] = useState({ name: '', accNum: '', reAccNum: '', ifsc: '' });
  const [bankError, setBankError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!user?.email) return;

    const q = query(collection(db, 'orders'), where("userEmail", "==", user.email));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userOrders = [];
      snapshot.forEach(doc => userOrders.push({ ...doc.data(), docId: doc.id }));
      setOrders(userOrders.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
    });

    return () => unsubscribe();
  }, [user]);

  const handleBankChange = (e) => {
    setBankDetails({...bankDetails, [e.target.name]: e.target.value});
    setBankError('');
  };

  // Protect route
  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    // In a real app, this would hit a backend. Here we just update local state.
    const formData = new FormData(e.target);
    const updatedUser = {
      ...user,
      name: formData.get('name'),
      phone: formData.get('phone'),
      address: formData.get('address')
    };
    updateDoc(doc(db, 'users', user.uid), {
      name: formData.get('name'),
      phone: formData.get('phone'),
      address: formData.get('address')
    }).then(() => {
      alert('Profile synced to cloud successfully!');
    });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-block">
        <div className="container">
          <h1 className="text-gradient">Welcome back, {user.name.split(' ')[0]}</h1>
          <p>Manage your fleet rentals and account settings</p>
        </div>
      </div>

      <div className="container dashboard-main">
        <div className="dashboard-sidebar glass-panel">
          <div className="user-card">
            <div className="user-avatar">
              <User size={32} />
            </div>
            <div className="user-card-info">
              <h3>{user.name}</h3>
              <span>{user.email}</span>
              <div className="kyc-badge success">
                <ShieldCheck size={14} /> KYC Verified
              </div>
            </div>
          </div>

          <nav className="dashboard-nav">
            <button 
              className={`nav-item ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              <Package size={18} /> Active Rentals
            </button>
            <button 
              className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <Clock size={18} /> Order History
            </button>
            <button 
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={18} /> Account Settings
            </button>
          </nav>
        </div>

        <div className="dashboard-content">
          {activeTab === 'active' && (
            <div className="content-panel animation-fade">
              <h2>Active Fleet</h2>
              <div className="active-rentals-list">
                
                {orders.length === 0 && (
                  <div style={{textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-tertiary)'}}>
                    <Package size={48} style={{margin: '0 auto 1rem', opacity: 0.5}} />
                    <h3>No Active Fleet Hardware</h3>
                    <p style={{marginBottom: '1.5rem'}}>You do not have any currently provisioned devices.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/#fleet')}>Deploy Hardware</button>
                  </div>
                )}
                
                {orders.map(order => (
                  <React.Fragment key={order.id}>
                    {order.status === 'ACTIVE' && (
                      <div className="rental-card glass-panel" style={{marginBottom: '1.5rem'}}>
                        <div className="rental-status active">Active</div>
                        <div className="rental-card-body">
                          <img src={order.item?.image || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=300"} alt={order.item?.name || "MacBook Pro"} />
                          <div className="rental-info">
                            <h4>{order.item?.name || 'Apple MacBook Pro 16" (M3 Max)'}</h4>
                            <p>Order ID: #{order.id}</p>
                            <div className="rental-dates">
                              <span>Started: {order.date}</span>
                              <span>Ends: Auto-Renewal</span>
                            </div>
                          </div>
                          <div className="rental-actions">
                            <button className="btn btn-outline" style={{width: '100%'}} onClick={() => alert('An extension request has been sent to our corporate team. We will review it shortly.')}>Extend Rental</button>
                            <button className="btn btn-primary mt-2" style={{width: '100%'}} onClick={() => navigate(`/track?id=${order.id}`)}>Track Delivery</button>
                            <button className="btn btn-outline mt-2" style={{width: '100%', borderColor: 'rgba(239, 68, 68, 0.5)', color: '#ef4444'}} onClick={() => { setCancelTargetId(order.id); setCancelTargetDocId(order.docId); setRefundMethod('Original Payment Method'); setShowCancelModal(true); setCancelStep(1); }}>
                              Cancel & Refund
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {order.status === 'CANCELLED' && (
                      <div className="refund-tracker-card glass-panel animation-fade" style={{padding: '2.5rem', borderRadius: '16px', borderLeft: '4px solid #ef4444', marginBottom: '1.5rem'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                          <div>
                            <h3 style={{color: '#ef4444', marginBottom: '0.3rem', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Clock size={20}/> Refund Processing</h3>
                            <p style={{color: 'var(--text-secondary)'}}>Routing to <strong>{order.refundMethod}</strong></p>
                            <span style={{fontSize: '0.85rem', color: 'var(--text-tertiary)'}}>Order ID: #{order.id} - {order.item?.name}</span>
                          </div>
                          <div style={{textAlign: 'right'}}>
                            <div style={{fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-primary)'}}>₹{order.item?.price || '9,999'}</div>
                            <div style={{fontSize: '0.85rem', color: 'var(--text-tertiary)'}}>ETA: {order.refundMethod === 'AstraWallet' ? 'Instant Credit' : '3-5 Business Days'}</div>
                          </div>
                        </div>

                        <div style={{display: 'flex', justifyContent: 'space-between', position: 'relative', marginTop: '3.5rem', padding: '0 1rem'}}>
                          <div style={{position: 'absolute', top: '15px', left: '2rem', right: '2rem', height: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 0}}></div>
                          <div style={{position: 'absolute', top: '15px', left: '2rem', width: order.refundMethod === 'AstraWallet' ? '90%' : '50%', height: '2px', background: 'var(--accent-primary)', zIndex: 1, boxShadow: '0 0 15px rgba(99,102,241,0.5)', transition: 'width 1s ease'}}></div>
                          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, gap: '0.5rem'}}>
                            <div style={{width: '32px', height: '32px', borderRadius: '50%', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)'}}><CheckCircle size={16} /></div>
                            <span style={{fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)'}}>Initiated</span>
                          </div>
                          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, gap: '0.5rem', transform: 'translateX(-10px)'}}>
                            <div className="pulse-glow-light" style={{width: '32px', height: '32px', borderRadius: '50%', background: order.refundMethod === 'AstraWallet' ? 'var(--success)' : 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'}}>{order.refundMethod === 'AstraWallet' ? <CheckCircle size={16}/> : <Clock size={16} />}</div>
                            <span style={{fontSize: '0.85rem', fontWeight: 500, color: order.refundMethod === 'AstraWallet' ? 'var(--text-secondary)' : 'var(--accent-primary)'}}>Processing</span>
                          </div>
                          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, gap: '0.5rem'}}>
                            <div style={{width: '32px', height: '32px', borderRadius: '50%', background: order.refundMethod === 'AstraWallet' ? 'var(--success)' : 'var(--bg-secondary)', border: order.refundMethod === 'AstraWallet' ? 'none' : '2px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: order.refundMethod === 'AstraWallet' ? 'white' : 'var(--text-tertiary)'}}><CheckCircle size={16} /></div>
                            <span style={{fontSize: '0.85rem', color: order.refundMethod === 'AstraWallet' ? 'var(--success)' : 'var(--text-tertiary)'}}>Credited</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="content-panel animation-fade">
              <h2>Order History</h2>
              <div className="history-list">
                
                {orders.length > 0 ? (
                  orders.map(order => (
                    <div key={order.id} className="history-item glass-panel" style={{marginBottom: '1rem'}}>
                      <div className="history-icon" style={{background: order.status === 'CANCELLED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: order.status === 'CANCELLED' ? 'var(--danger)' : 'var(--success)'}}>
                        {order.status === 'CANCELLED' ? <XCircle size={24} /> : <CheckCircle size={24} />}
                      </div>
                      <div className="history-details">
                        <h4>{order.item?.name || 'Hardware Component'}</h4>
                        <p>Order ID: #{order.id}</p>
                        <span style={{fontSize: '0.85rem', color: 'var(--text-tertiary)'}}>
                          {order.status === 'CANCELLED' 
                            ? `Cancelled and refund processing to ${order.refundMethod}` 
                            : 'Currently Active and Provisioned'}
                        </span>
                      </div>
                      <div className="history-price" style={{textDecoration: order.status === 'CANCELLED' ? 'line-through' : 'none', color: order.status === 'CANCELLED' ? 'var(--text-tertiary)' : 'var(--text-primary)'}}>
                        ₹{order.item?.price || '9,999'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-tertiary)'}}>
                    <Clock size={48} style={{margin: '0 auto 1rem', opacity: 0.5}} />
                    <h3>No Past Rentals</h3>
                    <p>You haven't completed or returned any hardware yet.</p>
                  </div>
                )}
                
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="content-panel animation-fade">
              <h2>Account Settings</h2>
              <form className="settings-form" onSubmit={handleUpdateProfile}>
                <div className="form-group row">
                  <div className="half">
                    <label><User size={16} /> Full Name</label>
                    <input type="text" name="name" defaultValue={user.name} required className="input-field" />
                  </div>
                  <div className="half">
                    <label><Mail size={16} /> Email Address</label>
                    <input type="email" defaultValue={user.email} disabled className="input-field disabled" title="Email cannot be changed" />
                  </div>
                </div>
                
                <div className="form-group mt-4">
                  <label><Phone size={16} /> Phone Number</label>
                  <input type="tel" name="phone" defaultValue={user.phone} required className="input-field" />
                </div>

                <div className="form-group mt-4">
                  <label><MapPin size={16} /> Primary Shipping Address</label>
                  <textarea name="address" defaultValue={user.address} className="input-field" rows="4" placeholder="Enter your full dispatch address..."></textarea>
                </div>

                <button type="submit" className="btn btn-primary mt-4">
                  <Edit3 size={18} style={{marginRight: '0.5rem'}} /> Save Changes
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Cancellation & Refund Modal */}
      {showCancelModal && (
        <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="modal-content glass-panel animation-fade" onClick={e => e.stopPropagation()} style={{maxWidth: '500px'}}>
            
            {cancelStep === 1 && (
              <>
                <h3 style={{fontSize: '1.5rem', marginBottom: '1rem', color: '#ef4444'}}>Cancel Rental Agreement</h3>
                <p>Are you sure you want to cancel your order for <strong>Apple MacBook Pro 16"</strong>?</p>
                
                <div style={{background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', margin: '1.5rem 0', border: '1px solid rgba(255,255,255,0.05)'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', color: 'var(--text-secondary)'}}>
                    <span>Total Paid</span>
                    <span>₹9,999</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', color: 'var(--text-secondary)'}}>
                    <span>Cancellation Fee</span>
                    <span className="text-success">-₹0 (Within Grace Period)</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginTop: '0.5rem', fontWeight: '600', fontSize: '1.1rem'}}>
                    <span>Amount Subtotal</span>
                    <span className="text-gradient">₹9,999</span>
                  </div>
                </div>
                
                <p style={{fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: '2.5rem', lineHeight: '1.6'}}>
                  Your provisional KYC cryptographic token for this session will be securely destroyed from our servers upon proceeding.
                </p>
                
                <div style={{display: 'flex', gap: '1rem'}}>
                  <button 
                    className="btn btn-primary" 
                    style={{flex: 1, background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.5)', color: '#ef4444'}} 
                    onClick={() => setCancelStep(2)}
                  >
                    Proceed to Refund
                  </button>
                  <button className="btn btn-outline" style={{flex: 1}} onClick={() => setShowCancelModal(false)}>
                    Keep Order
                  </button>
                </div>
              </>
            )}

            {cancelStep === 2 && (
              <div className="animation-fade">
                <h3 style={{fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)'}}>Refund Destination</h3>
                <p style={{marginBottom: '1.5rem', color: 'var(--text-secondary)'}}>Please select where you would like the ₹9,999 to be deposited.</p>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem'}}>
                  <label style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem', border: '1px solid', borderRadius: '8px', cursor: 'pointer', background: refundMethod === 'Original Payment Method' ? 'rgba(99, 102, 241, 0.1)' : 'transparent', borderColor: refundMethod === 'Original Payment Method' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)', transition: 'all 0.2s'}}>
                    <input type="radio" name="refund" checked={refundMethod === 'Original Payment Method'} onChange={() => setRefundMethod('Original Payment Method')} style={{width: '20px', height: '20px', accentColor: 'var(--accent-primary)'}} />
                    <div>
                      <h4 style={{margin: '0 0 0.2rem 0', fontSize: '1.05rem'}}>Original Payment Method</h4>
                      <span style={{fontSize: '0.85rem', color: 'var(--text-tertiary)'}}>3-5 Business Days (Card used during Checkout)</span>
                    </div>
                  </label>

                  <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.2rem', border: '1px solid', borderRadius: '8px', cursor: 'pointer', background: refundMethod === 'Bank Transfer (NEFT)' ? 'rgba(99, 102, 241, 0.1)' : 'transparent', borderColor: refundMethod === 'Bank Transfer (NEFT)' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)', transition: 'all 0.2s'}}>
                    <label style={{display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer'}}>
                      <input type="radio" name="refund" checked={refundMethod === 'Bank Transfer (NEFT)'} onChange={() => { setRefundMethod('Bank Transfer (NEFT)'); setBankError(''); }} style={{width: '20px', height: '20px', accentColor: 'var(--accent-primary)'}} />
                      <div>
                        <h4 style={{margin: '0 0 0.2rem 0', fontSize: '1.05rem'}}>Bank Transfer (NEFT/IMPS)</h4>
                        <span style={{fontSize: '0.85rem', color: 'var(--text-tertiary)'}}>1-2 Business Days</span>
                      </div>
                    </label>

                    {refundMethod === 'Bank Transfer (NEFT)' && (
                      <div className="animation-fade" style={{paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '0.8rem'}}>
                        <input type="text" name="name" placeholder="Account Holder Name" className="input-field" value={bankDetails.name} onChange={handleBankChange} style={{padding: '0.6rem'}}/>
                        <input type="number" name="accNum" placeholder="Account Number (9-18 digits)" className="input-field" value={bankDetails.accNum} onChange={handleBankChange} style={{padding: '0.6rem'}}/>
                        <input type="password" name="reAccNum" placeholder="Confirm Account Number" className="input-field" value={bankDetails.reAccNum} onChange={handleBankChange} style={{padding: '0.6rem'}}/>
                        <input type="text" name="ifsc" placeholder="IFSC Code (e.g., SBIN0001234)" className="input-field" value={bankDetails.ifsc} onChange={handleBankChange} style={{padding: '0.6rem', textTransform: 'uppercase'}} maxLength={11} />
                        
                        {bankError && <div style={{color: 'var(--danger)', fontSize: '0.85rem', marginTop: '0.2rem'}}>{bankError}</div>}
                      </div>
                    )}
                  </div>
                  
                  <label style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem', border: '1px solid', borderRadius: '8px', cursor: 'pointer', background: refundMethod === 'AstraWallet' ? 'rgba(99, 102, 241, 0.1)' : 'transparent', borderColor: refundMethod === 'AstraWallet' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)', transition: 'all 0.2s'}}>
                    <input type="radio" name="refund" checked={refundMethod === 'AstraWallet'} onChange={() => setRefundMethod('AstraWallet')} style={{width: '20px', height: '20px', accentColor: 'var(--accent-primary)'}} />
                    <div>
                      <h4 style={{margin: '0 0 0.2rem 0', fontSize: '1.05rem'}}>AstraRent Wallet</h4>
                      <span style={{fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600}}>Instant Processing Credit</span>
                    </div>
                  </label>
                </div>

                <div style={{display: 'flex', gap: '1rem'}}>
                  <button className="btn btn-outline" style={{padding: '0 1rem'}} onClick={() => setCancelStep(1)}>Back</button>
                  <button className="btn btn-primary" style={{flex: 1, opacity: isVerifying ? 0.7 : 1}} disabled={isVerifying} onClick={async () => {
                    if (refundMethod === 'Bank Transfer (NEFT)') {
                      if (!bankDetails.name.trim()) { setBankError("Account holder name is required."); return; }
                      if (!/^\d{9,18}$/.test(bankDetails.accNum)) { setBankError("Account number must be 9-18 digits."); return; }
                      if (bankDetails.accNum !== bankDetails.reAccNum) { setBankError("Account numbers do not match."); return; }
                      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(bankDetails.ifsc.toUpperCase())) { setBankError("Invalid IFSC Format. (Example format: SBIN0000001)"); return; }

                      // Check for strictly repeating or sequential fake digits (123456789, 111111111)
                      if (/^(\d)\1+$/.test(bankDetails.accNum) || bankDetails.accNum.includes('123456789') || bankDetails.accNum.includes('987654321') || bankDetails.accNum.includes('012345678')) {
                         setBankError("Verification Rejected: Account flagged as sequentially spoofed. Enter real digits.");
                         return;
                      }

                      setIsVerifying(true);
                      setBankError('');

                      try {
                        const res = await fetch(`https://ifsc.razorpay.com/${bankDetails.ifsc.toUpperCase()}`);
                        if (!res.ok) {
                           setBankError("Banking API Verification Failed. The IFSC code is fake or corresponds to a non-existent branch.");
                           setIsVerifying(false);
                           return;
                        }
                        
                        // Simulate secondary penny-drop network request for realism
                        await new Promise((resolve) => setTimeout(resolve, 1000));
                        
                      } catch (err) {
                        setBankError("Network error reaching the banking authorization node.");
                        setIsVerifying(false);
                        return;
                      }
                      
                      setIsVerifying(false);
                    }
                    if (cancelTargetDocId) {
                      updateDoc(doc(db, 'orders', cancelTargetDocId), {
                        status: 'CANCELLED',
                        refundMethod
                      });
                    }
                    setShowCancelModal(false);
                  }}>
                    {isVerifying ? 'Authenticating Bank...' : 'Confirm & Initiate Refund'}
                  </button>
                </div>
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
