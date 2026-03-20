import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <section className="section">
      <div className="section-inner" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h1 style={{ color: '#FF2A0A', fontSize: '2.5rem', marginBottom: '10px' }}>404</h1>
        <p style={{ color: '#555', marginBottom: '20px' }}>The page you are looking for does not exist.</p>
        <Link to="/" className="btn-cta">Go Home</Link>
      </div>
    </section>
  );
}

export default NotFound;
