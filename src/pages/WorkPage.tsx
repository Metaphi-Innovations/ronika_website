import React, { useEffect, useState, useMemo } from 'react';
import { getProjects, getCategories, CategoryData } from '../api/projectsApi';
import { adaptApiProject } from '../utils/projectAdapter';
import type { Project } from '../types/portfolio';
import ProjectCard from '../components/ProjectCard';
import ScrollReveal from '../components/ScrollReveal';
import './WorkPage.css';

export default function WorkPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getProjects(), getCategories()])
      .then(([apiProjects, apiCategories]) => {
        if (!isMounted) return;
        setProjects(apiProjects.map(adaptApiProject));
        setCategories(apiCategories);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Failed to load projects from CMS:', err);
        if (isMounted) {
          setError('Unable to load projects');
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (selectedCat !== 'All' && categories.length > 0 && !categories.some((c) => c.name === selectedCat)) {
      setSelectedCat('All');
    }
  }, [categories, selectedCat]);

  const filteredProjects = useMemo(() => {
    if (selectedCat === 'All') return projects;
    return projects.filter((p) => p.category === selectedCat);
  }, [projects, selectedCat]);

  return (
    <main className="psycolops-work-page animate-fade-in">
      <section className="psycolops-projects-exhibition">
        <div className="container">
          <ScrollReveal>
            <div className="exhibition-header-row work-page-header">
              <h1 className="work-page-title">All Projects</h1>

              {categories.length > 0 && (
                <div className="work-category-filters">
                  <button
                    className={`btn-pill-cta ${selectedCat === 'All' ? 'active' : ''}`}
                    onClick={() => setSelectedCat('All')}
                    style={{ opacity: selectedCat === 'All' ? 1 : 0.6, cursor: 'pointer' }}
                  >
                    All ({projects.length})
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      className={`btn-pill-cta ${selectedCat === cat.name ? 'active' : ''}`}
                      onClick={() => setSelectedCat(cat.name)}
                      style={{ opacity: selectedCat === cat.name ? 1 : 0.6, cursor: 'pointer' }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>

          {loading ? (
            <div style={{ padding: '4rem 0', textAlign: 'center', opacity: 0.6 }}>Loading projects...</div>
          ) : error ? (
            <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--color-primary-dark, #333)' }}>{error}</div>
          ) : filteredProjects.length === 0 ? (
            <div style={{ padding: '4rem 0', textAlign: 'center', opacity: 0.6 }}>No projects found in this category.</div>
          ) : (
            <div className="psycolops-projects-stack">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  total={filteredProjects.length}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
