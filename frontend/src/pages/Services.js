import React from 'react';
import { Link } from 'react-router-dom';

function Services() {
  const servicesList = [
    { 
      name: 'Return Gifts', 
      desc: 'Perfect party favors and return gifts for birthdays, weddings, and special occasions.',
      color: '#FF6B6B',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&h=200&fit=crop'
    },
    { 
      name: 'Customized Mugs', 
      desc: 'Personalized mugs with photos, names, and custom designs for memorable gifts.',
      color: '#4ECDC4',
      image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=200&h=200&fit=crop'
    },
    { 
      name: 'Customized Water Bottles', 
      desc: 'Durable, stylish water bottles with custom prints perfect for schools and events.',
      color: '#45B7D1',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&h=200&fit=crop'
    },
    { 
      name: 'Customized Keychains', 
      desc: 'Unique keychains with names, photos, or custom designs - great for bulk orders.',
      color: '#96CEB4',
      icon: '🔑'
    },
    { 
      name: 'Bags', 
      desc: 'Quality bags in various sizes and designs for gifting and daily use.',
      color: '#DDA0DD',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop'
    },
    { 
      name: 'Stationary Items', 
      desc: 'Complete stationary sets including pencils, erasers, geometry boxes, and more.',
      color: '#FFD93D',
      image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=200&h=200&fit=crop'
    },
    { 
      name: 'Colouring Books', 
      desc: 'Fun and engaging coloring books for kids of all ages with various themes.',
      color: '#FF8C42',
      image: 'https://images.unsplash.com/photo-1560421683-6856ea585c78?w=200&h=200&fit=crop'
    },
    { 
      name: 'Painting Books', 
      desc: 'Creative painting and art books to inspire young artists.',
      color: '#6C5CE7',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200&h=200&fit=crop'
    },
    { 
      name: 'Piggy Banks', 
      desc: 'Adorable piggy banks in fun shapes and colors to encourage saving habits.',
      color: '#FDA7DF',
      icon: '🐷'
    },
    { 
      name: 'Frames', 
      desc: 'Beautiful photo frames for preserving precious memories.',
      color: '#A8E6CF',
      image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&h=200&fit=crop'
    },
    { 
      name: 'Customized Chocolates', 
      desc: 'Delicious chocolates with personalized wrappers - perfect for any celebration.',
      color: '#D4A574',
      image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=200&h=200&fit=crop'
    },
    { 
      name: 'Medals & Badges', 
      desc: 'Custom engraved medals and badges for awards and recognition.',
      color: '#FFD700',
      icon: '🏅'
    }
  ];

  const features = [
    { title: 'Fast Delivery', desc: 'Quick turnaround on all orders', icon: '🚀' },
    { title: 'Premium Quality', desc: 'Best materials and craftsmanship', icon: '⭐' },
    { title: 'Affordable Prices', desc: 'Competitive rates for bulk orders', icon: '💰' },
    { title: 'Custom Designs', desc: 'Personalized to your requirements', icon: '🎨' }
  ];

  return (
    <section className="section services">
      <div className="section-inner">
        <h2 className="section-title">Our Services</h2>
        <p className="section-subtitle">
          We offer a wide range of customized gifts and return gift solutions for all your celebrations
        </p>

        {/* Features Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '50px',
          padding: '30px',
          background: 'linear-gradient(135deg, #FF2A0A, #C81D00)',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(255, 42, 10, 0.3)'
        }}>
          {features.map((feature, index) => (
            <div key={index} style={{
              textAlign: 'center',
              color: '#fff'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px',
                fontSize: '2rem'
              }}>
                {feature.icon}
              </div>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', fontWeight: '700' }}>{feature.title}</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Services Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '25px',
          marginBottom: '50px'
        }}>
          {servicesList.map((service, index) => (
            <div key={index} style={{
              background: '#fff',
              borderRadius: '15px',
              padding: '25px',
              boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              border: '2px solid transparent',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(255, 42, 10, 0.2)';
              e.currentTarget.style.borderColor = '#FF2A0A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.08)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
            >
              {/* Colored accent bar */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: service.color
              }}></div>
              
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '20px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                background: service.icon ? service.color : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem'
              }}>
                {service.icon ? (
                  service.icon
                ) : (
                  <img 
                    src={service.image} 
                    alt={service.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                )}
              </div>
              
              <h3 style={{
                margin: '0 0 12px 0',
                fontSize: '1.3rem',
                fontWeight: '700',
                color: '#222'
              }}>{service.name}</h3>
              
              <p style={{
                margin: 0,
                color: '#666',
                fontSize: '0.95rem',
                lineHeight: '1.6'
              }}>{service.desc}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div style={{
          textAlign: 'center',
          padding: '50px 30px',
          background: 'linear-gradient(135deg, #FFF5F2, #FFE8E3)',
          borderRadius: '20px',
          border: '2px dashed #FF2A0A'
        }}>
          <h3 style={{
            fontSize: '2rem',
            color: '#222',
            marginBottom: '15px',
            fontWeight: '700'
          }}>
            Need Bulk Orders?
          </h3>
          <p style={{
            fontSize: '1.1rem',
            color: '#555',
            marginBottom: '25px',
            maxWidth: '600px',
            margin: '0 auto 25px'
          }}>
            We specialize in bulk orders for schools, events, and corporate functions. 
            Get special discounts on large quantities!
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" style={{
              display: 'inline-block',
              padding: '15px 35px',
              background: 'linear-gradient(135deg, #FF2A0A, #C81D00)',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '30px',
              fontWeight: '700',
              fontSize: '1.1rem',
              boxShadow: '0 5px 20px rgba(255, 42, 10, 0.4)',
              transition: 'all 0.3s ease'
            }}>
              Contact Us
            </Link>
            <Link to="/products" style={{
              display: 'inline-block',
              padding: '15px 35px',
              background: '#fff',
              color: '#FF2A0A',
              textDecoration: 'none',
              borderRadius: '30px',
              fontWeight: '700',
              fontSize: '1.1rem',
              border: '2px solid #FF2A0A',
              transition: 'all 0.3s ease'
            }}>
              View Products
            </Link>
          </div>
        </div>

        {/* Why Choose Us */}
        <div style={{ marginTop: '50px' }}>
          <h3 style={{
            textAlign: 'center',
            fontSize: '1.8rem',
            color: '#222',
            marginBottom: '30px',
            fontWeight: '700'
          }}>
            Why Choose Ritzy?
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {[
              { text: 'Wide variety of gift options', image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=60&h=60&fit=crop' },
              { text: 'Full customization available', image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=60&h=60&fit=crop' },
              { text: 'Bulk order specialists', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=60&h=60&fit=crop' },
              { text: 'Trusted by 500+ customers', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop' },
              { text: 'Pan-India delivery', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=60&h=60&fit=crop' },
              { text: '100% satisfaction guarantee', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=60&h=60&fit=crop' }
            ].map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '20px',
                background: '#fff',
                borderRadius: '10px',
                boxShadow: '0 3px 10px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0'
              }}>
                <img 
                  src={item.image} 
                  alt={item.text}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '8px',
                    objectFit: 'cover'
                  }}
                />
                <span style={{ fontSize: '1rem', color: '#333', fontWeight: '500' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
