import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import { fetchJson } from '../utils/apiClient';
import { getAdminHeaders } from '../utils/adminAuth';

function AdminAddProduct() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'General',
    stock: '0'
  });
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

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
      preview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [preview]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setSaving(true);
      if (images.length === 0) {
        throw new Error('Please select at least one image.');
      }

      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', String(Number(form.price)));
      formData.append('category', form.category);
      formData.append('stock', String(Number(form.stock || 0)));

      images.forEach((file) => {
        formData.append('images', file);
      });

      await fetchJson(`${API_BASE_URL}/admin/add-product`, {
        method: 'POST',
        headers: {
          ...getAdminHeaders()
        },
        body: formData
      });

      setSuccess('Product added successfully!');
      alert('Product has been added successfully.');
      setForm({
        name: '',
        description: '',
        price: '',
        category: 'General',
        stock: '0'
      });
      setImages([]);
      setPreview([]);

      setTimeout(() => {
        navigate('/admin/products');
      }, 700);
    } catch (err) {
      setError(err.message || 'Failed to add product.');
      alert(`Product upload failed: ${err.message || 'Please try again.'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="section">
      <div className="section-inner" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h2 className="section-title">Add Product</h2>

        <form onSubmit={onSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div style={{ color: '#1a7f37', fontWeight: 600 }}>{success}</div>}

          {['name', 'description', 'price', 'category', 'stock'].map((field) => (
            <div key={field} className="form-group">
              <label htmlFor={field}>{field}</label>
              <input
                id={field}
                name={field}
                type={field === 'price' || field === 'stock' ? 'number' : 'text'}
                min={field === 'price' || field === 'stock' ? '0' : undefined}
                value={form[field]}
                onChange={onChange}
                required={['name', 'description', 'price'].includes(field)}
              />
            </div>
          ))}

          <div className="form-group">
            <label htmlFor="images">Images (up to 5)</label>
            <input
              id="images"
              name="images"
              type="file"
              accept="image/*"
              multiple
              onChange={onImageChange}
              required
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
            {saving ? 'Saving...' : 'Create Product'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AdminAddProduct;
