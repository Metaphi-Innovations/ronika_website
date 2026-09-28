import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getHomeContent, HomeContentData } from '../api/contentApi';
import { getProjects, ApiProject } from '../api/projectsApi';
import { getImageUrl } from '../utils/imageUrl';
import ScrollReveal from '../components/ScrollReveal';
import ServicesSection from '../components/ServicesSection';
import { sanitizeRichText, isHtmlString } from '../utils/richText';
import './HomePage.css';

interface StandoutWork {
  id: string;
  projectSlug: string;
  title: string;
  category: string;
  imageUrl: string;
}

export default function HomePage() {
  const [homeContent, setHomeContent] = useState<HomeContentData | null>(null);
  const [featuredProjects, setFeaturedProjects] = useState<StandoutWork[]>([]);
  const [colCount, setColCount] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getHomeContent(), getProjects()])
      .then(([homeData, projectsData]) => {
        if (!isMounted) return;
        setHomeContent(homeData);

        let list: StandoutWork[] = [];
        if (homeData.featuredProjects && Array.isArray(homeData.featuredProjects) && homeData.featuredProjects.length > 0) {
          list = homeData.featuredProjects.map((p: any) => {
            const catName = typeof p.category === 'object' && p.category ? p.category.name : 'Selected Work';
            const heroUrl = p.heroImage?.url ? getImageUrl(p.heroImage.url) : (p.images && p.images[0] ? getImageUrl(p.images[0].url) : '/assets/Client/HeroImage.png');
            return {
              id: p._id || p.id,
              projectSlug: p.slug,
              title: p.title,
              category: catName,
              imageUrl: heroUrl,
            };
          });
        } else if (projectsData && projectsData.length > 0) {
          const featured = projectsData.filter((p) => p.featured);
          const displayList = (featured.length > 0 ? featured : projectsData).slice(0, 7);
          list = displayList.map((p) => {
            const catName = typeof p.category === 'object' && p.category ? p.category.name : 'Selected Work';
            const heroUrl = p.heroImage?.url ? getImageUrl(p.heroImage.url) : (p.images && p.images[0] ? getImageUrl(p.images[0].url) : '/assets/Client/HeroImage.png');
            return {
              id: p._id,
              projectSlug: p.slug,
              title: p.title,
              category: catName,
              imageUrl: heroUrl,
            };
          });
        }

        setFeaturedProjects(list);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Error fetching homepage CMS content:', err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setColCount(1);
      else if (window.innerWidth < 1024) setColCount(2);
      else setColCount(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getColumns = (items: StandoutWork[], count: number) => {
    const cols: StandoutWork[][] = Array.from({ length: count }, () => []);
    items.forEach((item, i) => {
      cols[i % count].push(item);
    });
    return cols;
  };

  const masonryColumns = useMemo(() => getColumns(featuredProjects, colCount), [featuredProjects, colCount]);

  const heroImageSrc = homeContent?.heroImage?.url ? getImageUrl(homeContent.heroImage.url) : '/assets/Client/HeroImage.png';
  const introImageSrc = homeContent?.introImage?.url ? getImageUrl(homeContent.introImage.url) : '/assets/AboutMe/IMG_1423_JPG.avif';
  const quoteText = homeContent?.heroQuote || "Works of art\nmake rules,\nrules do not make\nworks of art.";
  const isQuoteHtml = isHtmlString(quoteText);
  const sanitizedQuote = isQuoteHtml ? sanitizeRichText(quoteText) : quoteText;
  const introHeading = homeContent?.introTitle || 'Some Projects I’ve Worked on';
  const introBio = homeContent?.introText || 'Hello, I am Ronika. I am a Visual Designer & Illustrator based in India. Graphic design is my passion. I create thoughtful branding with human visual narratives which are sure to captivate people.';
  const isBioHtml = isHtmlString(introBio);
  const sanitizedBio = isBioHtml ? sanitizeRichText(introBio) : introBio;

  return (
    <main className="home-page animate-fade-in">

      {/* 1. HERO SECTION - Editorial Artwork Led */}
      <section className="editorial-hero-section">
        <div className="container editorial-hero-container">
          <div className="editorial-hero-composition full-bleed-wrapper">
            <img
              src={heroImageSrc}
              alt="Ronika Bhatia Artwork"
              className="editorial-hero-bg-img"
            />

            <div className="editorial-hero-overlay-left">
              <ScrollReveal delay={0}>
                {isQuoteHtml ? (
                  <div
                    className="editorial-styled-quote"
                    dangerouslySetInnerHTML={{ __html: sanitizedQuote }}
                  />
                ) : (
                  <p className="editorial-styled-quote" style={{ whiteSpace: 'pre-line' }}>
                    {quoteText}
                  </p>
                )}
                {homeContent?.heroQuoteAuthor && homeContent.heroQuoteAuthor.trim() !== '' && (
                  <p className="editorial-quote-author">
                    — {homeContent.heroQuoteAuthor.trim().toUpperCase()}
                  </p>
                )}
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED WORK SHOWCASE (Featured Projects Masonry Grid) */}
      <section id="featured-work-section" className="psycolops-projects-exhibition">
        <div className="container">

          {/* Header Row with Dynamic Heading & Permanent "See All Projects +" CTA Button */}
          <ScrollReveal>
            <div className="exhibition-header-row">
              <h2 className="heading-2">{introHeading}</h2>
              <Link to="/work" className="btn-pill-cta">
                See All Projects +
              </Link>
            </div>
          </ScrollReveal>

          {/* Standout Work Masonry Showcase */}
          <div className="standout-masonry-grid" style={{ '--col-count': colCount } as React.CSSProperties}>
            {masonryColumns.map((col, colIndex) => (
              <div key={`col-${colIndex}`} className="standout-masonry-column">
                {col.map((work) => (
                  <ScrollReveal key={work.id}>
                    <Link to={`/project/${work.projectSlug}`} className="standout-item">
                      <img
                        src={work.imageUrl}
                        alt={work.title}
                        className="standout-image"
                        loading="lazy"
                      />
                      <div className="standout-label-overlay">
                        <h3 className="standout-title">{work.title}</h3>
                        <p className="standout-category">{work.category}</p>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            ))}
          </div>

          {/* Centered "See More Work >" Button */}
          <ScrollReveal delay={100}>
            <div className="see-more-work-wrapper">
              <Link to="/work" className="btn-see-more-work">
                See More Work &gt;
              </Link>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* 4. ABOUT / BIO SECTION */}
      <section className="home-about-section">
        <div className="container home-about-container">
          <ScrollReveal className="home-about-content" delay={0}>
            {isBioHtml ? (
              <div
                className="home-about-text"
                dangerouslySetInnerHTML={{ __html: sanitizedBio }}
              />
            ) : (
              <h2 className="home-about-text">{introBio}</h2>
            )}
            <div className="home-about-actions">
              <Link to="/about" className="btn-editorial-dark">
                See About Me
              </Link>
              <Link to="/contact" className="btn-pill-cta">
                Get In Touch
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal className="home-about-visual" delay={150}>
            <img
              src={introImageSrc}
              alt="Ronika Bhatia"
              className="about-clean-img"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* 5. SERVICES SECTION */}
      <ServicesSection sectionTitle={homeContent?.servicesSectionTitle} />

    </main>
  );
}