import React, { useState } from 'react';
import { PROJECTS } from '../data/projects.ts';
import './GalleryPage.css';

export interface GalleryDisplayItem {
  src: string;
  caption: string;
  projectTitle: string;
  category: string;
  tags: string[];
  globalIndex: number;
}

const GALLERY_CATEGORIES = [
  "ALL",
  "BRANDING",
  "MOTION",
  "SKETCHBOOKS",
  "TYPOGRAPHY",
  "ILLUSTRATION"
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  // Flatten all available images from all projects
  const allGalleryItems: GalleryDisplayItem[] = PROJECTS.flatMap(project => {
    const images = project.images;
    return (images || []).map((img, idx) => ({
      src: img,
      caption: `${project.title} — Visual Output ${String(idx + 1).padStart(2, '0')}`,
      projectTitle: project.title,
      category: project.category,
      tags: project.tags || [],
      globalIndex: 0
    }));
  }).map((item, idx) => ({ ...item, globalIndex: idx }));

  const filteredItems = allGalleryItems.filter(item => {
    if (activeCategory === "ALL") return true;
    const categoryUpper = item.category.toUpperCase();
    const titleUpper = item.projectTitle.toUpperCase();
    const tagUpper = item.tags.map(t => t.toUpperCase());
    const filterUpper = activeCategory.toUpperCase();

    if (filterUpper === "BRANDING") {
      return categoryUpper.includes("BRAND") || titleUpper.includes("BRAND") || tagUpper.some(t => t.includes("BRAND"));
    }
    if (filterUpper === "MOTION") {
      return categoryUpper.includes("SHOOT") || categoryUpper.includes("MOTION") || titleUpper.includes("SHOOT") || tagUpper.some(t => t.includes("MOTION") || t.includes("VIDEO") || t.includes("PHOTOGRAPHY"));
    }
    if (filterUpper === "SKETCHBOOKS") {
      return categoryUpper.includes("SKETCH") || titleUpper.includes("SKETCH") || tagUpper.some(t => t.includes("SKETCH") || t.includes("DRAWING"));
    }
    if (filterUpper === "TYPOGRAPHY") {
      return categoryUpper.includes("TYPE") || categoryUpper.includes("POSTER") || categoryUpper.includes("PUBLICATION") || titleUpper.includes("TEXT") || tagUpper.some(t => t.includes("TYPE") || t.includes("POSTER"));
    }
    if (filterUpper === "ILLUSTRATION") {
      return categoryUpper.includes("ILLUSTRAT") || titleUpper.includes("ILLUSTRAT") || tagUpper.some(t => t.includes("ILLUSTRAT") || t.includes("VECTOR"));
    }

    return categoryUpper.includes(filterUpper) || titleUpper.includes(filterUpper) || tagUpper.some(t => t.includes(filterUpper));
  });

  return (
    <main className="psycolops-gallery-page animate-fade-in">
      <section className="psycolops-gallery-section">
        <div className="container">

          {/* Header Subtitle */}
          <div className="gallery-header-block">
            <h2 className="gallery-subtitle-text">
              Here's a compilation of my <span className="font-italic">Work</span> including <span className="font-italic">Personal</span> as well as <span className="font-italic">Client Projects.</span>
            </h2>
          </div>

          {/* Filter Pills Row */}
          <div className="gallery-filter-pills-row">
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`gallery-filter-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 3-Column Masonry Exhibition Wall */}
          <div className="psycolops-gallery-wall">
            {filteredItems.map((item) => (
              <div key={item.globalIndex} className="gallery-wall-card">
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

        </div>
      </section>
    </main>
  );
}
