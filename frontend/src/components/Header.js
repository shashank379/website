import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAdminAuth } from '../utils/adminAuth';

function Header({ cartCount = 0 }) {
  const location = useLocation();
  const adminAuth = getAdminAuth();

  const isActive = (path) => location.pathname === path ? 'active' : '';



  return (
    <header className="site-header">
      <div className="header-container">
        <Link to="/" className="logo-link">
          <div className="logo">
            <div className="logo-img" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              fontWeight: 700,
              color: '#FF2A0A',
              background: '#fff'
            }}>
              R
            </div>
            <div className="brand-info">
              <h1 className="brand-title">Ritzy</h1>
              <p className="company-name">Aadibasaveshwara Enterprises</p>
            </div>
          </div>
        </Link>

        <nav className="main-nav">
          <ul>
            <li>
              <Link to="/login" className={`nav-link ${isActive('/login')}`}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/orders" className={`nav-link ${isActive('/orders')}`}>
                Orders
              </Link>
            </li>
            <li>
              <Link to="/services" className={`nav-link ${isActive('/services')}`}>
                Services
              </Link>
            </li>
            <li>
              <Link to="/products" className={`nav-link ${isActive('/products')}`}>
                Products
              </Link>
            </li>
            <li>
              <Link to="/contact" className={`nav-link ${isActive('/contact')}`}>
                Contact
              </Link>
            </li>
            {adminAuth?.admin?.role === 'admin' && (
              <li>
                <button 
                  onClick={() => window.open('/admin/dashboard', '_blank')}
                  className="nav-link"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'inherit',
                    padding: 'inherit',
                    font: 'inherit'
                  }}
                >
                  Admin Panel
                </button>
              </li>
            )}
            <li>
              <Link to="/cart" className={`nav-link ${isActive('/cart')}`} style={{ position: 'relative' }}>
                🛒 Cart
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-12px',
                    background: '#FF2A0A',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: '700'
                  }}>
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
