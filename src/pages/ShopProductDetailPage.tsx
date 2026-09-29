import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShopProductBySlug } from '../api/shopApi';
import { adaptApiShopProduct } from '../utils/shopAdapter';
import type { ShopProduct } from '../types/shop';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import './ShopProductDetailPage.css';

export default function ShopProductDetailPage() {
  const { productSlug } = useParams<{ productSlug: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<ShopProduct | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productSlug) return;
    let isMounted = true;
    setLoading(true);

    getShopProductBySlug(productSlug)
      .then((apiProd) => {
        if (!isMounted) return;
        setProduct(adaptApiShopProduct(apiProd));
        setActiveImageIndex(0);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Failed to load product details:', err);
        if (isMounted) {
          setError('Product not found');
          setLoading(false);
        }
      });

    window.scrollTo(0, 0);
    return () => { isMounted = false; };
  }, [productSlug]);

  const handlePrevImage = useCallback(() => {
    if (!product || product.images.length <= 1) return;
    setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  }, [product]);

  const handleNextImage = useCallback(() => {
    if (!product || product.images.length <= 1) return;
    setActiveImageIndex((prev) => (prev + 1) % product.images.length);
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevImage, handleNextImage]);

  if (loading) {
    return (
      <main className="shop-detail-page shop-not-found animate-fade-in">
        <div className="container" style={{ padding: '6rem 0', textAlign: 'center', opacity: 0.6 }}>
          <p>Loading product details...</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="shop-detail-page shop-not-found animate-fade-in">
        <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
          <h1 className="heading-1">Product Not Found</h1>
          <button className="btn-shop-secondary" onClick={() => navigate('/shop')} style={{ marginTop: '1.5rem' }}>
            Return to Shop
          </button>
        </div>
      </main>
    );
  }

  const handleEnquiry = () => {
    navigate(`/shop/enquiry/${product.slug}`);
  };

  const detailsList: { label: string; value: string }[] = [];
  if (product.details) {
    if (product.details.medium) detailsList.push({ label: 'Medium', value: product.details.medium });
    if (product.details.dimensions) detailsList.push({ label: 'Dimensions', value: product.details.dimensions });
    if (product.details.materials) detailsList.push({ label: 'Materials', value: product.details.materials });
    if (product.details.year) detailsList.push({ label: 'Year', value: product.details.year });
    if (product.details.availability) detailsList.push({ label: 'Availability', value: product.details.availability });
  }

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

            {/* Left & Right Navigation Arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  type="button"
                  className="shop-detail-arrow-btn prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  aria-label="Previous image"
                  title="Previous image"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  className="shop-detail-arrow-btn next"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  aria-label="Next image"
                  title="Next image"
                >
                  <ChevronRight size={22} />
                </button>

                {/* Subtle Image Counter Badge */}
                <div className="shop-detail-image-counter">
                  {activeImageIndex + 1} / {product.images.length}
                </div>
              </>
            )}
          </div>

          {/* RIGHT: Product Information */}
          <div className="shop-detail-info">
            <div className="shop-detail-header">
              <span className="shop-detail-category">{product.category}</span>
              <h1 className="shop-detail-title">{product.name}</h1>
            </div>

            <div className="shop-detail-description">
              <p>{product.description || product.shortDescription}</p>
            </div>

            {/* Authentic CMS Product Details & Bullet Points */}
            {(detailsList.length > 0 || (product.details?.bulletPoints && product.details.bulletPoints.length > 0)) && (
              <div className="shop-detail-features">
                <ul>
                  {detailsList.map((item, idx) => (
                    <li key={`detail-${idx}`}><strong>{item.label}:</strong> {item.value}</li>
                  ))}
                  {product.details?.bulletPoints?.map((point, idx) => (
                    <li key={`bullet-${idx}`}>{point}</li>
                  ))}
                </ul>
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
