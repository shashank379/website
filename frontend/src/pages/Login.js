import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import { setAdminAuth } from '../utils/adminAuth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [activeSection, setActiveSection] = useState('user');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsLoggedIn(true);
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setCurrentUser(null);
    alert('You have been logged out successfully!');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.msg || 'Login failed');
        setLoading(false);
        return;
      }

      // Store token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('userEmail', email);

      alert(`Welcome back, ${data.name}!`);
      navigate('/products');
    } catch (err) {
      setError('Connection error. Make sure the server is running on port 5000.');
      console.error('Login error:', err);
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password || !firstName || !lastName) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          name: `${firstName} ${lastName}`,
          email, 
          password 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.msg || 'Registration failed');
        setLoading(false);
        return;
      }

      // Store token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('userEmail', email);

      alert(`Welcome, ${data.name}! Account created successfully.`);
      navigate('/products');
    } catch (err) {
      setError('Connection error. Make sure the server is running on port 5000.');
      console.error('Sign up error:', err);
    }
    setLoading(false);
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminError('');
    setAdminLoading(true);

    if (!adminEmail.trim() || !adminPassword.trim()) {
      setAdminError('Please enter admin email and password');
      setAdminLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: adminEmail, password: adminPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        setAdminError(data.message || 'Admin login failed');
        setAdminLoading(false);
        return;
      }

      setAdminAuth({ token: data.token, admin: data.admin });
      navigate('/admin/dashboard');
    } catch (err) {
      setAdminError('Connection error. Make sure the server is running on port 5000.');
      console.error('Admin login error:', err);
    }

    setAdminLoading(false);
  };

  return (
    <section className="section login">
      <div className="section-inner">
        <div className="login-container">
          {isLoggedIn && currentUser ? (
            // Show logged-in state
            <>
              <div style={{
                textAlign: 'center',
                padding: '20px'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FF2A0A 0%, #C81D00 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '2rem',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  {currentUser.name?.charAt(0).toUpperCase() || '✓'}
                </div>
                <h2 className="section-title" style={{ color: '#FF2A0A' }}>
                  Welcome, {currentUser.name}!
                </h2>
                <p style={{ 
                  color: '#28a745', 
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  marginBottom: '10px'
                }}>
                  ✓ You are already logged in
                </p>
                <p style={{ color: '#666', marginBottom: '25px' }}>
                  Signed in as: <strong>{currentUser.email}</strong>
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Link 
                    to="/products" 
                    style={{
                      display: 'inline-block',
                      background: 'linear-gradient(135deg, #FF2A0A, #C81D00)',
                      color: '#fff',
                      padding: '14px 28px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: '700',
                      fontSize: '1rem',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                  >
                    🛍️ Continue Shopping
                  </Link>
                  
                  <Link 
                    to="/cart" 
                    style={{
                      display: 'inline-block',
                      background: '#fff',
                      color: '#FF2A0A',
                      padding: '14px 28px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: '700',
                      fontSize: '1rem',
                      border: '2px solid #FF2A0A',
                      transition: 'all 0.2s'
                    }}
                  >
                    🛒 View Cart
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    style={{
                      background: '#f8f9fa',
                      color: '#666',
                      padding: '12px 28px',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      marginTop: '10px',
                      transition: 'all 0.2s'
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            // Show login/signup form
            <>
              <h2 className="section-title">Login</h2>
              <p className="login-subtitle">Choose your section and continue.</p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection('user');
                    setAdminError('');
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: activeSection === 'user' ? '2px solid #FF2A0A' : '1px solid #ddd',
                    background: activeSection === 'user' ? '#fff3ef' : '#fff',
                    color: '#222',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  User
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection('admin');
                    setError('');
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: activeSection === 'admin' ? '2px solid #FF2A0A' : '1px solid #ddd',
                    background: activeSection === 'admin' ? '#fff3ef' : '#fff',
                    color: '#222',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Admin
                </button>
              </div>

              {activeSection === 'user' ? (
                <>
                  <form className="login-form" onSubmit={isSignUp ? handleSignUp : handleLogin}>
                    {error && <div className="error-message">{error}</div>}

                    {isSignUp && (
                      <>
                        <div className="form-group">
                          <label htmlFor="firstName">First Name</label>
                          <input
                            type="text"
                            id="firstName"
                            placeholder="Enter your first name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="lastName">Last Name</label>
                          <input
                            type="text"
                            id="lastName"
                            placeholder="Enter your last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                      </>
                    )}

                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <button type="submit" className="btn-login" disabled={loading}>
                      {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                    </button>
                  </form>

                  <div className="login-footer">
                    <p>
                      {isSignUp
                        ? 'Already have an account? '
                        : "Don't have an account? "}
                      <button
                        type="button"
                        onClick={() => {
                          setIsSignUp(!isSignUp);
                          setError('');
                          setEmail('');
                          setPassword('');
                          setFirstName('');
                          setLastName('');
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#FF2A0A',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          fontSize: 'inherit',
                          fontWeight: '600'
                        }}
                      >
                        {isSignUp ? 'Sign In' : 'Create one'}
                      </button>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <form className="login-form" onSubmit={handleAdminLogin}>
                    {adminError && <div className="error-message">{adminError}</div>}

                    <div className="form-group">
                      <label htmlFor="admin-email">Admin Email</label>
                      <input
                        type="email"
                        id="admin-email"
                        placeholder="Enter pre-given admin email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="admin-password">Admin Password</label>
                      <input
                        type="password"
                        id="admin-password"
                        placeholder="Enter pre-given admin password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                      />
                    </div>

                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '14px' }}>
                      Only approved admin credentials can log in here.
                    </p>

                    <button type="submit" className="btn-login" disabled={adminLoading}>
                      {adminLoading ? 'Signing in...' : 'Login as Admin'}
                    </button>
                  </form>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Login;
