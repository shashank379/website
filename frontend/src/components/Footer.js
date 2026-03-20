import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>Ritzy</h3>
          <p className="company-tagline">A unit of Aadibasaveshwara Enterprises</p>
        </div>
        
        <div className="footer-links">
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/about-us">About Us</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions">Terms & Conditions</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact</h4>
            <ul>
              <li>Email: ritzy2233@gmail.com</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Ritzy - Aadibasaveshwara Enterprises. All rights reserved.</p>
      </div>

      <style jsx>{`
        .site-footer {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: #fff;
          padding: 0;
          margin-top: 40px;
        }
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 40px;
        }
        .footer-brand h3 {
          font-size: 2rem;
          color: #FF2A0A;
          margin-bottom: 8px;
        }
        .company-tagline {
          color: #aaa;
          font-size: 0.9rem;
        }
        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }
        .footer-section h4 {
          color: #FF2A0A;
          font-size: 1.1rem;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid #FF2A0A;
        }
        .footer-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .footer-section li {
          margin-bottom: 10px;
        }
        .footer-section a {
          color: #ccc;
          text-decoration: none;
          transition: color 0.3s;
        }
        .footer-section a:hover {
          color: #FF2A0A;
        }
        .footer-bottom {
          background: rgba(0,0,0,0.3);
          text-align: center;
          padding: 15px 20px;
          font-size: 0.9rem;
          color: #888;
        }
        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .footer-links {
            grid-template-columns: 1fr;
            gap: 25px;
          }
          .footer-section h4 {
            border-bottom: none;
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;
