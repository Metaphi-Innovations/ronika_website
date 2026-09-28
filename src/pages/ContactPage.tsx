import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Instagram, Linkedin, Mail } from 'lucide-react';
import { getContactContent, ContactContentData } from '../api/contentApi';
import './ContactPage.css';

export default function ContactPage() {
  const [content, setContent] = useState<ContactContentData | null>(null);

  useEffect(() => {
    let isMounted = true;
    getContactContent()
      .then((data) => {
        if (isMounted) setContent(data);
      })
      .catch((err) => {
        console.warn('Failed to load Contact content from API:', err);
      });

    return () => { isMounted = false; };
  }, []);

  const headline = content?.heading || "Let's Create Together";
  const email = content?.email || 'ronikabhatia@gmail.com';
  const description = content?.description || 'Open for brand identity commissions, publication design, and visual consultations.';
  const instagram = content?.socialLinks?.instagram || 'https://instagram.com/ronika_bhatia';
  const linkedin = content?.socialLinks?.linkedin || 'https://linkedin.com/in/ronikabhatia';

  return (
    <main className="psycolops-contact-page animate-fade-in">
      <section className="contact-hero section">
        <div className="container contact-container">

          {/* Paper Airplane Motif Image */}
          <div className="paper-plane-wrapper" title="Ronika Bhatia Contact">
            <img 
              src="/assets/AboutMe/paper-plane-transparent.png" 
              alt="Paper Plane" 
              className="paper-plane-img"
            />
          </div>

          <h1 className="heading-1 contact-headline">
            {headline}
          </h1>
          
          {/* Direct Email CTA */}
          <div className="contact-info-block">
            <a href={`mailto:${email}`} className="huge-contact-link link-underline">
              {email} <ArrowUpRight size={28} style={{display:'inline', verticalAlign: 'middle'}}/>
            </a>

            {/* Client's Original Welcoming Message */}
            <p className="contact-welcome-text">
              {description}
            </p>
          </div>

          {/* Social Row */}
          <div className="contact-social-row">
            {instagram && (
              <a href={instagram} target="_blank" rel="noreferrer" className="social-link">
                <Instagram size={18} /> Instagram
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noreferrer" className="social-link">
                <Linkedin size={18} /> LinkedIn
              </a>
            )}
            <a href={`mailto:${email}`} className="social-link">
              <Mail size={18} /> Gmail
            </a>
          </div>

        </div>
      </section>
    </main>
  );
}
