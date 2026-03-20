import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import { fetchJson } from '../utils/apiClient';
import { getAdminHeaders } from '../utils/adminAuth';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await fetchJson(`${API_BASE_URL}/admin/orders`, {
          headers: {
            ...getAdminHeaders()
          }
        });
        setOrders(data?.orders || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <div>
      <h3>Orders Management</h3>

      {loading && <p>Loading orders...</p>}
      {error && <p style={{ color: '#d9534f' }}>{error}</p>}
      {!loading && !error && orders.length === 0 && <p>No orders found.</p>}

      {!loading && !error && orders.length > 0 && (
        <div style={{ display: 'grid', gap: '10px' }}>
          {orders.map((order) => (
            <div key={order._id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', gap: '12px', alignItems: 'center' }}>
                <div>
                  <strong>#{order.orderNumber}</strong>
                  <p style={{ margin: '4px 0 0', color: '#666' }}>{order.customerName}</p>
                </div>
                <div style={{ color: '#666' }}>{order.customerEmail}</div>
                <div>₹{order.totalAmount}</div>
                <div>{order.orderStatus}</div>
                <Link to={`/admin/orders/${order._id}`} style={{ color: '#FF2A0A', fontWeight: 600 }}>View</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
