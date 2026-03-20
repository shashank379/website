import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="section contact">
      <div className="section-inner">
        <h2 className="section-title">Contact Us</h2>
        <p className="section-subtitle">We'd love to hear from you. Get in touch with us today!</p>
        
        <div className="contact-wrapper">
          <div className="contact-info">
            <div className="info-card">
              <h3>📍 Address</h3>
              <address>
                #53, 'G' Block, Behind HDFC Bank,<br />
                Sahakarnagar, Bangalore-560092.
              </address>
            </div>

            <div className="info-card">
              <h3>📞 Phone</h3>
              <p>
                <a href="tel:9481573395">94815 73395</a>
              </p>
            </div>

            <div className="info-card">
              <h3>✉️ Email</h3>
              <p>
                <a href="mailto:ritzy2233@gmail.com">ritzy2233@gmail.com</a>
              </p>
            </div>

            <div className="info-card">
              <h3>📱 Follow Us</h3>
              <p>
                <a href="https://instagram.com/ritzy_24" target="_blank" rel="noopener noreferrer">
                  Instagram: @ritzy_24
                </a>
              </p>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <form className="contact-form" onSubmit={handleSubmit}>
              {submitted && <div className="success-message">Thank you! We'll get back to you soon.</div>}

              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone (Optional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Write your message here..."
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-submit">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
