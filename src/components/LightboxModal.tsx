import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import './LightboxModal.css';

export interface LightboxImageItem {
  src: string;
  caption?: string;
  projectTitle?: string;
}

export interface LightboxModalProps {
  images?: Array<string | LightboxImageItem>;
  currentIndex?: number;
  isOpen?: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export default function LightboxModal({
  images = [],
  currentIndex = 0,
  isOpen = false,
  onClose,
  onNavigate
}: LightboxModalProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onNavigate((currentIndex - 1 + images.length) % images.length);
      } else if (e.key === 'ArrowRight') {
        onNavigate((currentIndex + 1) % images.length);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  if (!isOpen || !images || images.length === 0) return null;

  const currentItem = images[currentIndex];
  const imageSrc = typeof currentItem === 'string' ? currentItem : currentItem?.src;
  const caption = typeof currentItem === 'object' ? currentItem?.caption : undefined;

  const formattedCurrent = String(currentIndex + 1).padStart(2, '0');
  const formattedTotal = String(images.length).padStart(2, '0');

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(false);
    onNavigate((currentIndex - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(false);
    onNavigate((currentIndex + 1) % images.length);
  };

  const toggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(!isZoomed);
  };

  return createPortal(
    <div className="lightbox-overlay" onClick={onClose}>
      {/* Lightbox Top Control Bar */}
      <div className="lightbox-top-bar" onClick={(e) => e.stopPropagation()}>
        <div className="lightbox-counter font-mono">
          <span>{formattedCurrent}</span> / <span>{formattedTotal}</span>
        </div>

        <div className="lightbox-actions">
          <button className="lightbox-btn" onClick={toggleZoom} title={isZoomed ? "Zoom out" : "Zoom in"}>
            {isZoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
          </button>
          <button className="lightbox-btn close-btn" onClick={onClose} title="Close (ESC)">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Image View Stage */}
      <div className="lightbox-stage" onClick={(e) => e.stopPropagation()}>
        {images.length > 1 && (
          <button className="lightbox-nav-btn nav-prev" onClick={handlePrev} title="Previous image (Left Arrow)">
            <ChevronLeft size={28} />
          </button>
        )}

        <div className={`lightbox-image-wrapper ${isZoomed ? 'zoomed' : ''}`} onClick={toggleZoom}>
          <img 
            src={imageSrc} 
            alt={caption || `Artwork ${formattedCurrent} of ${formattedTotal}`}
            className="lightbox-image" 
          />
        </div>

        {images.length > 1 && (
          <button className="lightbox-nav-btn nav-next" onClick={handleNext} title="Next image (Right Arrow)">
            <ChevronRight size={28} />
          </button>
        )}
      </div>

      {/* Lightbox Caption Bar */}
      {caption && (
        <div className="lightbox-caption-bar" onClick={(e) => e.stopPropagation()}>
          <span className="lightbox-caption">{caption}</span>
        </div>
      )}
    </div>,
    document.body
  );
}
