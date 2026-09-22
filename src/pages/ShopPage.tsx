import React, { useState } from 'react';
import { SHOP_CATEGORIES, SHOP_PRODUCTS } from '../data/shop';
import ShopProductCard from '../components/ShopProductCard';
import './ShopPage.css';

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const categories = ["ALL", ...SHOP_CATEGORIES.map(c => c.name)];

  const filteredProducts = SHOP_PRODUCTS
    .filter(p => p.published)
    .filter(p => activeCategory === "ALL" || p.category === activeCategory)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <main className="shop-page animate-fade-in">
      <div className="container shop-container">
        
        {/* Shop Page Header */}
        <header className="shop-header">
          <h1 className="heading-1 shop-page-title">Curated Prints &amp; Objects</h1>
          <p className="shop-page-subtitle">
            A curated selection of original artworks, limited edition prints, and exclusive objects.
          </p>
        </header>

        {/* Horizontal Category Filters */}
        <div className="shop-filter-pills-row">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`shop-filter-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Single Product Grid */}
        <div className="shop-product-grid">
          {filteredProducts.map(product => (
            <ShopProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </main>
  );
}
