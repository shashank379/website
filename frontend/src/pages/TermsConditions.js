import React from 'react';
import { Link } from 'react-router-dom';

function TermsConditions() {
  return (
    <section className="section legal-page">
      <div className="section-inner">
        <h1 className="page-title">Terms and Conditions</h1>
        
        <div className="legal-content">
          <p className="last-updated">Last Updated: March 2026</p>

          <div className="legal-section">
            <h2>1. Agreement to Terms</h2>
            <p>
              Welcome to Ritzy, a unit of Aadibasaveshwara Enterprises. By accessing or using our 
              website and services, you agree to be bound by these Terms and Conditions. If you 
              do not agree with any part of these terms, please do not use our services.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Use of Our Services</h2>
            <p>By using our website, you agree to:</p>
            <ul>
              <li>Provide accurate and complete information when creating an account or placing orders</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Not use the service for any illegal or unauthorized purpose</li>
              <li>Not interfere with or disrupt the website's functionality</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>3. Products and Services</h2>
            <h3>Product Information</h3>
            <p>
              We strive to provide accurate product descriptions and images. However, we do not 
              warrant that product descriptions, images, or other content on the website are 
              accurate, complete, or error-free. Colors may vary slightly due to monitor settings.
            </p>

            <h3>Pricing</h3>
            <p>
              All prices are listed in Indian Rupees (₹) and are subject to change without notice. 
              We reserve the right to correct any pricing errors. In such cases, you will be notified 
              before your order is processed.
            </p>

            <h3>Availability</h3>
            <p>
              Product availability is subject to change. We reserve the right to limit quantities, 
              discontinue products, or refuse orders at our discretion.
            </p>
          </div>

          <div className="legal-section">
            <h2>4. Orders and Payment</h2>
            <h3>Order Acceptance</h3>
            <p>
              Placing an order constitutes an offer to purchase. We reserve the right to accept or 
              decline any order. Order confirmation does not guarantee acceptance until the order 
              is shipped.
            </p>

            <h3>Payment Methods</h3>
            <p>We accept the following payment methods:</p>
            <ul>
              <li>Cash on Delivery (COD)</li>
              <li>UPI Payments</li>
              <li>Online Payment (Razorpay)</li>
            </ul>

            <h3>Payment Security</h3>
            <p>
              All online payments are processed through secure payment gateways. We do not store 
              your complete payment information on our servers.
            </p>
          </div>

          <div className="legal-section">
            <h2>5. Shipping and Delivery</h2>
            <ul>
              <li>Delivery times are estimates and may vary based on location and availability</li>
              <li>We are not responsible for delays caused by shipping carriers or unforeseen circumstances</li>
              <li>You are responsible for providing accurate shipping information</li>
              <li>Risk of loss passes to you upon delivery to the carrier</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>6. Returns and Refunds</h2>
            <h3>Return Policy</h3>
            <p>
              Returns are accepted within 7 days of delivery for eligible products. Items must be 
              unused, in original packaging, and in resalable condition.
            </p>

            <h3>Non-Returnable Items</h3>
            <p>The following items cannot be returned:</p>
            <ul>
              <li>Perishable goods</li>
              <li>Customized or personalized items</li>
              <li>Items marked as non-returnable</li>
              <li>Items damaged due to customer misuse</li>
            </ul>

            <h3>Refund Processing</h3>
            <p>
              Refunds will be processed within 7-10 business days after we receive and inspect the 
              returned item. Refunds will be issued to the original payment method or as store credit.
            </p>
          </div>

          <div className="legal-section">
            <h2>7. Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, images, and software, 
              is the property of Ritzy / Aadibasaveshwara Enterprises and is protected by intellectual 
              property laws. You may not reproduce, distribute, or create derivative works without 
              our written consent.
            </p>
          </div>

          <div className="legal-section">
            <h2>8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Ritzy and Aadibasaveshwara Enterprises shall 
              not be liable for any indirect, incidental, special, consequential, or punitive damages 
              arising from your use of our services.
            </p>
          </div>

          <div className="legal-section">
            <h2>9. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Ritzy, Aadibasaveshwara Enterprises, and their 
              officers, directors, employees, and agents from any claims, damages, losses, or expenses 
              arising from your use of our services or violation of these terms.
            </p>
          </div>

          <div className="legal-section">
            <h2>10. Governing Law</h2>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the 
              laws of India. Any disputes shall be subject to the exclusive jurisdiction of the 
              courts in Karnataka, India.
            </p>
          </div>

          <div className="legal-section">
            <h2>11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms and Conditions at any time. Changes will 
              be effective immediately upon posting on the website. Your continued use of our 
              services after changes constitutes acceptance of the modified terms.
            </p>
          </div>

          <div className="legal-section">
            <h2>12. Contact Information</h2>
            <p>For questions about these Terms and Conditions, please contact us:</p>
            <ul>
              <li><strong>Business Name:</strong> Aadibasaveshwara Enterprises (Ritzy)</li>
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

export default TermsConditions;
