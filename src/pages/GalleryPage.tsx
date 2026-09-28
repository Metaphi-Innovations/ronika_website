import React, { useEffect, useState, useMemo } from 'react';
import { getGalleryCategories, getGalleryImages, GalleryCategoryData, GalleryImageData } from '../api/galleryApi';
import { getImageUrl } from '../utils/imageUrl';
import { useSite } from '../context/SiteContext';
import { isHtmlString, sanitizeRichText } from '../utils/richText';
import LightboxModal from '../components/LightboxModal';
import './GalleryPage.css';

export interface GalleryDisplayItem {
  id: string;
  src: string;
  caption: string;
  projectTitle: string;
  categoryName: string;
  categoryId?: string;
  projectSlug?: string;
}

export default function GalleryPage() {
  const [categories, setCategories] = useState<GalleryCategoryData[]>([]);
  const [images, setImages] = useState<GalleryImageData[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getGalleryCategories(), getGalleryImages()])
      .then(([cats, imgs]) => {
        if (!isMounted) return;
        setCategories(cats);
        setImages(imgs);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Failed to load gallery data from CMS:', err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const displayItems: GalleryDisplayItem[] = useMemo(() => {
    if (!images || images.length === 0) return [];
    const sorted = [...images].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    return sorted.map((img) => {
      const catObj = typeof img.category === 'object' && img.category ? img.category : null;
      const catName = catObj ? catObj.name : 'Gallery';
      const catId = catObj ? catObj._id : (typeof img.category === 'string' ? img.category : '');
      return {
        id: img._id,
        src: getImageUrl(img.image?.url),
        caption: img.title || img.caption || 'Artwork',
        projectTitle: img.title || 'Artwork',
        categoryName: catName,
        categoryId: catId,
        projectSlug: img.projectSlug,
      };
    });
  }, [images]);

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

  // Responsive Column Count (Desktop: 3, Tablet: 2, Mobile: 1)
  const [columnCount, setColumnCount] = useState<number>(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setColumnCount(1);
      } else if (window.innerWidth <= 1024) {
        setColumnCount(2);
      } else {
        setColumnCount(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const masonryColumns = useMemo(() => {
    const cols: Array<Array<{ item: GalleryDisplayItem; globalIndex: number }>> = Array.from(
      { length: columnCount },
      () => []
    );
    filteredItems.forEach((item, globalIndex) => {
      cols[globalIndex % columnCount].push({ item, globalIndex });
    });
    return cols;
  }, [filteredItems, columnCount]);

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

          {/* 3-Column Masonry Exhibition Wall (1 2 3, 4 5 6, 7 8 9... Left to Right) */}
          {loading ? (
            <div style={{ padding: '4rem 0', textAlign: 'center', opacity: 0.6 }}>Loading gallery...</div>
          ) : filteredItems.length === 0 ? (
            <div style={{ padding: '4rem 0', textAlign: 'center', opacity: 0.6 }}>No images found in this category.</div>
          ) : (
            <div className="psycolops-gallery-wall">
              {masonryColumns.map((colGroup, colIdx) => (
                <div key={colIdx} className="gallery-masonry-column">
                  {colGroup.map(({ item, globalIndex }) => (
                    <div
                      key={item.id}
                      className="gallery-wall-card"
                      onClick={() => setLightboxIndex(globalIndex)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="gallery-card-frame">
                        <img
                          src={item.src}
                          alt={item.caption}
                          loading="lazy"
                          className="gallery-card-img"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
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
