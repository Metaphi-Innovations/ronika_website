import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { getGmailComposeUrl } from '../utils/mail';
import './Navbar.css';

export interface NavItem {
  label: string;
  path: string;
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useSite();

  let socialLinks: { name: string; url: string; isExternal: boolean }[] = [];
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

  const navItems: NavItem[] = [
    { label: 'ABOUT', path: '/about' },
    { label: 'WORK', path: '/work' },
    { label: 'GALLERY', path: '/gallery' },
    { label: 'CONTACT', path: '/contact' },
    { label: 'SHOP', path: '/shop' }
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Brand Header */}
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <span className="brand-name">RONIKA BHATIA</span>
          <span className="brand-title">VISUAL DESIGNER &amp; ILLUSTRATOR</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="desktop-nav-group">
          <nav className="navbar-nav desktop-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <nav className="mobile-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mobile-drawer-footer">
            <p className="mobile-drawer-tagline">Visual Designer &amp; Illustrator</p>
            <div className="mobile-drawer-pills">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target={link.isExternal ? '_blank' : undefined}
                  rel={link.isExternal ? 'noopener noreferrer' : undefined}
                  className="mobile-drawer-pill"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
