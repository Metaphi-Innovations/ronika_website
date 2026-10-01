import React, { useEffect, useState, useCallback } from 'react';
import { ArrowUpRight, Instagram, Linkedin, Mail } from 'lucide-react';
import { getContactContent, ContactContentData } from '../api/contentApi';
import { getGmailComposeUrl } from '../utils/mail';
import { useLiveResource } from '../context/LiveSyncContext';
import './ContactPage.css';

export default function ContactPage() {
  const [content, setContent] = useState<ContactContentData | null>(null);

  const fetchContactData = useCallback(async () => {
    try {
      const data = await getContactContent();
      setContent(data);
    } catch (err) {
      console.warn('Failed to load Contact content from API:', err);
    }
  }, []);

  useEffect(() => {
    fetchContactData();
  }, [fetchContactData]);

  // Live CMS Synchronization for Contact Details
  useLiveResource(['contact', 'settings'], () => {
    fetchContactData();
  });

  const headline = content?.heading;
  const email = content?.email;
  const description = content?.description;
  const instagram = content?.socialLinks?.instagram;
  const linkedin = content?.socialLinks?.linkedin;

  return (
    <main className="psycolops-contact-page animate-fade-in">
      <section className="contact-hero section">
        <div className="container contact-container">

          {/* Paper Airplane Motif Image */}
          <div className="paper-plane-wrapper" title="Contact">
            <img 
              src="/assets/AboutMe/paper-plane-transparent.png" 
              alt="Paper Plane" 
              className="paper-plane-img"
            />
          </div>

          {headline && (
            <h1 className="heading-1 contact-headline">
              {headline}
            </h1>
          )}
          
          {/* Direct Email CTA */}
          {(email || description) && (
            <div className="contact-info-block">
              {email && (
                <a
                  href={getGmailComposeUrl(email)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="huge-contact-link link-underline"
                >
                  {email} <ArrowUpRight size={28} style={{display:'inline', verticalAlign: 'middle'}}/>
                </a>
              )}

              {/* Client's Welcoming Message */}
              {description && (
                <p className="contact-welcome-text">
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Social Row */}
          {(instagram || linkedin || email) && (
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
              {email && (
                <a
                  href={getGmailComposeUrl(email)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <Mail size={18} /> Gmail
                </a>
              )}
            </div>
          )}

        </div>
      </section>
    </main>
  );
}
