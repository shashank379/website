import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import { fetchJson } from '../utils/apiClient';
import { getAdminHeaders } from '../utils/adminAuth';

function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    image: '',
    category: 'General',
    stock: '0'
  });

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const { data } = await fetchJson(`${API_BASE_URL}/admin/products/${id}`, {
          headers: {
            ...getAdminHeaders()
          }
        });
        const product = data.product;
        setForm({
          name: product.name || '',
          description: product.description || '',
          price: String(product.price ?? ''),
          originalPrice: String(product.originalPrice ?? product.price ?? ''),
          image: product.image || product.images?.[0] || '',
          category: product.category || 'General',
          stock: String(product.stock ?? 0)
        });
      } catch (err) {
        setError(err.message || 'Failed to load product.');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setSaving(true);
      await fetchJson(`${API_BASE_URL}/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminHeaders()
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          originalPrice: Number(form.originalPrice || form.price),
          stock: Number(form.stock || 0),
          images: form.image ? [form.image] : []
        })
      });

      navigate('/admin/products');
    } catch (err) {
      setError(err.message || 'Failed to update product.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <section className="section"><div className="section-inner">Loading product...</div></section>;
  }

  return (
    <section className="section">
      <div className="section-inner" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h2 className="section-title">Edit Product</h2>

        <form onSubmit={onSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          {['name', 'description', 'price', 'originalPrice', 'image', 'category', 'stock'].map((field) => (
            <div key={field} className="form-group">
              <label htmlFor={field}>{field}</label>
              <input
                id={field}
                name={field}
                value={form[field]}
                onChange={onChange}
                required={['name', 'description', 'price'].includes(field)}
              />
            </div>
          ))}

          <button className="btn-login" type="submit" disabled={saving}>
            {saving ? 'Updating...' : 'Update Product'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AdminEditProduct;
