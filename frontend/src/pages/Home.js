import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h2>
          Are you searching for the <span>Best Gifts & Return Gifts?</span>
        </h2>
        <p>
          We're here to help you find the perfect gifts that leave lasting memories.
          From unique keepsakes to delightful surprises, our curated selection is designed
          to celebrate your moments in style.
        </p>
        <Link to="/products" className="btn-cta">
          Explore Products
        </Link>
      </div>
    </section>
  );
}

export default Home;
