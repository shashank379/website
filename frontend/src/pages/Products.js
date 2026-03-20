import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import { normalizeProduct, resolveProductImageUrl } from '../utils/productMapper';
import { fetchJson } from '../utils/apiClient';

function Products({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageIndex, setImageIndex] = useState({});
  const [modalProduct, setModalProduct] = useState(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '', productName: '' });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');
        console.log('[Products] Fetching:', `${API_BASE_URL}/products`);
        const { data } = await fetchJson(`${API_BASE_URL}/products`);
        console.log('[Products] API response count:', data?.count ?? 0);

        const normalized = (data.products || []).map(normalizeProduct);
        setProducts(normalized);
      } catch (err) {
        console.error('[Products] Fetch failed:', err);
        setError(err.message || 'Unable to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const showToast = (productName, price) => {
    setToast({ show: true, message: `Added to cart at ₹${price}!`, productName });
    setTimeout(() => {
      setToast({ show: false, message: '', productName: '' });
    }, 2000);
  };

  const handleAddToCart = (product) => {
    const cartItem = {
      ...product,
      productId: product.id,
      price: product.discountedPrice,
      amount: product.discountedPrice
    };
    addToCart(cartItem);
    showToast(product.name, product.discountedPrice);
    closeModal();
  };

  const nextImage = (productId, images) => {
    setImageIndex(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % images.length
    }));
  };

  const prevImage = (productId, images) => {
    setImageIndex(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + images.length) % images.length
    }));
  };

  const openModal = (product) => {
    setModalProduct(product);
    setModalImageIndex(0);
  };

  const closeModal = () => {
    setModalProduct(null);
    setModalImageIndex(0);
  };

  const nextModalImage = () => {
    if (modalProduct.images && modalProduct.images.length > 0) {
      setModalImageIndex((prev) => (prev + 1) % modalProduct.images.length);
    }
  };

  const prevModalImage = () => {
    if (modalProduct.images && modalProduct.images.length > 0) {
      setModalImageIndex((prev) => (prev - 1 + modalProduct.images.length) % modalProduct.images.length);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'linear-gradient(135deg, #28a745, #20c997)',
          color: '#fff',
          padding: '15px 25px',
          borderRadius: '10px',
          boxShadow: '0 8px 25px rgba(40, 167, 69, 0.4)',
          zIndex: 10001,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'slideIn 0.3s ease-out',
          maxWidth: '350px'
        }}>
          <span style={{ fontSize: '1.5rem' }}>✅</span>
          <div>
            <div style={{ fontWeight: '700', fontSize: '1rem' }}>{toast.productName}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>{toast.message}</div>
          </div>
        </div>
      )}

      {/* Add animation keyframes */}
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>

      {modalProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            position: 'relative',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '80vw',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <button onClick={closeModal} style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '20px',
              cursor: 'pointer'
            }}>×</button>
            
            <div style={{ position: 'relative', marginBottom: '15px' }}>
              <img 
                src={resolveProductImageUrl(modalProduct.images && modalProduct.images.length > 0 ? modalProduct.images[modalImageIndex] : modalProduct.image)}
                alt={modalProduct.name}
                style={{ maxHeight: '60vh', maxWidth: '70vw', objectFit: 'contain' }}
              />
              {modalProduct.images && modalProduct.images.length > 1 && (
                <>
                  <button onClick={prevModalImage} style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(23, 162, 184, 0.9)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    fontSize: '18px',
                    cursor: 'pointer'
                  }}>❮</button>
                  <button onClick={nextModalImage} style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(23, 162, 184, 0.9)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    fontSize: '18px',
                    cursor: 'pointer'
                  }}>❯</button>
                  <span style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '3px',
                    fontSize: '14px'
                  }}>{modalImageIndex + 1}/{modalProduct.images.length}</span>
                </>
              )}
            </div>

            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <h2>{modalProduct.name}</h2>
              <p>{modalProduct.desc}</p>
              <div style={{ fontSize: '18px', marginBottom: '10px' }}>
                <span style={{
                  textDecoration: 'line-through',
                  color: '#999',
                  marginRight: '10px',
                  fontSize: '16px'
                }}>₹{modalProduct.originalPrice}</span>
                <span style={{
                  color: '#20c997',
                  fontWeight: 'bold',
                  fontSize: '20px'
                }}>₹{modalProduct.discountedPrice}</span>
              </div>
              <button
                style={{
                  background: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
                onClick={() => {
                  handleAddToCart(modalProduct);
                  closeModal();
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="section products">
        <div className="section-inner">
          <h2 className="section-title">Our Products</h2>
          <p className="section-subtitle">Browse our curated range. Most items can be customized!</p>

          {loading && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#555' }}>
              Loading products...
            </div>
          )}

          {error && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#d9534f' }}>
              {error}
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#777' }}>
              No products found.
            </div>
          )}

          <div className="product-grid">
            {products.map((product) => {
              const currentImageIndex = imageIndex[product.id] || 0;
              const displayImage = product.images && product.images.length > 0 ? product.images[currentImageIndex] : product.image;
              const hasMultipleImages = product.images && product.images.length > 1;
              
              return (
                <div key={product.id} className="product-card">
                  <div className="image-container" style={{ position: 'relative', cursor: 'pointer' }} onClick={() => openModal(product)}>
                    <img src={resolveProductImageUrl(displayImage)} alt={product.name} />
                    {hasMultipleImages && (
                      <>
                        <button 
                          className="carousel-btn prev-btn" 
                          onClick={(e) => { e.stopPropagation(); prevImage(product.id, product.images); }}
                          style={{ position: 'absolute', left: '5px', top: '50%', transform: 'translateY(-50%)' }}
                        >
                          ❮
                        </button>
                        <button 
                          className="carousel-btn next-btn" 
                          onClick={(e) => { e.stopPropagation(); nextImage(product.id, product.images); }}
                          style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)' }}
                        >
                          ❯
                        </button>
                        <span className="image-counter" style={{ position: 'absolute', bottom: '5px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 6px', borderRadius: '3px', fontSize: '12px' }}>
                          {currentImageIndex + 1}/{product.images.length}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="info">
                    <h3>{product.name}</h3>
                    <p>{product.desc}</p>
                    <div className="price" style={{ cursor: 'pointer' }}>
                      <span style={{
                        textDecoration: 'line-through',
                        color: '#999',
                        marginRight: '10px'
                      }}>₹{product.originalPrice}</span>
                      <span style={{
                        color: '#20c997',
                        fontWeight: 'bold'
                      }}>₹{product.discountedPrice}</span>
                    </div>
                    <button
                      className="btn-add-cart"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                    <Link
                      to={`/products/${product.id}`}
                      style={{
                        display: 'inline-block',
                        marginTop: '10px',
                        color: '#17a2b8',
                        fontWeight: '600',
                        textDecoration: 'none'
                      }}
                    >
                      View Details & Reviews
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

export default Products;
