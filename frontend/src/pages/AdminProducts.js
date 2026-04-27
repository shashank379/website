import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import { fetchJson } from '../utils/apiClient';
import { getAdminHeaders } from '../utils/adminAuth';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await fetchJson(`${API_BASE_URL}/admin/products`, {
          headers: {
            ...getAdminHeaders()
          }
        });
        setProducts(data?.products || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <section className="section">
      <div className="section-inner" style={{ maxWidth: '1000px', margin: '0 auto', padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0 }}>Products Management (Updated)</h3>
          <Link to="/admin/products/new" className="btn-cta" style={{ textAlign: 'center' }}>New Product</Link>
        </div>

        {loading && <p>Loading products...</p>}
        {error && <p style={{ color: '#d9534f' }}>{error}</p>}
        {!loading && !error && products.length === 0 && <p>No products found.</p>}

        {!loading && !error && products.length > 0 && (
          <div style={{ display: 'grid', gap: '12px' }}>
            {products.map((product) => (
              <div key={product._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', border: '1px solid #eee', borderRadius: '8px' }}>
                <div>
                  <strong>{product.name}</strong>
                  <p style={{ margin: '6px 0 0', color: '#666' }}>₹{product.price}</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <Link to={`/admin/products/edit/${product._id}`} style={{ color: '#FF2A0A', fontWeight: 600 }}>
                    Edit
                  </Link>
                  <button
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this product?')) {
                        try {
                          await fetchJson(`${API_BASE_URL}/admin/products/${product._id}`, {
                            method: 'DELETE',
                            headers: getAdminHeaders()
                          });
                          setProducts(p => p.filter(p => p._id !== product._id));
                          alert('Product deleted successfully');
                        } catch (err) {
                          alert(`Failed to delete: ${err.message}`);
                        }
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#d9534f',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminProducts;
