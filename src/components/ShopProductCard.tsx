import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopProduct } from '../types/shop';
import './ShopProductCard.css';

interface ShopProductCardProps {
  product: ShopProduct;
}

export default function ShopProductCard({ product }: ShopProductCardProps) {
  const navigate = useNavigate();

  const handleShopNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/shop/enquiry/${product.slug}`);
  };

  const handleViewMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/shop/${product.slug}`);
  };

  return (
    <div className="shop-product-wrapper">
      <div className="shop-product-card-container">
        <div className="shop-product-card-inner">
          {/* FRONT (Image) */}
          <div className="shop-product-card-front">
            <img 
              src={product.mainImage} 
              alt={product.name} 
              loading="lazy"
              className="shop-product-image"
            />
          </div>
          
          {/* BACK (Details) */}
          <div className="shop-product-card-back">
            <div className="shop-product-back-content">
              <h3 className="shop-product-name">{product.name}</h3>
              <p className="shop-product-short-desc">{product.shortDescription}</p>
            </div>
            
            {/* Actions (Inside flip area) */}
            <div className="shop-product-actions">
              <button className="btn-shop-action btn-shop-primary" onClick={handleShopNow}>
                Shop Now
              </button>
              <button className="btn-shop-action btn-shop-secondary" onClick={handleViewMore}>
                View More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
