import React, { useEffect, useState, useMemo } from 'react';
import { getShopCategories, getShopProducts, ApiShopCategory, ApiShopProduct } from '../api/shopApi';
import { adaptApiShopProduct } from '../utils/shopAdapter';
import type { ShopProduct } from '../types/shop';
import ShopProductCard from '../components/ShopProductCard';
import './ShopPage.css';

export default function ShopPage() {
  const [categories, setCategories] = useState<ApiShopCategory[]>([]);
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getShopCategories(), getShopProducts()])
      .then(([apiCats, apiProds]) => {
        if (!isMounted) return;
        setCategories(apiCats);
        setProducts(apiProds.map(adaptApiShopProduct));
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Failed to load shop data from API:', err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const categoryPills = useMemo(() => {
    const list = ["ALL"];
    if (categories && categories.length > 0) {
      categories.forEach(c => list.push(c.name));
    }
    return list;
  }, [categories]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => p.published)
      .filter(p => activeCategory === "ALL" || p.category.toUpperCase() === activeCategory.toUpperCase())
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [products, activeCategory]);

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
          {categoryPills.map((cat) => (
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
        {loading ? (
          <div style={{ padding: '4rem 0', textAlign: 'center', opacity: 0.6 }}>Loading shop items...</div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ padding: '4rem 0', textAlign: 'center', opacity: 0.6 }}>No products found in this category.</div>
        ) : (
          <div className="shop-product-grid">
            {filteredProducts.map(product => (
              <ShopProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
