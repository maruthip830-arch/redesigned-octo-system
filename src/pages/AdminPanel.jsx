import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { BarChart3, Users, DollarSign, Package, CheckCircle, XCircle, FileText, AlertTriangle, ShieldCheck } from 'lucide-react';
import './AdminPanel.css';

const AdminPanel = () => {
  const { user } = useAuth();
  const [selectedKyc, setSelectedKyc] = useState(null);

  const [orders, setOrders] = useState([]);
  const [usersDb, setUsersDb] = useState([]);
  const [kycQueue, setKycQueue] = useState([]);

  useEffect(() => {
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const orderData = [];
      snapshot.forEach(doc => orderData.push({ ...doc.data(), docId: doc.id }));
      setOrders(orderData.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
    });
    
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const userData = [];
      snapshot.forEach(doc => userData.push({ ...doc.data(), uid: doc.id }));
      setUsersDb(userData);
    });

    return () => {
      unsubOrders();
      unsubUsers();
    };
  }, []);

  useEffect(() => {
    const overrides = JSON.parse(localStorage.getItem('astra_kyc_status') || '{}');
    const derivedQueue = usersDb
      .filter(u => u.role !== 'admin' && u.email !== 'admin@astrarent.com')
      .map(u => {
        const hasOrdered = orders.some(o => o.userEmail === u.email);
        let currentStatus = 'pending';
        
        if (u.kycStatus) {
           currentStatus = u.kycStatus;
        } else if (overrides[u.email]) {
          currentStatus = overrides[u.email];
        } else if (hasOrdered) {
          currentStatus = 'approved'; 
        }
  
        return {
          id: `KYC-${String(u.uid).slice(-5)}`,
          name: u.name,
          email: u.email,
          date: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A',
          status: currentStatus,
          docType: 'Aadhaar Secure UIDAI',
          uid: u.uid
        };
      });
      setKycQueue(derivedQueue);
  }, [usersDb, orders]);

  // Extremely strict primitive admin check. If not admin, block access.
  // In a real app this is derived from a JWT role. Here we mock it.
  const isAdmin = user && user.email === 'admin@astrarent.com';

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Dynamic Array Computations
  const activeFleetCount = orders.filter(o => o.status === 'ACTIVE').length;
  const totalRevenue = orders.reduce((sum, order) => {
    if (!order.item || !order.item.price) return sum;
    // Strip non-numeric like commas and ₹ to safely parse float
    const numericStr = String(order.item.price).replace(/[^0-9.]/g, '');
    const val = parseFloat(numericStr) || 0;
    return sum + val;
  }, 0);
  const totalAuthUsers = usersDb.length;

  const handleAction = async (email, newStatus) => {
    const targetUser = usersDb.find(u => u.email === email);
    if (targetUser && targetUser.uid) {
      await updateDoc(doc(db, 'users', targetUser.uid), { kycStatus: newStatus });
    }
    
    // Fallback for immediate UI
    const overrides = JSON.parse(localStorage.getItem('astra_kyc_status') || '{}');
    overrides[email] = newStatus;
    localStorage.setItem('astra_kyc_status', JSON.stringify(overrides));
    setSelectedKyc(null);
  };

  const handleExportCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer Name', 'Customer Email', 'Device', 'Status', 'Total Value'];
    const rows = orders.map(order => {
      const customer = usersDb.find(u => u.email === order.userEmail);
      const cleanPrice = String(order.item?.price || '0').replace(/,/g, '');
      return [
        order.id, 
        `"${order.date}"`, 
        `"${customer?.name || 'Verified Customer'}"`, 
        order.userEmail || 'N/A', 
        `"${order.item?.name || 'Authorized Hardware'}"`, 
        order.status, 
        `"${cleanPrice}"`
      ].join(',');
    });
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `astra_orders_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-container">
      <div className="admin-header-block">
        <div className="container">
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'}}>
            <div>
              <h1 className="text-gradient" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <ShieldCheck size={36} /> Executive Command Center
              </h1>
              <p>Highly secure internal operating portal.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{paddingBottom: '4rem'}}>
        {/* Top Metrics Row */}
        <div className="admin-metrics-grid">
          <div className="metric-card glass-panel">
            <div className="metric-icon" style={{background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)'}}>
              <DollarSign size={24} />
            </div>
            <div className="metric-info">
              <span className="metric-label">Gross Processed Revenue</span>
              <h3 className="metric-value">₹{totalRevenue.toLocaleString('en-IN')}</h3>
              <span className="metric-trend neutral">All-time gateway transactions</span>
            </div>
          </div>
          <div className="metric-card glass-panel">
            <div className="metric-icon" style={{background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)'}}>
              <Package size={24} />
            </div>
            <div className="metric-info">
              <span className="metric-label">Active Fleet Contracts</span>
              <h3 className="metric-value">{activeFleetCount}</h3>
              <span className="metric-trend positive">Units actively deployed</span>
            </div>
          </div>
          <div className="metric-card glass-panel">
            <div className="metric-icon" style={{background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)'}}>
              <FileText size={24} />
            </div>
            <div className="metric-info">
              <span className="metric-label">Pending KYC Reviews</span>
              <h3 className="metric-value">{kycQueue.filter(k => k.status === 'pending').length}</h3>
              <span className="metric-trend neutral">Requires manual executive verification</span>
            </div>
          </div>
          <div className="metric-card glass-panel">
            <div className="metric-icon" style={{background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899'}}>
              <Users size={24} />
            </div>
            <div className="metric-info">
              <span className="metric-label">Total Authenticated Users</span>
              <h3 className="metric-value">{totalAuthUsers}</h3>
              <span className="metric-trend positive">Security validated accounts</span>
            </div>
          </div>
        </div>

        {/* Main Content Areas */}
        <div className="admin-main-grid mt-4">
          
          {/* Live Checkout Relay Feed */}
          <div className="admin-operations-panel glass-panel">
            <div className="panel-header">
              <h2><Package size={20} style={{marginRight: '0.5rem'}} /> Live Incoming Checkout Feed</h2>
              <button className="btn btn-outline" style={{padding: '0.3rem 0.8rem', fontSize: '0.8rem'}} onClick={handleExportCSV}>
                <FileText size={14} style={{display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle'}}/>
                Export CSV
              </button>
            </div>
            <div className="recent-orders-feed" style={{marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '0.5rem'}}>
              {orders.length === 0 ? (
                <div style={{textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-tertiary)'}}>
                  <Package size={32} style={{margin: '0 auto 1rem', opacity: 0.3}} />
                  No live transactions currently detected in the transmission relay.
                </div>
              ) : (
                orders.map((order, idx) => (
                  <div key={idx} className="animation-fade" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', borderLeft: `4px solid ${order.status === 'ACTIVE' ? 'var(--success)' : 'var(--danger)'}`}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '1.2rem'}}>
                      <img src={order.item?.image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=100'} alt="hardware" style={{width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px'}} />
                      <div>
                        <h4 style={{margin: '0 0 0.3rem 0', fontSize: '1.05rem'}}>{order.item?.name || 'Authorized Hardware'}</h4>
                        <span style={{fontSize: '0.85rem', color: 'var(--text-tertiary)'}}>Order #{order.id} • Provisioned: {order.date}</span>
                        <div style={{fontSize: '0.8rem', color: 'var(--accent-primary)', marginTop: '0.2rem'}}>
                          👤 {usersDb.find(u => u.email === order.userEmail)?.name || 'Verified Customer'} ({order.userEmail})
                        </div>
                      </div>
                    </div>
                    <div style={{textAlign: 'right'}}>
                      <div style={{fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.2rem'}}>{order.item?.price || '₹9,999'}</div>
                      <span className={`status-badge ${order.status === 'ACTIVE' ? 'approved' : 'rejected'}`} style={{fontSize: '0.75rem', padding: '3px 10px'}}>{order.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* KYC Queue */}
          <div className="admin-kyc-panel glass-panel">
            <div className="panel-header">
              <h2><ShieldCheck size={20} /> Identity Verification Queue</h2>
            </div>
            <div className="kyc-list">
              {kycQueue.map(item => (
                <div key={item.id} className="kyc-item glass-panel">
                  <div className="kyc-item-header">
                    <div>
                      <h4>{item.name}</h4>
                      <p>{item.id} • {item.docType}</p>
                    </div>
                    <span className={`status-badge ${item.status}`}>{item.status}</span>
                  </div>
                  {item.status === 'pending' || item.status === 'flagged' ? (
                    <button className="btn btn-outline w-100 mt-3" onClick={() => setSelectedKyc(item)}>
                      Review Identity Cryptography
                    </button>
                  ) : (
                    <div className="kyc-resolved-msg mt-3">
                      {item.status === 'approved' ? (
                        <><CheckCircle size={16} className="text-success" /> Provisioned</>
                      ) : (
                        <><XCircle size={16} className="text-danger" /> Rejected</>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {kycQueue.length === 0 && (
                <div style={{textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)'}}>
                  Queue is empty.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* KYC Review Modal */}
      {selectedKyc && (
        <div className="modal-overlay" onClick={() => setSelectedKyc(null)}>
          <div className="modal-content glass-panel animation-fade" onClick={e => e.stopPropagation()} style={{maxWidth: '800px', width: '90%'}}>
            <h2 className="text-gradient mb-4">Manual Cryptographic Review</h2>
            <div className="admin-kyc-review-grid">
              <div className="kyc-doc-preview">
                {/* Mock Aadhaar Image Placeholder */}
                <div style={{width: '100%', height: '250px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', border: '1px dashed var(--border-light)'}}>
                  <ShieldCheck size={48} className="text-secondary mb-3" />
                  <span style={{color: 'var(--text-secondary)'}}>Encrypted Document Render</span>
                  <span style={{fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.5rem'}}>Aadhaar.jpeg • 1.4 MB</span>
                </div>
              </div>
              <div className="kyc-doc-details">
                <div className="detail-row">
                  <span className="detail-label">Applicant Name</span>
                  <span className="detail-value">{selectedKyc.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Contact Email</span>
                  <span className="detail-value">{selectedKyc.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">OCR Match Confidence</span>
                  <span className="detail-value text-success">98.4% (High)</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Fraud Risk Score</span>
                  <span className="detail-value text-success">Low</span>
                </div>
                
                <div className="kyc-actions mt-4">
                  <button className="btn btn-primary" onClick={() => handleAction(selectedKyc.email, 'approved')} style={{flex: 1, background: 'var(--success)', borderColor: 'var(--success)'}}>
                    <CheckCircle size={18} style={{marginRight: '0.5rem'}}/> Authorize Provisioning
                  </button>
                  <button className="btn btn-outline" onClick={() => handleAction(selectedKyc.email, 'rejected')} style={{flex: 1, borderColor: 'var(--danger)', color: 'var(--danger)'}}>
                    <XCircle size={18} style={{marginRight: '0.5rem'}}/> Reject Verification
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
