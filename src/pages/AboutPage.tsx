import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAboutContent, AboutContentData } from '../api/contentApi';
import { getImageUrl } from '../utils/imageUrl';
import { isHtmlString, sanitizeRichText } from '../utils/richText';
import ServicesSection from '../components/ServicesSection';
import './AboutPage.css';

export default function AboutPage() {
  const [content, setContent] = useState<AboutContentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    getAboutContent()
      .then((data) => {
        if (isMounted) {
          setContent(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Failed to load About content from API:', err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const headingText = content?.heading || 'About Ronika Bhatia';
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
            
            {isHeadingHtml ? (
              <h1 
                className="about-main-heading"
                dangerouslySetInnerHTML={{ __html: sanitizedHeading }}
              />
            ) : (
              <h1 className="about-main-heading">
                {headingText}
              </h1>
            )}
            
            <div className="about-body-text">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
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
              <Link to="/contact" className="about-btn-solid">
                {content?.ctaText || 'Get In Touch'} &rarr;
              </Link>
            </div>

          </div>

          {/* RIGHT: ILLUSTRATION */}
          <div className="about-visual-column">
            <img 
              src={headshotSrc} 
              alt="Ronika Bhatia" 
              className="about-illustration"
            />
          </div>

        </div>
        </div>
      </section>

      <ServicesSection />
    </main>
  );
}
