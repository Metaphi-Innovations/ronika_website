import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { getGmailComposeUrl } from '../utils/mail';
import './Footer.css';

export interface SocialLink {
  name: string;
  url: string;
  isExternal?: boolean;
}

export default function Footer() {
  const { settings } = useSite();

  const navLinks = [
    { label: 'About', path: '/about' },
    { label: 'Work', path: '/work' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact', path: '/contact' }
  ];

  let socialLinks: SocialLink[] = [];

  if (settings?.socialButtons && settings.socialButtons.length > 0) {
    const activeBtns = settings.socialButtons
      .filter((b) => b.isActive !== false && b.url && b.url.trim() !== '' && b.url.trim() !== '#')
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    socialLinks = activeBtns.map((b) => {
      const isMail =
        b.url.startsWith('mailto:') ||
        b.label.toLowerCase().includes('gmail') ||
        b.label.toLowerCase().includes('email') ||
        (b.url.includes('@') && !b.url.startsWith('http'));
      return {
        name: b.label,
        url: isMail ? getGmailComposeUrl(b.url) : b.url,
        isExternal: true,
      };
    });
  }

  return (
    <footer className="minimal-footer">
      <div className="container minimal-footer-container">

        {/* Banner Headline Callout */}
        {settings?.footerText && (
          <h3 className="footer-cta-headline font-74">
            {settings.footerText}
          </h3>
        )}


        {/* Contact Block */}
        <div className="footer-contact-block">
          <h3 className="footer-contact-title font-36">Contact</h3>
          {socialLinks.length > 0 && (
            <div className="footer-social-pills">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target={link.isExternal ? '_blank' : undefined}
                  rel={link.isExternal ? 'noreferrer' : undefined}
                  className="footer-pill-btn"
                >
                  {link.name}
                </a>
              ))}
            </div>
          )}
        </div>


      </div>
    </footer>
  );
}
