import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';

function Payment({ cart, removeFromCart, clearCart }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    // Delivery Address Fields
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    addressType: 'home',
    // UPI Details
    upiId: ''
  });

  // Check if user is logged in and pre-fill form
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsLoggedIn(true);
      const userData = JSON.parse(user);
      setCurrentUser(userData);
      // Pre-fill form with user data
      setFormData(prev => ({
        ...prev,
        customerName: `${userData.firstName} ${userData.lastName}`,
        customerEmail: userData.email
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.amount, 0);
  };

  const validateForm = () => {
    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      alert('Please fill in all personal details');
      return false;
    }
    if (!formData.addressLine1 || !formData.city || !formData.state || !formData.pincode) {
      alert('Please fill in all required delivery address fields');
      return false;
    }
    if (formData.pincode.length !== 6) {
      alert('Please enter a valid 6-digit pincode');
      return false;
    }
    if (paymentMethod === 'upi' && !formData.upiId) {
      alert('Please enter your UPI ID');
      return false;
    }
    return true;
  };

  // Create order in backend and send notifications
  const createOrder = async (paymentStatus, paymentId = null) => {
    try {
      console.log('🛒 Creating order...');
      console.log('API URL:', `${API_BASE_URL}/orders/create`);
      
      // Build shipping address string
      const shippingAddress = [
        formData.addressLine1,
        formData.addressLine2,
        formData.landmark ? `Landmark: ${formData.landmark}` : '',
        `${formData.city}, ${formData.state} - ${formData.pincode}`
      ].filter(Boolean).join(', ');

      const orderData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        shippingAddress: shippingAddress,
        items: cart.map(item => ({
          productId: item.id || item.productId,
          name: item.name,
          price: item.price || item.amount || item.discountedPrice,
          quantity: item.quantity || 1,
          image: item.image || (item.images ? item.images[0] : '')
        })),
        totalAmount: calculateTotal(),
        paymentMethod: paymentMethod.toUpperCase(),
        paymentId: paymentId,
        notes: `Address Type: ${formData.addressType}`
      };

      console.log('Order data:', orderData);
      
      const response = await axios.post(`${API_BASE_URL}/orders/create`, orderData);
      
      console.log('✅ Order response:', response.data);
      
      if (response.data.success) {
        return response.data.order.orderNumber;
      }
      return null;
    } catch (error) {
      console.error('❌ Error creating order:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      // Even if backend fails, we still show success to user
      // Order details are logged in console for manual processing
      console.log('Order Details (for manual processing):', {
        customer: formData,
        items: cart,
        total: calculateTotal(),
        paymentMethod
      });
      return `RTZ${Date.now().toString().slice(-8)}`;
    }
  };

  const handleCODOrder = async () => {
    setIsProcessing(true);
    const orderId = await createOrder('pending');
    setOrderNumber(orderId);
    setOrderPlaced(true);
    setIsProcessing(false);
    
    // Prepare order data for confirmation page
    const orderDetails = {
      orderNumber: orderId,
      customer: {
        name: formData.customerName,
        email: formData.customerEmail,
        phone: formData.customerPhone
      },
      deliveryAddress: {
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        landmark: formData.landmark,
        addressType: formData.addressType
      },
      items: cart,
      totalAmount: calculateTotal(),
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      orderDate: new Date().toISOString()
    };
    
    if (clearCart) clearCart();
    setTimeout(() => {
      navigate('/order-confirmation', { state: { order: orderDetails } });
    }, 2000);
  };

  const handleUPIPayment = async () => {
    setIsProcessing(true);
    // In production, this would integrate with a UPI payment gateway
    alert(`UPI payment request sent to ${formData.upiId}. Please complete the payment in your UPI app.`);
    // Simulating successful payment after UPI confirmation
    setTimeout(async () => {
      const paymentId = `UPI_${Date.now()}`;
      const orderId = await createOrder('completed', paymentId);
      setOrderNumber(orderId);
      setOrderPlaced(true);
      setIsProcessing(false);
      
      // Prepare order data for confirmation page
      const orderDetails = {
        orderNumber: orderId,
        customer: {
          name: formData.customerName,
          email: formData.customerEmail,
          phone: formData.customerPhone
        },
        deliveryAddress: {
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          landmark: formData.landmark,
          addressType: formData.addressType
        },
        items: cart,
        totalAmount: calculateTotal(),
        paymentMethod: 'upi',
        paymentStatus: 'completed',
        paymentId: paymentId,
        orderDate: new Date().toISOString()
      };
      
      if (clearCart) clearCart();
      setTimeout(() => {
        navigate('/order-confirmation', { state: { order: orderDetails } });
      }, 2000);
    }, 2000);
  };

  const handlePayment = () => {
    // Check if user is logged in
    if (!isLoggedIn) {
      alert('Please login or create an account to complete your purchase.');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      alert('Please add items to cart first');
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Handle different payment methods
    if (paymentMethod === 'cod') {
      handleCODOrder();
      return;
    }

    if (paymentMethod === 'upi') {
      handleUPIPayment();
      return;
    }

    // Razorpay payment (card/netbanking/wallet)
    const totalAmount = calculateTotal();
    setIsProcessing(true);
    const options = {
      key: 'rzp_test_1DP5MMOk78IrIH',
      amount: totalAmount * 100,
      currency: 'INR',
      name: 'Ritzy',
      description: `Purchase of ${cart.length} item(s)`,
      customer_notify: 1,
      prefill: {
        name: formData.customerName,
        email: formData.customerEmail,
        contact: formData.customerPhone
      },
      handler: async function (response) {
        const orderId = await createOrder('completed', response.razorpay_payment_id);
        setOrderNumber(orderId);
        setOrderPlaced(true);
        setIsProcessing(false);
        
        // Prepare order data for confirmation page
        const orderDetails = {
          orderNumber: orderId,
          customer: {
            name: formData.customerName,
            email: formData.customerEmail,
            phone: formData.customerPhone
          },
          deliveryAddress: {
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            landmark: formData.landmark,
            addressType: formData.addressType
          },
          items: cart,
          totalAmount: calculateTotal(),
          paymentMethod: paymentMethod,
          paymentStatus: 'completed',
          paymentId: response.razorpay_payment_id,
          orderDate: new Date().toISOString()
        };
        
        if (clearCart) clearCart();
        setTimeout(() => {
          navigate('/order-confirmation', { state: { order: orderDetails } });
        }, 2000);
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
        }
      },
      onError: function (error) {
        setIsProcessing(false);
        alert(`Payment failed: ${error.description}`);
        console.error('Payment Error:', error);
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <section className="section payment">
      <div className="section-inner">
        <h2 className="section-title">Checkout & Payment</h2>

        {/* Order Success Screen */}
        {orderPlaced && (
          <div style={{
            textAlign: 'center',
            padding: '50px 20px',
            background: 'linear-gradient(135deg, #d4edda, #c3e6cb)',
            borderRadius: '20px',
            marginBottom: '30px',
            border: '2px solid #28a745'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
            <h2 style={{ color: '#155724', marginBottom: '10px' }}>Order Placed Successfully!</h2>
            {orderNumber && (
              <p style={{ fontSize: '1.3rem', color: '#155724', marginBottom: '15px' }}>
                <strong>Order Number:</strong> {orderNumber}
              </p>
            )}
            <p style={{ color: '#155724', marginBottom: '10px' }}>
              {paymentMethod === 'cod' 
                ? `You will pay ₹${calculateTotal()} on delivery.`
                : 'Your payment has been confirmed.'}
            </p>
            <p style={{ color: '#155724', marginBottom: '20px' }}>
              📧 Confirmation email sent to <strong>{formData.customerEmail}</strong>
            </p>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Redirecting to products page in 5 seconds...
            </p>
          </div>
        )}

        {/* Processing Overlay */}
        {isProcessing && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}>
            <div style={{
              background: 'white',
              padding: '40px',
              borderRadius: '15px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
              <p style={{ fontSize: '1.2rem', color: '#333' }}>Processing your order...</p>
            </div>
          </div>
        )}

        {/* Show login prompt if not logged in and cart has items */}
        {!isLoggedIn && cart.length > 0 && !orderPlaced && (
          <div style={{
            background: '#FFF5F2',
            border: '2px solid #FF2A0A',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#FF2A0A', fontWeight: '600', marginBottom: '10px' }}>
              ⚠️ Please login to complete your purchase
            </p>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'linear-gradient(135deg, #FF2A0A, #C81D00)',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '6px',
                border: 'none',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Login / Sign Up
            </button>
          </div>
        )}

        {/* Show logged in status */}
        {isLoggedIn && currentUser && (
          <div style={{
            background: '#d4edda',
            border: '1px solid #28a745',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}>
            <span style={{ color: '#155724', fontWeight: '600' }}>
              ✓ Logged in as {currentUser.firstName} ({currentUser.email})
            </span>
          </div>
        )}

        {cart.length === 0 ? (
          <div className="empty-cart">
            <h3>Your cart is empty</h3>
            <p>Add items from the Products page to proceed with payment</p>
          </div>
        ) : (
          <div className="payment-container">
            <div className="cart-items">
              <h3 style={{ marginBottom: '20px', color: '#800000' }}>Cart Items</h3>
              {cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <span className="cart-item-name">{item.name}</span>
                  <div>
                    <span className="cart-item-price">{item.price}</span>
                    <button
                      onClick={() => removeFromCart(index)}
                      style={{
                        marginLeft: '15px',
                        background: '#ff4b2b',
                        color: '#fff',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <form className="payment-form">
              {/* Personal Details Section */}
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ color: '#FF2A0A', marginBottom: '15px', borderBottom: '2px solid #FF2A0A', paddingBottom: '8px' }}>
                  👤 Personal Details
                </h4>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      placeholder="Enter 10-digit mobile number"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address Section */}
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ color: '#FF2A0A', marginBottom: '15px', borderBottom: '2px solid #FF2A0A', paddingBottom: '8px' }}>
                  📍 Delivery Address
                </h4>
                
                <div className="form-group">
                  <label>Address Line 1 * (House No, Building, Street)</label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    placeholder="Enter house/flat no, building name, street"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Address Line 2 (Area, Colony)</label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    placeholder="Enter area, colony, sector (optional)"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter city"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>State *</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' }}
                    >
                      <option value="">Select State</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                      <option value="Assam">Assam</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Chhattisgarh">Chhattisgarh</option>
                      <option value="Goa">Goa</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Himachal Pradesh">Himachal Pradesh</option>
                      <option value="Jharkhand">Jharkhand</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Manipur">Manipur</option>
                      <option value="Meghalaya">Meghalaya</option>
                      <option value="Mizoram">Mizoram</option>
                      <option value="Nagaland">Nagaland</option>
                      <option value="Odisha">Odisha</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Sikkim">Sikkim</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Tripura">Tripura</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Uttarakhand">Uttarakhand</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Delhi">Delhi</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="Enter 6-digit pincode"
                      maxLength="6"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Landmark (Optional)</label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      placeholder="Near landmark"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Address Type</label>
                  <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="addressType"
                        value="home"
                        checked={formData.addressType === 'home'}
                        onChange={handleInputChange}
                        style={{ width: 'auto', accentColor: '#FF2A0A' }}
                      />
                      🏠 Home
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="addressType"
                        value="office"
                        checked={formData.addressType === 'office'}
                        onChange={handleInputChange}
                        style={{ width: 'auto', accentColor: '#FF2A0A' }}
                      />
                      🏢 Office
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="addressType"
                        value="other"
                        checked={formData.addressType === 'other'}
                        onChange={handleInputChange}
                        style={{ width: 'auto', accentColor: '#FF2A0A' }}
                      />
                      📍 Other
                    </label>
                  </div>
                </div>
              </div>

              {/* Payment Method Section */}
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ color: '#FF2A0A', marginBottom: '15px', borderBottom: '2px solid #FF2A0A', paddingBottom: '8px' }}>
                  💳 Payment Method
                </h4>

                {/* Notice Banner */}
                <div style={{
                  background: 'linear-gradient(135deg, #fff3cd, #ffeeba)',
                  border: '1px solid #ffc107',
                  borderRadius: '8px',
                  padding: '12px 15px',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{ fontSize: '1.3rem' }}>ℹ️</span>
                  <div>
                    <div style={{ fontWeight: '600', color: '#856404' }}>Payment Notice</div>
                    <div style={{ fontSize: '0.9rem', color: '#856404' }}>Currently, only Cash on Delivery (COD) is available. Card and UPI payments coming soon!</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Razorpay Option - DISABLED */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '15px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    cursor: 'not-allowed',
                    background: '#f5f5f5',
                    opacity: 0.6,
                    position: 'relative'
                  }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      disabled
                      style={{ width: 'auto', cursor: 'not-allowed' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', color: '#999' }}>💳 Card / Net Banking / Wallet</div>
                      <div style={{ fontSize: '0.85rem', color: '#999' }}>Pay securely via Razorpay (Credit/Debit Card, Net Banking, Paytm, etc.)</div>
                    </div>
                    <span style={{
                      background: '#6c757d',
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>Coming Soon</span>
                  </div>

                  {/* UPI Option - DISABLED */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '15px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    cursor: 'not-allowed',
                    background: '#f5f5f5',
                    opacity: 0.6,
                    position: 'relative'
                  }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      disabled
                      style={{ width: 'auto', cursor: 'not-allowed' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', color: '#999' }}>📱 UPI Payment</div>
                      <div style={{ fontSize: '0.85rem', color: '#999' }}>Pay using Google Pay, PhonePe, Paytm, BHIM or any UPI app</div>
                    </div>
                    <span style={{
                      background: '#6c757d',
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>Coming Soon</span>
                  </div>

                  {/* COD Option - ACTIVE */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '15px',
                    border: '2px solid #FF2A0A',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: '#FFF5F2',
                    transition: 'all 0.3s ease'
                  }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ width: 'auto', accentColor: '#FF2A0A' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', color: '#333' }}>💵 Cash on Delivery (COD)</div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>Pay with cash when your order is delivered</div>
                    </div>
                    <span style={{
                      background: '#28a745',
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>Available</span>
                  </label>
                </div>

                {/* UPI ID Input - Show only when UPI is selected */}
                {paymentMethod === 'upi' && (
                  <div className="form-group" style={{ marginTop: '15px' }}>
                    <label>UPI ID *</label>
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleInputChange}
                      placeholder="Enter your UPI ID (e.g., name@upi)"
                      style={{
                        border: '2px solid #FF2A0A',
                        background: '#FFF5F2'
                      }}
                    />
                    <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                      Example: yourname@okaxis, yourname@ybl, yourname@paytm
                    </small>
                  </div>
                )}

                {/* COD Note */}
                {paymentMethod === 'cod' && (
                  <div style={{
                    marginTop: '15px',
                    padding: '12px',
                    background: '#fff3cd',
                    border: '1px solid #ffc107',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    color: '#856404'
                  }}>
                    <strong>📌 Note:</strong> For Cash on Delivery orders, please keep exact change ready. 
                    Our delivery partner will collect ₹{calculateTotal()} at the time of delivery.
                  </div>
                )}
              </div>

              <div className="payment-summary">
                <h4 style={{ color: '#FF2A0A', marginBottom: '15px', borderBottom: '2px solid #FF2A0A', paddingBottom: '8px' }}>
                  🧾 Order Summary
                </h4>
                <div className="summary-item">
                  <span>Subtotal ({cart.length} items):</span>
                  <span>₹{cart.reduce((total, item) => total + item.amount, 0)}</span>
                </div>
                <div className="summary-item">
                  <span>Delivery Charges:</span>
                  <span style={{ color: '#28a745' }}>FREE</span>
                </div>
                <div className="summary-item" style={{ borderTop: '2px solid #FF2A0A', paddingTop: '15px', marginTop: '10px' }}>
                  <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Total Amount:</span>
                  <span style={{ fontWeight: '700', fontSize: '1.2rem', color: '#FF2A0A' }}>₹{calculateTotal()}</span>
                </div>
                
                {/* Delivery Address Preview */}
                {formData.addressLine1 && formData.city && (
                  <div style={{
                    marginTop: '15px',
                    padding: '12px',
                    background: '#f8f9fa',
                    borderRadius: '6px',
                    fontSize: '0.9rem'
                  }}>
                    <strong>📍 Delivering to:</strong>
                    <p style={{ margin: '5px 0 0 0', color: '#555' }}>
                      {formData.addressLine1}
                      {formData.addressLine2 && `, ${formData.addressLine2}`}
                      <br />
                      {formData.city}, {formData.state} - {formData.pincode}
                      {formData.landmark && <><br />Near: {formData.landmark}</>}
                    </p>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="btn-payment"
                onClick={handlePayment}
                style={{
                  background: 'linear-gradient(135deg, #28a745, #218838)',
                  marginTop: '20px'
                }}
              >
                💵 Place Order (COD) - ₹{calculateTotal()}
              </button>

              {/* Order Placed Success Message */}
              {orderPlaced && (
                <div style={{
                  marginTop: '20px',
                  padding: '20px',
                  background: '#d4edda',
                  border: '2px solid #28a745',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>✅</div>
                  <h3 style={{ color: '#155724', marginBottom: '10px' }}>Order Placed Successfully!</h3>
                  <p style={{ color: '#155724' }}>
                    Thank you for your order. You will receive a confirmation email shortly.
                  </p>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '10px' }}>
                    Redirecting to products page...
                  </p>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

export default Payment;
