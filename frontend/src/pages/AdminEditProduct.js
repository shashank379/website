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
  const [existingImages, setExistingImages] = useState([]);
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
        const loadedImages = Array.isArray(product.images) && product.images.length > 0
          ? product.images
          : (product.image ? [product.image] : []);
        setExistingImages(loadedImages);
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

      // Only include images if there are new images to upload
      if (images.length > 0) {
        images.forEach((file) => {
          formData.append('images', file);
        });
        existingImages.forEach((img) => {
          formData.append('existingImages', img);
        });
        // Use the upload endpoint when there are images
        console.log('[AdminEditProduct] Uploading product with images...');
        await fetchJson(`${API_BASE_URL}/admin/products/${id}/upload`, {
          method: 'PUT',
          headers: {
            ...getAdminHeaders()
          },
          body: formData
        });
      } else {
        // Use standard update endpoint when no new images
        console.log('[AdminEditProduct] Updating product without new images...');
        await fetchJson(`${API_BASE_URL}/admin/products/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...getAdminHeaders()
          },
          body: JSON.stringify({
            name: form.name,
            description: form.description,
            price: Number(form.price),
            originalPrice: Number(form.originalPrice || form.price),
            category: form.category,
            stock: Number(form.stock || 0),
            images: existingImages
          })
        });
      }

      alert('Product has been edited successfully.');
      navigate('/admin/products');
    } catch (err) {
      const errorMsg = err.message || 'Failed to update product.';
      console.error('[AdminEditProduct] Error:', errorMsg);
      setError(errorMsg);
      alert(`Product edit failed: ${errorMsg}`);
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
            <label>Existing Images</label>
            {existingImages.length === 0 && <p style={{ fontSize: '0.9rem', color: '#666' }}>No existing images.</p>}
            {existingImages.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '12px' }}>
                {existingImages.map((src, index) => (
                  <div key={`existing-${index}`} style={{ position: 'relative' }}>
                    <img
                      src={src}
                      alt={`existing-${index}`}
                      style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                      loading="lazy"
                    />
                    <button
                      type="button"
                      onClick={() => setExistingImages(prev => prev.filter((_, i) => i !== index))}
                      style={{
                        position: 'absolute', top: 5, right: 5,
                        background: 'red', color: 'white', border: 'none',
                        borderRadius: '50%', width: '24px', height: '24px',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                      }}
                      title="Remove this image"
                    >
                      Ã—
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="images">Upload New Images (Appends to existing)</label>
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
                    alt={`new-preview-${index + 1}`}
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
