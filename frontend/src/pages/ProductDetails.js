import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import { normalizeProduct, resolveProductImageUrl } from '../utils/productMapper';
import { fetchJson } from '../utils/apiClient';

function ProductDetails({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const storedUser = useMemo(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch (parseError) {
      return null;
    }
  }, []);

  const [reviewForm, setReviewForm] = useState({
    userName: storedUser?.name || '',
    rating: '5',
    comment: ''
  });

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      console.log('[ProductDetails] Fetching:', `${API_BASE_URL}/products/${id}`);
      const { data } = await fetchJson(`${API_BASE_URL}/products/${id}`);

      setProduct(normalizeProduct(data.product));
    } catch (err) {
      setError(err.message || 'Unable to load product');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      ...product,
      productId: product.id,
      price: product.discountedPrice,
      amount: product.discountedPrice
    });
    navigate('/cart');
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    if (!reviewForm.userName.trim()) {
      setSubmitError('Please provide your name for the review.');
      return;
    }

    if (!reviewForm.comment.trim()) {
      setSubmitError('Please write a review comment.');
      return;
    }

    try {
      setSubmitLoading(true);
      await fetchJson(`${API_BASE_URL}/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: storedUser?._id,
          userName: reviewForm.userName,
          rating: Number(reviewForm.rating),
          comment: reviewForm.comment
        })
      });

      setSubmitSuccess('Review submitted successfully.');
      setReviewForm((prev) => ({ ...prev, rating: '5', comment: '' }));
      await fetchProduct();
    } catch (err) {
      setSubmitError(err.message || 'Unable to submit review');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="section products">
        <div className="section-inner" style={{ textAlign: 'center', padding: '40px 20px' }}>
          Loading product details...
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="section products">
        <div className="section-inner" style={{ textAlign: 'center', padding: '40px 20px', color: '#d9534f' }}>
          {error || 'Product not found'}
        </div>
      </section>
    );
  }

  const imageList = product.images.length ? product.images : [product.image];
  const selectedImage = imageList[activeImage] || product.image;

  return (
    <section className="section products">
      <div className="section-inner">
        <div style={{ marginBottom: '15px' }}>
          <Link to="/products" style={{ textDecoration: 'none', color: '#17a2b8', fontWeight: 600 }}>
            ← Back to Products
          </Link>
        </div>

        <div style={{ display: 'grid', gap: '25px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div>
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee', background: '#fff' }}>
              <img src={resolveProductImageUrl(selectedImage)} alt={product.name} style={{ width: '100%', height: '360px', objectFit: 'cover' }} />
            </div>
            {imageList.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
                {imageList.map((img, index) => (
                  <button
                    key={`${img}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    style={{
                      border: activeImage === index ? '2px solid #17a2b8' : '1px solid #ddd',
                      borderRadius: '6px',
                      padding: 0,
                      overflow: 'hidden',
                      background: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    <img src={resolveProductImageUrl(img)} alt={`${product.name} ${index + 1}`} style={{ width: '72px', height: '72px', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="section-title" style={{ marginBottom: '10px' }}>{product.name}</h2>
            <p style={{ color: '#666', marginBottom: '12px' }}>{product.desc}</p>
            <p style={{ marginBottom: '8px' }}>
              <strong>Category:</strong> {product.category}
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong>Stock:</strong> {product.stock}
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong>Rating:</strong> {product.rating.toFixed(1)} / 5 ({product.numReviews} reviews)
            </p>

            <div style={{ margin: '16px 0', fontSize: '1.2rem' }}>
              <span style={{ textDecoration: 'line-through', color: '#999', marginRight: '10px' }}>
                ₹{product.originalPrice}
              </span>
              <span style={{ color: '#20c997', fontWeight: '700' }}>
                ₹{product.discountedPrice}
              </span>
            </div>

            <button className="btn-add-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>

        <div style={{ marginTop: '35px' }}>
          <h3 style={{ marginBottom: '14px' }}>Customer Reviews ({product.numReviews})</h3>

          {product.reviews.length === 0 && (
            <p style={{ color: '#777' }}>No reviews yet. Be the first to review this product.</p>
          )}

          {product.reviews.map((review) => (
            <div
              key={review._id}
              style={{
                border: '1px solid #eee',
                borderRadius: '10px',
                padding: '14px',
                marginBottom: '10px',
                background: '#fff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong>{review.userName}</strong>
                <span style={{ color: '#20c997', fontWeight: '700' }}>{review.rating}/5</span>
              </div>
              <p style={{ margin: 0, color: '#555' }}>{review.comment}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '30px', border: '1px solid #eee', borderRadius: '12px', padding: '20px', background: '#fff' }}>
          <h3 style={{ marginBottom: '14px' }}>Write a Review</h3>
          <form onSubmit={handleSubmitReview}>
            <div style={{ marginBottom: '12px' }}>
              <label htmlFor="userName" style={{ display: 'block', marginBottom: '6px' }}>Your Name</label>
              <input
                id="userName"
                name="userName"
                value={reviewForm.userName}
                onChange={handleReviewChange}
                required
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label htmlFor="rating" style={{ display: 'block', marginBottom: '6px' }}>Rating</label>
              <select
                id="rating"
                name="rating"
                value={reviewForm.rating}
                onChange={handleReviewChange}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label htmlFor="comment" style={{ display: 'block', marginBottom: '6px' }}>Comment</label>
              <textarea
                id="comment"
                name="comment"
                rows="4"
                value={reviewForm.comment}
                onChange={handleReviewChange}
                required
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
              />
            </div>

            {submitError && <p style={{ color: '#d9534f' }}>{submitError}</p>}
            {submitSuccess && <p style={{ color: '#28a745' }}>{submitSuccess}</p>}

            <button type="submit" className="btn-add-cart" disabled={submitLoading}>
              {submitLoading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
