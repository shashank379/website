import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (location.state?.order) {
      setOrder(location.state.order);
    } else {
      // No order data, redirect to home
      navigate('/');
    }
  }, [location, navigate]);

  if (!order) {
    return (
      <section className="section">
        <div className="section-inner" style={{ textAlign: 'center', padding: '50px' }}>
          <p>Loading order details...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section order-confirmation">
      <div className="section-inner">
        {/* Success Header */}
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          background: 'linear-gradient(135deg, #d4edda, #c3e6cb)',
          borderRadius: '20px',
          marginBottom: '30px',
          border: '2px solid #28a745'
        }}>
          <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🎉</div>
          <h1 style={{ color: '#155724', marginBottom: '10px', fontSize: '2rem' }}>
            Order Placed Successfully!
          </h1>
          <p style={{ fontSize: '1.5rem', color: '#155724', marginBottom: '10px' }}>
            Order Number: <strong style={{ color: '#FF2A0A' }}>{order.orderNumber}</strong>
          </p>
          <p style={{ color: '#155724' }}>
            📧 Confirmation email sent to <strong>{order.customer.email}</strong>
          </p>
        </div>

        {/* Order Details Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '25px',
          marginBottom: '30px'
        }}>
          {/* Customer Details Card */}
          <div style={{
            background: '#fff',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
            border: '2px solid #eee'
          }}>
            <h3 style={{ 
              color: '#FF2A0A', 
              marginBottom: '20px',
              paddingBottom: '10px',
              borderBottom: '2px solid #FF2A0A',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              👤 Customer Details
            </h3>
            <div style={{ lineHeight: '2' }}>
              <p><strong>Name:</strong> {order.customer.name}</p>
              <p><strong>Email:</strong> {order.customer.email}</p>
              <p><strong>Phone:</strong> <a href={`tel:${order.customer.phone}`} style={{ color: '#FF2A0A' }}>{order.customer.phone}</a></p>
            </div>
          </div>

          {/* Delivery Address Card */}
          <div style={{
            background: '#fff',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
            border: '2px solid #eee'
          }}>
            <h3 style={{ 
              color: '#FF2A0A', 
              marginBottom: '20px',
              paddingBottom: '10px',
              borderBottom: '2px solid #FF2A0A',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              📍 Delivery Address
            </h3>
            <div style={{ lineHeight: '1.8' }}>
              <p>{order.deliveryAddress.addressLine1}</p>
              {order.deliveryAddress.addressLine2 && <p>{order.deliveryAddress.addressLine2}</p>}
              <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}</p>
              {order.deliveryAddress.landmark && (
                <p style={{ color: '#666', fontStyle: 'italic' }}>Landmark: {order.deliveryAddress.landmark}</p>
              )}
              <p style={{ 
                display: 'inline-block',
                background: '#FFF5F2',
                padding: '5px 15px',
                borderRadius: '20px',
                marginTop: '10px',
                fontSize: '0.9rem',
                color: '#FF2A0A'
              }}>
                {order.deliveryAddress.addressType === 'home' ? '🏠 Home' : '🏢 Office'}
              </p>
            </div>
          </div>

          {/* Payment Details Card */}
          <div style={{
            background: '#fff',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
            border: '2px solid #eee'
          }}>
            <h3 style={{ 
              color: '#FF2A0A', 
              marginBottom: '20px',
              paddingBottom: '10px',
              borderBottom: '2px solid #FF2A0A',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              💳 Payment Details
            </h3>
            <div style={{ lineHeight: '2' }}>
              <p><strong>Method:</strong> {order.paymentMethod.toUpperCase()}</p>
              <p><strong>Status:</strong> 
                <span style={{
                  display: 'inline-block',
                  background: order.paymentStatus === 'completed' ? '#d4edda' : '#fff3cd',
                  color: order.paymentStatus === 'completed' ? '#155724' : '#856404',
                  padding: '3px 12px',
                  borderRadius: '15px',
                  marginLeft: '10px',
                  fontSize: '0.9rem'
                }}>
                  {order.paymentStatus === 'completed' ? '✅ Paid' : '⏳ Pending (COD)'}
                </span>
              </p>
              {order.paymentId && <p><strong>Payment ID:</strong> {order.paymentId}</p>}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div style={{
          background: '#fff',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
          border: '2px solid #eee',
          marginBottom: '30px'
        }}>
          <h3 style={{ 
            color: '#FF2A0A', 
            marginBottom: '20px',
            paddingBottom: '10px',
            borderBottom: '2px solid #FF2A0A',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            🛒 Order Items ({order.items.length} {order.items.length === 1 ? 'item' : 'items'})
          </h3>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #FF2A0A, #C81D00)', color: '#fff' }}>
                  <th style={{ padding: '15px', textAlign: 'left', borderRadius: '8px 0 0 0' }}>#</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Item</th>
                  <th style={{ padding: '15px', textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '15px', textAlign: 'right', borderRadius: '0 8px 0 0' }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px', color: '#666' }}>{index + 1}</td>
                    <td style={{ padding: '15px', fontWeight: '600' }}>{item.name}</td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ padding: '15px', textAlign: 'right', color: '#FF2A0A', fontWeight: '600' }}>₹{item.price}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: '#FFF5F2' }}>
                  <td colSpan="3" style={{ padding: '20px', textAlign: 'right', fontWeight: '700', fontSize: '1.2rem' }}>
                    Total Amount:
                  </td>
                  <td style={{ padding: '20px', textAlign: 'right', color: '#FF2A0A', fontWeight: '700', fontSize: '1.5rem' }}>
                    ₹{order.totalAmount}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* COD Notice */}
        {order.paymentMethod === 'cod' && (
          <div style={{
            background: '#fff3cd',
            border: '2px solid #ffc107',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <span style={{ fontSize: '2rem' }}>💰</span>
            <div>
              <p style={{ margin: 0, fontWeight: '700', color: '#856404' }}>Cash on Delivery</p>
              <p style={{ margin: '5px 0 0 0', color: '#856404' }}>
                Please keep ₹{order.totalAmount} ready at the time of delivery.
              </p>
            </div>
          </div>
        )}

        {/* What's Next Section */}
        <div style={{
          background: 'linear-gradient(135deg, #FFF5F2, #FFE8E3)',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '30px',
          border: '2px dashed #FF2A0A'
        }}>
          <h3 style={{ color: '#FF2A0A', marginBottom: '20px', textAlign: 'center' }}>📦 What's Next?</h3>
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div style={{ textAlign: 'center', flex: '1', minWidth: '150px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📋</div>
              <p style={{ fontWeight: '600', color: '#333' }}>Order Confirmed</p>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>We received your order</p>
            </div>
            <div style={{ textAlign: 'center', flex: '1', minWidth: '150px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📦</div>
              <p style={{ fontWeight: '600', color: '#333' }}>Preparing</p>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>We're packing with care</p>
            </div>
            <div style={{ textAlign: 'center', flex: '1', minWidth: '150px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🚚</div>
              <p style={{ fontWeight: '600', color: '#333' }}>Shipped</p>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>On the way to you</p>
            </div>
            <div style={{ textAlign: 'center', flex: '1', minWidth: '150px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🎁</div>
              <p style={{ fontWeight: '600', color: '#333' }}>Delivered</p>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Enjoy your purchase!</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => navigate('/products')}
            style={{
              background: 'linear-gradient(135deg, #FF2A0A, #C81D00)',
              color: '#fff',
              padding: '15px 40px',
              borderRadius: '30px',
              border: 'none',
              fontWeight: '700',
              fontSize: '1.1rem',
              cursor: 'pointer',
              boxShadow: '0 5px 20px rgba(255, 42, 10, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            🛍️ Continue Shopping
          </button>
          <button
            onClick={() => navigate('/')}
            style={{
              background: '#fff',
              color: '#FF2A0A',
              padding: '15px 40px',
              borderRadius: '30px',
              border: '2px solid #FF2A0A',
              fontWeight: '700',
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#FFF5F2';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#fff';
            }}
          >
            🏠 Go to Home
          </button>
        </div>

        {/* Contact Support */}
        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          padding: '20px',
          background: '#f8f9fa',
          borderRadius: '10px'
        }}>
          <p style={{ color: '#666', marginBottom: '10px' }}>Need help with your order?</p>
          <p style={{ margin: '5px 0' }}>
            📧 <a href="mailto:ritzy2233@gmail.com" style={{ color: '#FF2A0A' }}>ritzy2233@gmail.com</a>
          </p>
          <p style={{ margin: '5px 0' }}>
            📱 <a href="https://instagram.com/ritzy_24" target="_blank" rel="noreferrer" style={{ color: '#FF2A0A' }}>@ritzy_24</a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default OrderConfirmation;
