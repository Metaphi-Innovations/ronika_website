import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SHOP_PRODUCTS } from '../data/shop';
import { ArrowLeft } from 'lucide-react';
import './ShopProductDetailPage.css';

export default function ShopProductDetailPage() {
  const { productSlug } = useParams<{ productSlug: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(SHOP_PRODUCTS.find(p => p.slug === productSlug));
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const found = SHOP_PRODUCTS.find(p => p.slug === productSlug);
    setProduct(found);
    setActiveImageIndex(0);
    window.scrollTo(0, 0);
  }, [productSlug]);

  if (!product) {
    return (
      <main className="shop-detail-page shop-not-found animate-fade-in">
        <div className="container">
          <h1 className="heading-1">Product Not Found</h1>
          <button className="btn-shop-secondary" onClick={() => navigate('/shop')}>
            Return to Shop
          </button>
        </div>
      </main>
    );
  }

  const handleEnquiry = () => {
    navigate(`/shop/enquiry/${product.slug}`);
  };

  return (
    <main className="shop-detail-page animate-fade-in">
      <div className="container shop-detail-container">
        
        {/* Breadcrumb / Back */}
        <button className="shop-back-btn" onClick={() => navigate('/shop')}>
          <ArrowLeft size={20} /> Back to Shop
        </button>

        <div className="shop-detail-layout">
          
          {/* LEFT: Thumbnails */}
          <div className="shop-detail-thumbnails">
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                className={`shop-thumbnail-btn ${idx === activeImageIndex ? 'active' : ''}`}
                onClick={() => setActiveImageIndex(idx)}
                aria-label={`View image ${idx + 1}`}
              >
                <img 
                  src={img.src} 
                  alt={img.alt || `Thumbnail ${idx + 1}`} 
                  loading="lazy"
                />
              </button>
            ))}
          </div>

          {/* CENTER: Main Image */}
          <div className="shop-detail-main-image-wrapper">
            <img 
              src={product.images[activeImageIndex]?.src || product.mainImage}
              alt={product.images[activeImageIndex]?.alt || product.name}
              className="shop-detail-main-image"
            />
          </div>

          {/* RIGHT: Product Information */}
          <div className="shop-detail-info">
            <div className="shop-detail-header">
              <span className="shop-detail-category">{product.category}</span>
              <h1 className="shop-detail-title">{product.name}</h1>
            </div>

            <div className="shop-detail-description">
              <p>{product.description}</p>
            </div>

            {/* Optional Details Rendering */}
            {product.details && (
              <div className="shop-detail-meta">
                {product.details.medium && (
                  <div className="shop-meta-row">
                    <span className="shop-meta-label">Medium</span>
                    <span className="shop-meta-value">{product.details.medium}</span>
                  </div>
                )}
                {product.details.dimensions && (
                  <div className="shop-meta-row">
                    <span className="shop-meta-label">Dimensions</span>
                    <span className="shop-meta-value">{product.details.dimensions}</span>
                  </div>
                )}
                {product.details.materials && (
                  <div className="shop-meta-row">
                    <span className="shop-meta-label">Materials</span>
                    <span className="shop-meta-value">{product.details.materials}</span>
                  </div>
                )}
                {product.details.year && (
                  <div className="shop-meta-row">
                    <span className="shop-meta-label">Year</span>
                    <span className="shop-meta-value">{product.details.year}</span>
                  </div>
                )}
                {product.details.availability && (
                  <div className="shop-meta-row">
                    <span className="shop-meta-label">Availability</span>
                    <span className="shop-meta-value">{product.details.availability}</span>
                  </div>
                )}
              </div>
            )}

            <button className="btn-shop-primary shop-detail-cta" onClick={handleEnquiry}>
              Shop Now
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
