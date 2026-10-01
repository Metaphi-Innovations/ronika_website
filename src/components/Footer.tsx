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
      .filter((b) => b.isActive !== false)
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
  } else if (settings?.socialLinks || settings?.contactEmail) {
    const links: SocialLink[] = [];
    if (settings.socialLinks?.instagram) {
      links.push({ name: 'Instagram', url: settings.socialLinks.instagram, isExternal: true });
    }
    if (settings.socialLinks?.behance) {
      links.push({ name: 'Behance', url: settings.socialLinks.behance, isExternal: true });
    }
    if (settings.socialLinks?.linkedin) {
      links.push({ name: 'LinkedIn', url: settings.socialLinks.linkedin, isExternal: true });
    }
    if (settings.contactEmail) {
      links.push({ name: 'Gmail', url: getGmailComposeUrl(settings.contactEmail), isExternal: true });
    }
    socialLinks = links;
  }

  return (
    <footer className="minimal-footer">
      <div className="container minimal-footer-container">

        {/* Banner Headline Callout */}
        <h3 className="footer-cta-headline font-74">
          LETS BUILD SOMETHING COOL TOGETHER :)
        </h3>

        {/* Secondary Nav Links */}
        <div className="footer-link">
          {navLinks.map((item) => (
            <NavLink key={item.path} to={item.path} className="footer-nav-link">
              {item.label}
            </NavLink>
          ))}
        </div>

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
