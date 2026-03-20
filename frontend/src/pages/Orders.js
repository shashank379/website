import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

    const normalizeStatus = (status) => {
      const map = {
        PENDING: 'Pending',
        CONFIRMED: 'Confirmed',
        PROCESSING: 'Ready for Dispatch',
        SHIPPED: 'Shipped',
        DELIVERED: 'Delivered',
        CANCELLED: 'Cancelled'
      };
      return map[status] || status || 'Pending';
    };

  const fetchOrders = useCallback(async (email) => {
    try {
      console.log('Fetching orders for:', email);
      console.log('API URL:', `${API_BASE_URL}/orders/user/${encodeURIComponent(email)}`);
      
      const response = await fetch(`${API_BASE_URL}/orders/user/${encodeURIComponent(email)}`, {
        cache: 'no-store'
      });
      const data = await response.json();
      
      console.log('Orders response:', data);

      if (data.success) {
        console.log('Orders received:', data.orders);
        console.log('First order items:', data.orders[0]?.items);
        const normalizedOrders = (data.orders || []).map((order) => ({
          ...order,
          orderStatus: normalizeStatus(order.orderStatus)
        }));
        setOrders(normalizedOrders);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Connection error. Please try again later.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const user = localStorage.getItem('user');
    const userEmail = localStorage.getItem('userEmail');
    
    if (!user || !userEmail) {
      navigate('/login');
      return;
    }

    fetchOrders(userEmail);
  }, [fetchOrders, navigate]);

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    const colors = {
      pending: '#FFA500',
      confirmed: '#4CAF50',
      processing: '#2196F3',
      shipped: '#9C27B0',
      delivered: '#4CAF50',
      cancelled: '#F44336'
    };
    return colors[statusLower] || '#666';
  };

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase() || '';
    const icons = {
      pending: '⏳',
      confirmed: '✓',
      processing: '⚙️',
      shipped: '🚚',
      delivered: '✅',
      cancelled: '❌'
    };
    return icons[statusLower] || '📦';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <h1>📦 My Orders</h1>
          <p>Track and manage your orders</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {orders.length === 0 ? (
          <div className="no-orders">
            <div className="empty-icon">🛒</div>
            <h2>No orders yet</h2>
            <p>Looks like you haven't placed any orders yet.</p>
            <Link to="/products" className="shop-now-btn">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div 
                key={order._id} 
                className={`order-card ${selectedOrder === order._id ? 'expanded' : ''}`}
                onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
              >
                <div className="order-summary">
                  <div className="order-info">
                    <div className="order-number">
                      <span className="label">Order</span>
                      <span className="value">#{order.orderNumber}</span>
                    </div>
                    <div className="order-date">
                      <span className="label">Placed on</span>
                      <span className="value">{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="order-items-count">
                      <span className="label">Items</span>
                      <span className="value">{order.items?.length || 0} item(s)</span>
                    </div>
                  </div>
                  
                  <div className="order-status-price">
                    <div 
                      className="order-status"
                      style={{ backgroundColor: `${getStatusColor(order.orderStatus)}20`, color: getStatusColor(order.orderStatus) }}
                    >
                      {getStatusIcon(order.orderStatus)} {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </div>
                    <div className="order-total">₹{order.totalAmount}</div>
                  </div>
                </div>

                {selectedOrder === order._id && (
                  <div className="order-details">
                    <div className="details-section">
                      <h3>🛍️ Items Ordered</h3>
                      <div className="items-list">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, index) => (
                            <div key={index} className="order-item">
                              <span className="item-name">{item.name}</span>
                              <span className="item-qty">x{item.quantity}</span>
                              <span className="item-price">₹{item.price}</span>
                            </div>
                          ))
                        ) : (
                          <p>No items found in this order</p>
                        )}
                      </div>
                    </div>

                    <div className="details-section">
                      <h3>📍 Delivery Address</h3>
                      <div className="address-info">
                        <p>{order.shippingAddress}</p>
                      </div>
                    </div>

                    <div className="details-section">
                      <h3>💳 Payment Details</h3>
                      <div className="payment-info">
                        <div className="payment-row">
                          <span>Method:</span>
                          <span className="payment-method">{order.paymentMethod.toUpperCase()}</span>
                        </div>
                        <div className="payment-row">
                          <span>Status:</span>
                          <span className={`payment-status ${order.paymentStatus?.toLowerCase()}`}>
                            {order.paymentStatus?.toUpperCase() === 'PAID' ? '✓ Paid' : order.paymentStatus?.toUpperCase() === 'PENDING' ? '⏳ Pending' : '❌ Failed'}
                          </span>
                        </div>
                        {order.paymentId && (
                          <div className="payment-row">
                            <span>Payment ID:</span>
                            <span className="payment-id">{order.paymentId}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="order-timeline">
                      <h3>📋 Order Timeline</h3>
                      <div className="timeline">
                        <div className={`timeline-step ${['Confirmed', 'Ready for Dispatch', 'Shipped', 'Delivered'].includes(order.orderStatus) ? 'completed' : ''}`}>
                          <div className="step-icon">✓</div>
                          <span>Order Confirmed</span>
                        </div>
                        <div className={`timeline-step ${['Ready for Dispatch', 'Shipped', 'Delivered'].includes(order.orderStatus) ? 'completed' : ''}`}>
                          <div className="step-icon">⚙️</div>
                          <span>Ready for Dispatch</span>
                        </div>
                        <div className={`timeline-step ${['Shipped', 'Delivered'].includes(order.orderStatus) ? 'completed' : ''}`}>
                          <div className="step-icon">🚚</div>
                          <span>Shipped</span>
                        </div>
                        <div className={`timeline-step ${order.orderStatus === 'Delivered' ? 'completed' : ''}`}>
                          <div className="step-icon">📦</div>
                          <span>Delivered</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="expand-indicator">
                  {selectedOrder === order._id ? '▲ Click to collapse' : '▼ Click for details'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
