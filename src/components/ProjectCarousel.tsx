import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Project } from '../types/portfolio';
import './ProjectCarousel.css';

interface ProjectCarouselProps {
  projects: Project[];
  title?: string;
}

export default function ProjectCarousel({ 
  projects, 
  title = "See more work:" 
}: ProjectCarouselProps) {
  if (!projects || projects.length === 0) return null;

  const realCount = projects.length;
  // Clone 3 at start and 3 at end for seamless infinite looping of 3-card view
  const extendedProjects = [
    ...projects.slice(-3),
    ...projects,
    ...projects.slice(0, 3)
  ];

  // Index 3 corresponds to index 0 of original projects
  const [currentIndex, setCurrentIndex] = useState(3);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const isAnimatingRef = useRef(false);

  const handlePrev = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleTransitionEnd = () => {
    isAnimatingRef.current = false;
    // If we moved past the last real item (into right clones)
    if (currentIndex >= realCount + 3) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - realCount);
    }
    // If we moved before the first real item (into left clones)
    else if (currentIndex < 3) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + realCount);
    }
  };

  // Re-enable transition after instant index position reset
  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  // Auto-slide functionality
  useEffect(() => {
    if (realCount <= 3) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4000); // Auto-slide every 4 seconds

    return () => clearInterval(interval);
  }, [realCount, currentIndex, isTransitioning]);

  return (
    <section className="project-carousel-section">
      <div className="container">
        
        {/* Header Title */}
        <div className="carousel-header">
          <h3 className="carousel-title">{title}</h3>
        </div>

        {/* Carousel Container with Side Navigation Arrows */}
        <div className="carousel-wrapper">
          
          {/* Side Floating Left Arrow */}
          {realCount > 3 && (
            <button 
              type="button"
              className="carousel-side-arrow arrow-left" 
              onClick={handlePrev}
              aria-label="Previous projects"
            >
              <ChevronLeft size={26} strokeWidth={2.5} />
            </button>
          )}

          {/* Sliding Viewport */}
          <div className="carousel-viewport">
            <div 
              className="carousel-track"
              style={{
                transform: realCount <= 3 ? 'none' : `translateX(calc(-${currentIndex} * (100% / 3 + 10px)))`,
                transition: isTransitioning && realCount > 3 ? 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
                justifyContent: realCount <= 3 ? 'center' : 'flex-start'
              }}
              onTransitionEnd={realCount > 3 ? handleTransitionEnd : undefined}
            >
              {(realCount <= 3 ? projects : extendedProjects).map((proj, idx) => (
                <Link 
                  key={`${proj.id}-${realCount <= 3 ? 'real' : 'clone'}-${idx}`} 
                  to={`/project/${proj.slug}`} 
                  className="carousel-card"
                >
                  <div className="carousel-card-visual">
                    <img 
                      src={proj.heroImage} 
                      alt={proj.title} 
                      className="carousel-card-img"
                    />
                  </div>
                  <div className="carousel-card-info">
                    <div className="carousel-card-title-row">
                      <span className="carousel-card-bar" />
                      <h4 className="carousel-card-title">
                        {proj.title} <span className="carousel-card-category-tag">({proj.category.split('&')[0].trim()})</span>
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Side Floating Right Arrow */}
          {realCount > 3 && (
            <button 
              type="button"
              className="carousel-side-arrow arrow-right" 
              onClick={handleNext}
              aria-label="Next projects"
            >
              <ChevronRight size={26} strokeWidth={2.5} />
            </button>
          )}

        </div>

      </div>
    </section>
  );
}
