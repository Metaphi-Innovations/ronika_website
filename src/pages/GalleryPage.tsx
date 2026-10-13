import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { getGalleryCategories, getGalleryImages, GalleryCategoryData, GalleryImageData } from '../api/galleryApi';
import { getImageUrl } from '../utils/imageUrl';
import { useSite } from '../context/SiteContext';
import { isHtmlString, sanitizeRichText } from '../utils/richText';
import LightboxModal from '../components/LightboxModal';
import { MediaGridRenderer } from '../components/MediaGridRenderer';
import { useLiveResource } from '../context/LiveSyncContext';
import './GalleryPage.css';

export interface GalleryDisplayItem {
  id: string;
  src: string;
  caption: string;
  projectTitle: string;
  categoryName: string;
  categoryId?: string;
  projectSlug?: string;
  layouts?: any;
  layoutContexts?: Record<string, any>;
  aspectRatio?: number;
}

export default function GalleryPage() {
  const [categories, setCategories] = useState<GalleryCategoryData[]>([]);
  const [images, setImages] = useState<GalleryImageData[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const fetchGalleryData = useCallback(async () => {
    try {
      const [cats, imgs] = await Promise.all([getGalleryCategories(), getGalleryImages()]);
      setCategories(cats);
      setImages(imgs);
    } catch (err) {
      console.warn('Failed to load gallery data from CMS:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGalleryData();
  }, [fetchGalleryData]);

  // Live CMS Synchronization for Gallery and Categories
  useLiveResource(['gallery', 'galleryCategories'], () => {
    fetchGalleryData();
  });

  // Helper to reliably resolve category name and ID whether stored as string name, ID, or populated object
  const resolveCategoryDetails = useCallback((cat: any) => {
    if (!cat) return { name: 'Uncategorized', id: '' };
    if (typeof cat === 'object') {
      const found = categories.find(c => 
        String(c._id) === String(cat._id) || 
        c.name.toLowerCase() === (cat.name || '').toLowerCase()
      );
      if (found) return { name: found.name, id: String(found._id) };
      if (cat.name) return { name: cat.name, id: String(cat._id || '') };
    }
    if (typeof cat === 'string') {
      const trimmed = cat.trim();
      const found = categories.find(c => 
        String(c._id) === trimmed || 
        c.name.toLowerCase() === trimmed.toLowerCase()
      );
      if (found) return { name: found.name, id: String(found._id) };
      return { name: trimmed, id: trimmed };
    }
    return { name: 'Uncategorized', id: '' };
  }, [categories]);

  // Helper to resolve layout from layoutContexts with case-insensitivity and fallback to all/master
  const resolveLayout = useCallback((
    layoutContexts: Record<string, any> | undefined,
    contextKey: string,
    contextId?: string
  ) => {
    if (!layoutContexts || typeof layoutContexts !== 'object') return undefined;
    if (contextKey && layoutContexts[contextKey]) return layoutContexts[contextKey];
    if (contextId && layoutContexts[contextId]) return layoutContexts[contextId];
    if (contextKey) {
      const lower = contextKey.toLowerCase();
      const matchKey = Object.keys(layoutContexts).find(k => k.toLowerCase() === lower);
      if (matchKey && layoutContexts[matchKey]) return layoutContexts[matchKey];
    }
    return undefined;
  }, []);

  const displayItems: GalleryDisplayItem[] = useMemo(() => {
    if (!images || images.length === 0) return [];
    const validImages = images.filter(img => img.published !== false && !(img as any).isDraft);
    const sorted = [...validImages].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    return sorted.map((img) => {
      const catDetails = resolveCategoryDetails(img.category);
      return {
        id: img._id,
        src: getImageUrl(img.image?.url),
        caption: img.title || img.caption || 'Artwork',
        projectTitle: img.title || 'Artwork',
        categoryName: catDetails.name,
        categoryId: catDetails.id,
        projectSlug: img.projectSlug,
        layouts: img.layouts,
        layoutContexts: img.layoutContexts,
        aspectRatio: img.image?.aspectRatio,
      };
    });
  }, [images, categories, resolveCategoryDetails]);

  const filteredItems = useMemo(() => {
    let activeContextKey = "all";
    let activeCatId = "";
    if (activeCategory !== "ALL") {
      const matchedCat = categories.find(c => 
        String(c._id) === String(activeCategory) || 
        c.name.toLowerCase() === activeCategory.toLowerCase()
      );
      if (matchedCat) {
        activeContextKey = matchedCat.name;
        activeCatId = String(matchedCat._id);
      } else {
        activeContextKey = activeCategory;
        activeCatId = activeCategory;
      }
    }
    
    let itemsToFilter = displayItems;
    if (activeCategory !== "ALL") {
      itemsToFilter = displayItems.filter(item => {
        if (activeCatId && String(item.categoryId) === String(activeCatId)) return true;
        if (activeCategory && String(item.categoryId) === String(activeCategory)) return true;
        if (item.categoryName.toLowerCase() === activeCategory.toLowerCase()) return true;
        if (activeContextKey && item.categoryName.toLowerCase() === activeContextKey.toLowerCase()) return true;
        return false;
      });
    }

    return itemsToFilter.map(item => {
      let resolvedLayout = undefined;
      if (activeCategory === "ALL") {
        resolvedLayout = resolveLayout(item.layoutContexts, 'all') || item.layouts;
      } else {
        // Use category's exact saved layout, fallback to 'all' layout, then item.layouts
        resolvedLayout = resolveLayout(item.layoutContexts, activeContextKey, activeCatId)
          || resolveLayout(item.layoutContexts, 'all')
          || item.layouts;
      }

      return {
        ...item,
        layouts: resolvedLayout
      };
    });
  }, [displayItems, activeCategory, categories, resolveLayout]);

  const categoryPills = useMemo(() => {
    const list = [{ id: 'ALL', name: 'ALL' }];
    if (categories && categories.length > 0) {
      categories.forEach(c => list.push({ id: c._id, name: c.name.toUpperCase() }));
    }
    return list;
  }, [categories]);

  const lightboxImages = useMemo(() => {
    return filteredItems.map(item => ({
      src: item.src,
      title: item.caption,
      projectSlug: item.projectSlug
    }));
  }, [filteredItems]);

  const { settings } = useSite();

  const headerContent = settings?.galleryHeader || '';
  const isHeaderHtml = isHtmlString(headerContent);
  const sanitizedHeader = isHeaderHtml ? sanitizeRichText(headerContent) : headerContent;


  return (
    <main className="psycolops-gallery-page animate-fade-in">
      <section className="psycolops-gallery-section">
        <div className="container">

          {/* Dynamic Header Subtitle */}
          {headerContent && (
            <div className="gallery-header-block">
              {isHeaderHtml ? (
                <h2
                  className="gallery-subtitle-text"
                  dangerouslySetInnerHTML={{ __html: sanitizedHeader }}
                />
              ) : (
                <h2 className="gallery-subtitle-text">
                  {headerContent}
                </h2>
              )}
            </div>
          )}

          {/* Filter Pills Row */}
          <div className="gallery-filter-pills-row">
            {categoryPills.map((cat) => (
              <button
                key={cat.id}
                className={`gallery-filter-pill ${activeCategory === cat.id || activeCategory === cat.name ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Grid Rendering with React Grid Layout */}
          {loading ? (
            <div style={{ padding: '4rem 0', textAlign: 'center', opacity: 0.6 }}>Loading gallery...</div>
          ) : filteredItems.length === 0 ? (
            <div style={{ padding: '4rem 0', textAlign: 'center', opacity: 0.6 }}>No images found in this category.</div>
          ) : (
            <div className="psycolops-gallery-wall">
              <MediaGridRenderer 
                items={filteredItems.map(item => ({
                  id: item.id,
                  url: item.src,
                  caption: item.caption,
                  layouts: item.layouts,
                  aspectRatio: item.aspectRatio
                }))} 
                preserveLayout={true}
                onItemClick={(idx) => setLightboxIndex(idx)}
              />
            </div>
          )}

        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <LightboxModal
          isOpen={lightboxIndex !== null}
          currentIndex={lightboxIndex}
          images={lightboxImages}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(newIndex) => setLightboxIndex(newIndex)}
        />
      )}
    </main>
  );
}
