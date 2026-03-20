import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { clearAdminAuth, getAdminAuth } from '../utils/adminAuth';

function AdminLayout() {
  const navigate = useNavigate();
  const admin = getAdminAuth()?.admin;

  const handleLogout = () => {
    clearAdminAuth();
    navigate('/admin/login');
  };

  return (
    <section className="section">
      <div className="section-inner" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="section-title" style={{ margin: 0 }}>Admin Panel</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#666' }}>{admin?.name || 'Admin'}</span>
            <button className="btn-login" style={{ padding: '8px 14px' }} onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '22px' }}>
          <Link to="/admin/dashboard" className="btn-cta">Dashboard</Link>
          <Link to="/admin/products" className="btn-cta">Products</Link>
          <Link to="/admin/products/new" className="btn-cta">Add Product</Link>
          <Link to="/admin/orders" className="btn-cta">Orders</Link>
        </div>

        <Outlet />
      </div>
    </section>
  );
}

export default AdminLayout;
