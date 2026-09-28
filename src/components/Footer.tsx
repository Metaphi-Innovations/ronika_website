import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
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

    socialLinks = activeBtns.map((b) => ({
      name: b.label,
      url: b.url,
      isExternal: !b.url.startsWith('mailto:'),
    }));
  } else {
    const email = settings?.contactEmail || 'ronikabhatia@gmail.com';
    const instagram = settings?.socialLinks?.instagram || 'https://instagram.com/ronika_bhatia';
    const linkedin = settings?.socialLinks?.linkedin || 'https://linkedin.com';
    const behance = settings?.socialLinks?.behance || '';

    socialLinks = [
      { name: 'Instagram', url: instagram, isExternal: true },
      ...(behance ? [{ name: 'Behance', url: behance, isExternal: true }] : []),
      { name: 'LinkedIn', url: linkedin, isExternal: true },
      { name: 'Gmail', url: `mailto:${email}`, isExternal: false },
    ];
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
        </div>

      </div>
    </footer>
  );
}
