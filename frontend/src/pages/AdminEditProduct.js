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
    category: 'General',
    stock: '0'
  });
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

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
          category: product.category || 'General',
          stock: String(product.stock ?? 0)
        });
        const existingImages = Array.isArray(product.images) && product.images.length > 0
          ? product.images
          : (product.image ? [product.image] : []);
        setPreview(existingImages);
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

  const onImageChange = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    setImages(files);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreview(previewUrls);
  };

  useEffect(() => {
    return () => {
      preview.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [preview]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', String(Number(form.price)));
      formData.append('originalPrice', String(Number(form.originalPrice || form.price)));
      formData.append('category', form.category);
      formData.append('stock', String(Number(form.stock || 0)));

      images.forEach((file) => {
        formData.append('images', file);
      });

      await fetchJson(`${API_BASE_URL}/admin/products/${id}/upload`, {
        method: 'PUT',
        headers: {
          ...getAdminHeaders()
        },
        body: formData
      });

      alert('Product has been edited successfully.');
      navigate('/admin/products');
    } catch (err) {
      setError(err.message || 'Failed to update product.');
      alert(`Product edit failed: ${err.message || 'Please try again.'}`);
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

          {['name', 'description', 'price', 'originalPrice', 'category', 'stock'].map((field) => (
            <div key={field} className="form-group">
              <label htmlFor={field}>{field}</label>
              <input
                id={field}
                name={field}
                type={field === 'price' || field === 'originalPrice' || field === 'stock' ? 'number' : 'text'}
                min={field === 'price' || field === 'originalPrice' || field === 'stock' ? '0' : undefined}
                value={form[field]}
                onChange={onChange}
                required={['name', 'description', 'price'].includes(field)}
              />
            </div>
          ))}

          <div className="form-group">
            <label htmlFor="images">Upload Images (up to 5)</label>
            <input
              id="images"
              name="images"
              type="file"
              accept="image/*"
              multiple
              onChange={onImageChange}
            />
            {preview.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '12px' }}>
                {preview.map((src, index) => (
                  <img
                    key={`${src}-${index}`}
                    src={src}
                    alt={`preview-${index + 1}`}
                    style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                    loading="lazy"
                  />
                ))}
              </div>
            )}
          </div>

          <button className="btn-login" type="submit" disabled={saving}>
            {saving ? 'Updating...' : 'Update Product'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AdminEditProduct;
