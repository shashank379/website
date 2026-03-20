import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div>
      <h3 style={{ marginBottom: '12px' }}>Dashboard</h3>
      <p style={{ color: '#666', marginBottom: '16px' }}>Manage products and orders.</p>

      <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <Link to="/admin/products" className="btn-cta" style={{ textAlign: 'center' }}>Manage Products</Link>
        <Link to="/admin/products/new" className="btn-cta" style={{ textAlign: 'center' }}>Create Product</Link>
        <Link to="/admin/orders" className="btn-cta" style={{ textAlign: 'center' }}>Manage Orders</Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
