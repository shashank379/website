import React from 'react';
import { Link } from 'react-router-dom';

function PrivacyPolicy() {
  return (
    <section className="section legal-page">
      <div className="section-inner">
        <h1 className="page-title">Privacy Policy</h1>
        
        <div className="legal-content">
          <p className="last-updated">Last Updated: March 2026</p>

          <div className="legal-section">
            <h2>1. Introduction</h2>
            <p>
              Welcome to Ritzy ("we," "our," or "us"), a unit of Aadibasaveshwara Enterprises. 
              We are committed to protecting your personal information and your right to privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your 
              information when you visit our website and use our services.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>We may collect the following personal information:</p>
            <ul>
              <li>Name and contact information (email address, phone number)</li>
              <li>Billing and shipping address</li>
              <li>Payment information (processed securely through payment gateways)</li>
              <li>Order history and preferences</li>
              <li>Account credentials</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>When you visit our website, we may automatically collect:</p>
            <ul>
              <li>IP address and browser type</li>
              <li>Device information</li>
              <li>Pages visited and time spent</li>
              <li>Referring website addresses</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>3. How We Use Your Information</h2>
            <p>We use the collected information for:</p>
            <ul>
              <li>Processing and fulfilling your orders</li>
              <li>Communicating with you about orders, products, and services</li>
              <li>Sending order confirmations and shipping updates</li>
              <li>Providing customer support</li>
              <li>Improving our website and services</li>
              <li>Preventing fraud and ensuring security</li>
              <li>Complying with legal obligations</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>4. Information Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. 
              We may share your information with:
            </p>
            <ul>
              <li>Payment processors for transaction processing</li>
              <li>Shipping partners for order delivery</li>
              <li>Service providers who assist in our operations</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect 
              your personal information. However, no method of transmission over the Internet or 
              electronic storage is 100% secure. While we strive to protect your information, 
              we cannot guarantee absolute security.
            </p>
          </div>

          <div className="legal-section">
            <h2>6. Cookies</h2>
            <p>
              Our website may use cookies and similar tracking technologies to enhance your 
              browsing experience. You can choose to disable cookies through your browser settings, 
              but this may affect some features of our website.
            </p>
          </div>

          <div className="legal-section">
            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>8. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 18. We do not 
              knowingly collect personal information from children. If you believe we have 
              collected information from a minor, please contact us immediately.
            </p>
          </div>

          <div className="legal-section">
            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any 
              changes by posting the new Privacy Policy on this page and updating the "Last Updated" 
              date. We encourage you to review this policy periodically.
            </p>
          </div>

          <div className="legal-section">
            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, 
              please contact us:
            </p>
            <ul>
              <li><strong>Email:</strong> ritzy2233@gmail.com</li>
              <li><strong>Website:</strong> <Link to="/contact">Contact Page</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .legal-page {
          padding: 40px 20px;
          max-width: 900px;
          margin: 0 auto;
        }
        .page-title {
          text-align: center;
          font-size: 2.5rem;
          color: #FF2A0A;
          margin-bottom: 20px;
        }
        .last-updated {
          text-align: center;
          color: #666;
          font-style: italic;
          margin-bottom: 30px;
        }
        .legal-content {
          background: #fff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }
        .legal-section {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        .legal-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        .legal-section h2 {
          color: #FF2A0A;
          font-size: 1.4rem;
          margin-bottom: 15px;
        }
        .legal-section h3 {
          color: #333;
          font-size: 1.1rem;
          margin: 15px 0 10px;
        }
        .legal-section p {
          line-height: 1.7;
          color: #444;
          margin-bottom: 10px;
        }
        .legal-section ul {
          padding-left: 25px;
          margin: 10px 0;
        }
        .legal-section li {
          line-height: 1.8;
          color: #444;
          margin-bottom: 5px;
        }
        .legal-section a {
          color: #FF2A0A;
          text-decoration: none;
        }
        .legal-section a:hover {
          text-decoration: underline;
        }
      `}</style>
    </section>
  );
}

export default PrivacyPolicy;
