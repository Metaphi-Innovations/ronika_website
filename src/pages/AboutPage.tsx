import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAboutContent, AboutContentData, getHomeContent, HomeContentData } from '../api/contentApi';
import { getImageUrl } from '../utils/imageUrl';
import { isHtmlString, sanitizeRichText } from '../utils/richText';
import ServicesSection from '../components/ServicesSection';
import { useLiveResource } from '../context/LiveSyncContext';
import './AboutPage.css';

export default function AboutPage() {
  const [content, setContent] = useState<AboutContentData | null>(null);
  const [homeContent, setHomeContent] = useState<HomeContentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAboutData = useCallback(async () => {
    try {
      const [aboutData, homeData] = await Promise.all([
        getAboutContent(),
        getHomeContent()
      ]);
      setContent(aboutData);
      setHomeContent(homeData);
    } catch (err) {
      console.warn('Failed to load About/Home content from API:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAboutData();
  }, [fetchAboutData]);

  // Live CMS Synchronization for About, Home & Services
  useLiveResource(['about', 'home', 'services'], () => {
    fetchAboutData();
  });

  const headingText = content?.heading || '';
  const isHeadingHtml = isHtmlString(headingText);
  const sanitizedHeading = isHeadingHtml ? sanitizeRichText(headingText) : headingText;

  const paragraphs = content?.bioParagraphs && content.bioParagraphs.length > 0 
    ? content.bioParagraphs 
    : [];

  const headshotSrc = content?.headshotImage?.url 
    ? getImageUrl(content.headshotImage.url) 
    : (content?.supportingImage?.url ? getImageUrl(content.supportingImage.url) : '');

  if (loading) {
    return (
      <main className="about-page animate-fade-in">
        <section className="about-editorial-page">
          <div className="container about-container" style={{ padding: '6rem 0', textAlign: 'center', opacity: 0.6 }}>
            Loading About page...
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="about-page animate-fade-in">
      <section className="about-editorial-page">
        <div className="container about-container">
        
        <div className="about-content-wrapper">
          
          {/* LEFT: TEXT CONTENT (STARTS DIRECTLY FROM HEADER SECTION) */}
          <div className="about-text-column">
            
            {headingText && (
              isHeadingHtml ? (
                <h1 
                  className="about-main-heading"
                  dangerouslySetInnerHTML={{ __html: sanitizedHeading }}
                />
              ) : (
                <h1 className="about-main-heading">
                  {headingText}
                </h1>
              )
            )}
            
            <div className="about-body-text">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p.trim() === '' ? '\u00A0' : p}</p>
              ))}
            </div>

            <div className="about-cta-group">
              <a 
                href="#services" 
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('services');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="about-btn-outline"
              >
                Services &rarr;
              </a>
              {content?.ctaText && (
                <Link to={content?.ctaLink || "/contact"} className="about-btn-solid">
                  {content.ctaText} &rarr;
                </Link>
              )}
            </div>

          </div>

          {/* RIGHT: ILLUSTRATION */}
          <div className="about-visual-column">
            {headshotSrc && (
              <img 
                src={headshotSrc} 
                alt="About" 
                className="about-illustration"
              />
            )}
          </div>

        </div>
        </div>
      </section>

      <ServicesSection sectionTitle={homeContent?.servicesSectionTitle} />
    </main>
  );
}
