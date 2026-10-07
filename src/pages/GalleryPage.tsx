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

  const displayItems: GalleryDisplayItem[] = useMemo(() => {
    if (!images || images.length === 0) return [];
    const sorted = [...images].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    return sorted.map((img) => {
      const catObj = typeof img.category === 'object' && img.category ? img.category : null;
      const catId = catObj ? catObj._id : (typeof img.category === 'string' ? img.category : '');
      const matchedCat = categories.find((c) => String(c._id) === String(catId) || c.name === String(catId));
      const catName = matchedCat?.name || 'Gallery';
      const resolvedCatId = matchedCat ? matchedCat._id : '';
      return {
        id: img._id,
        src: getImageUrl(img.image?.url),
        caption: img.title || img.caption || 'Artwork',
        projectTitle: img.title || 'Artwork',
        categoryName: catName,
        categoryId: resolvedCatId,
        projectSlug: img.projectSlug,
        layouts: img.layouts,
      };
    });
  }, [images, categories]);

  const filteredItems = useMemo(() => {
    if (activeCategory === "ALL") return displayItems;
    return displayItems.filter(item => {
      if (item.categoryId && item.categoryId === activeCategory) return true;
      return item.categoryName.toUpperCase() === activeCategory.toUpperCase();
    });
  }, [displayItems, activeCategory]);

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
              <MediaGridRenderer items={filteredItems.map(item => ({
                id: item.id,
                url: item.src,
                layouts: item.layouts
              }))} />
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
