import React from 'react';
import { Link } from 'react-router-dom';

function AboutUs() {
  return (
    <section className="section about-page">
      <div className="section-inner">
        <h1 className="page-title">About Us</h1>
        
        <div className="about-content">
          <div className="about-hero">
            <h2>Welcome to Ritzy</h2>
            <p className="tagline">A unit of <strong>Aadibasaveshwara Enterprises</strong></p>
          </div>

          <div className="about-section">
            <h3>Our Story</h3>
            <p>
              Ritzy was founded with a simple mission: to provide high-quality products and exceptional 
              services to our valued customers. As a proud unit of Aadibasaveshwara Enterprises, we bring 
              years of experience and dedication to every interaction.
            </p>
          </div>

          <div className="about-section">
            <h3>Our Mission</h3>
            <p>
              To deliver premium products and outstanding customer service while maintaining the highest 
              standards of quality and integrity. We believe in building lasting relationships with our 
              customers through trust and reliability.
            </p>
          </div>

          <div className="about-section">
            <h3>Our Values</h3>
            <ul className="values-list">
              <li><strong>Quality:</strong> We never compromise on the quality of our products</li>
              <li><strong>Customer First:</strong> Your satisfaction is our top priority</li>
              <li><strong>Integrity:</strong> We conduct business with honesty and transparency</li>
              <li><strong>Innovation:</strong> We continuously improve to serve you better</li>
            </ul>
          </div>

          <div className="about-section">
            <h3>Why Choose Us?</h3>
            <div className="features-grid">
              <div className="feature-card">
                <span className="feature-icon">🏆</span>
                <h4>Premium Quality</h4>
                <p>Only the best products make it to our catalog</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">🚚</span>
                <h4>Fast Delivery</h4>
                <p>Quick and reliable shipping to your doorstep</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">💰</span>
                <h4>Best Prices</h4>
                <p>Competitive pricing without compromising quality</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">🤝</span>
                <h4>Customer Support</h4>
                <p>Dedicated support team ready to assist you</p>
              </div>
            </div>
          </div>

          <div className="about-section contact-info">
            <h3>Get in Touch</h3>
            <p>
              Have questions? We'd love to hear from you! Reach out to us through our 
              <Link to="/contact"> Contact Page</Link> or email us directly.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .about-page {
          padding: 40px 20px;
          max-width: 1000px;
          margin: 0 auto;
        }
        .page-title {
          text-align: center;
          font-size: 2.5rem;
          color: #FF2A0A;
          margin-bottom: 40px;
        }
        .about-hero {
          text-align: center;
          margin-bottom: 40px;
          padding: 30px;
          background: linear-gradient(135deg, #FF2A0A, #C81D00);
          color: white;
          border-radius: 15px;
        }
        .about-hero h2 {
          font-size: 2rem;
          margin-bottom: 10px;
        }
        .tagline {
          font-size: 1.2rem;
          opacity: 0.95;
        }
        .about-section {
          margin-bottom: 35px;
          padding: 25px;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }
        .about-section h3 {
          color: #FF2A0A;
          font-size: 1.5rem;
          margin-bottom: 15px;
          border-bottom: 2px solid #FF2A0A;
          padding-bottom: 10px;
        }
        .about-section p {
          line-height: 1.8;
          color: #444;
          font-size: 1.05rem;
        }
        .values-list {
          list-style: none;
          padding: 0;
        }
        .values-list li {
          padding: 10px 0;
          border-bottom: 1px solid #eee;
          line-height: 1.6;
        }
        .values-list li:last-child {
          border-bottom: none;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .feature-card {
          text-align: center;
          padding: 25px 15px;
          background: #f9f9f9;
          border-radius: 10px;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }
        .feature-icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 10px;
        }
        .feature-card h4 {
          color: #FF2A0A;
          margin-bottom: 8px;
        }
        .feature-card p {
          font-size: 0.9rem;
          color: #666;
        }
        .contact-info a {
          color: #FF2A0A;
          font-weight: 600;
        }
      `}</style>
    </section>
  );
}

export default AboutUs;
