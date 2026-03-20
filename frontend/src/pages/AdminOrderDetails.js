import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import { fetchJson } from '../utils/apiClient';
import { getAdminHeaders } from '../utils/adminAuth';

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Ready for Dispatch', 'Shipped', 'Delivered', 'Cancelled'];

function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  const loadOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await fetchJson(`${API_BASE_URL}/admin/orders/${id}`, {
        headers: {
          ...getAdminHeaders()
        }
      });
      setOrder(data?.order || null);
    } catch (err) {
      setError(err.message || 'Failed to load order details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleStatusUpdate = async (nextStatus) => {
    try {
      setUpdating(true);
      await fetchJson(`${API_BASE_URL}/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminHeaders()
        },
        body: JSON.stringify({ orderStatus: nextStatus })
      });
      await loadOrder();
    } catch (err) {
      setError(err.message || 'Failed to update order status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p style={{ color: '#d9534f' }}>{error}</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0 }}>Order #{order.orderNumber}</h3>
        <button className="btn-login" style={{ padding: '8px 14px' }} onClick={() => navigate('/admin/orders')}>Back</button>
      </div>

      <p><strong>Customer:</strong> {order.customerName} ({order.customerEmail})</p>
      <p><strong>Phone:</strong> {order.customerPhone}</p>
      <p><strong>Shipping:</strong> {order.shippingAddress}</p>
      <p><strong>Total:</strong> ₹{order.totalAmount}</p>
      <p><strong>Current Status:</strong> {order.orderStatus}</p>

      <div style={{ margin: '14px 0 20px' }}>
        <label htmlFor="orderStatus"><strong>Update Status:</strong></label>
        <select
          id="orderStatus"
          value={order.orderStatus}
          onChange={(e) => handleStatusUpdate(e.target.value)}
          disabled={updating}
          style={{ marginLeft: '10px', padding: '8px 10px', borderRadius: '8px' }}
        >
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <h4>Items</h4>
      <div style={{ display: 'grid', gap: '8px' }}>
        {order.items?.map((item, idx) => (
          <div key={`${item.name}-${idx}`} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '10px' }}>
            <strong>{item.name}</strong> x {item.quantity} - ₹{item.price}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminOrderDetails;
