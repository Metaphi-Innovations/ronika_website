import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectBySlug, getProjects, ApiProject } from '../api/projectsApi';
import { adaptApiProject } from '../utils/projectAdapter';
import type { Project } from '../types/portfolio';
import ProjectCarousel from '../components/ProjectCarousel';
import { generateProjectImageRows } from '../utils/imageLayout';
import './ProjectDetailPage.css';

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [otherProjects, setOtherProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;

    let isMounted = true;
    setLoading(true);

    Promise.all([getProjectBySlug(slug), getProjects()])
      .then(([apiProj, allProjects]) => {
        if (!isMounted) return;
        const adapted = adaptApiProject(apiProj);
        setProject(adapted);
        
        const adaptedOthers = allProjects
          .filter(p => p.slug !== slug)
          .map(adaptApiProject);
        setOtherProjects(adaptedOthers);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Failed to load project details:', err);
        if (isMounted) {
          setError('Project not found');
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="container section text-center" style={{ paddingTop: '6rem', paddingBottom: '6rem', opacity: 0.6 }}>
        <p>Loading project details...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container section text-center" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <h1 className="heading-2">Project Not Found</h1>
        <Link to="/work" className="btn-editorial" style={{ marginTop: '1.5rem' }}>
          Back to Work Index
        </Link>
      </div>
    );
  }

  const galleryItems = (project.images || []).map((img, idx) => ({
    src: img,
    caption: `Visual Output ${String(idx + 1).padStart(2, '0')}`,
    originalIndex: idx
  }));

  // Dynamic row distribution calculated via generateProjectImageRows algorithm
  const imageRows = generateProjectImageRows(galleryItems);

  return (
    <article className="psycolops-project-detail animate-fade-in">
      {/* 1. Header & Title Section */}
      <section className="detail-hero-section">
        <div className="container">
          <div className="detail-header-block">
            <div className="detail-category-tag">
              <span>{typeof project.category === 'string' ? project.category.toUpperCase() : ''}</span>
              {project.tags && project.tags[0] && (
                <>
                  <span className="divider-bar">|</span>
                  <span>{project.tags[0].toUpperCase()}</span>
                </>
              )}
              {project.year && (
                <>
                  <span className="divider-bar">|</span>
                  <span>{project.year}</span>
                </>
              )}
            </div>
            
            <h1 className="detail-title">{project.title}</h1>
          </div>

          <div className="detail-hero-visual">
            <img 
              src={project.heroImage} 
              alt={project.title} 
              className="detail-hero-img" 
            />
          </div>
        </div>
      </section>

      {/* 2. 2-Column Metadata & Brief Section */}
      <section className="detail-narrative-section">
        <div className="container">
          <div className="narrative-grid">
            <div className="narrative-meta">
              {project.metadata?.client && (
                <div className="meta-item">
                  <span className="meta-label">CLIENT</span>
                  <p className="meta-value">{project.metadata.client}</p>
                </div>
              )}
              {((project.tags && project.tags.length > 0) || project.category) && (
                <div className="meta-item">
                  <span className="meta-label">SERVICES / DELIVERABLES</span>
                  <p className="meta-value">{project.tags && project.tags.length > 0 ? project.tags.join(', ') : project.category}</p>
                </div>
              )}
              {project.role && (
                <div className="meta-item">
                  <span className="meta-label">ROLE</span>
                  <p className="meta-value">{project.role}</p>
                </div>
              )}
              {project.year && (
                <div className="meta-item">
                  <span className="meta-label">YEAR</span>
                  <p className="meta-value">{project.year}</p>
                </div>
              )}
            </div>
            
            {project.description && (
              <div className="narrative-text">
                <h3 className="brief-heading">Brief:</h3>
                <p className="brief-paragraph">{project.description}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Section Divider line (Overview) */}
      <section className="detail-divider-section">
        <div className="container">
          <div className="detail-section-divider">
            <span className="divider-label">Overview</span>
            <div className="divider-line"></div>
          </div>
        </div>
      </section>

      {/* 4. Dynamic Visual Gallery Section */}
      {imageRows.length > 0 && (
        <section className="detail-gallery-stack">
          <div className="container">
            <div className="dynamic-gallery-rows-wrapper">
              {imageRows.map((row, rowIndex) => {
                const rowTypeClass = row.length === 1 ? 'row-single' : row.length === 2 ? 'row-double' : 'row-triple';
                return (
                  <div 
                    key={rowIndex} 
                    className={`gallery-layout-row ${rowTypeClass}`}
                  >
                    {row.map(({ item, position, ratio }) => (
                      <div 
                        key={item.originalIndex} 
                        className={`gallery-image-item ratio-${ratio.replace(':', '-')}`}
                        style={{
                          aspectRatio: ratio === '16:9' ? '16 / 9' : ratio === '4:3' ? '4 / 3' : '1 / 1'
                        }}
                      >
                        <div className="gallery-visual-frame">
                          <img 
                            src={item.src} 
                            alt={item.caption} 
                            loading="lazy"
                            className="gallery-responsive-img"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 5. "See More Work" Section (Carousel) */}
      {otherProjects.length > 0 && (
        <ProjectCarousel projects={otherProjects} title="Selected Projects & Visual Explorations:" />
      )}
    </article>
  );
}
