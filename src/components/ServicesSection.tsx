import React, { useEffect, useState } from 'react';
import { Layout, MousePointer, Palette, Sparkles } from 'lucide-react';
import { getServices, ServiceData } from '../api/servicesApi';
import ScrollReveal from './ScrollReveal';

const DEFAULT_SERVICES = [
  {
    num: '01.',
    icon: Layout,
    title: 'Illustration',
    desc: 'Editorial artwork, character sketches, vector art, digital sketchbook entries, and custom brand motifs.',
    titleColor: '#e06e9b'
  },
  {
    num: '02.',
    icon: MousePointer,
    title: 'Design',
    desc: 'Visual identities, brand strategy, typography systems, editorial layouts, poster series, and packaging.',
    titleColor: '#8aab18'
  },
  {
    num: '03.',
    icon: Palette,
    title: 'Artwork Commissions',
    desc: 'Custom artistic commissions, spatial curation, object staging, and narrative storytelling for contemporary spaces.',
    titleColor: '#d89728'
  }
];

const COLORS = ['#e06e9b', '#8aab18', '#d89728', '#6a82fb', '#fc5c7d'];
const ICONS = [Layout, MousePointer, Palette, Sparkles];

interface ServicesSectionProps {
  sectionTitle?: string;
}

export default function ServicesSection({ sectionTitle }: ServicesSectionProps) {
  const [services, setServices] = useState<any[]>(DEFAULT_SERVICES);

  useEffect(() => {
    let isMounted = true;
    getServices()
      .then((data) => {
        if (!isMounted || !Array.isArray(data)) return;
        const activeOnly = data.filter((s) => s.isActive !== false);
        const mapped = activeOnly.map((s, idx) => {
          const IconComp = ICONS[idx % ICONS.length];
          return {
            num: `${String(idx + 1).padStart(2, '0')}.`,
            icon: IconComp,
            title: s.title,
            desc: s.description,
            titleColor: COLORS[idx % COLORS.length]
          };
        });
        setServices(mapped);
      })
      .catch((err) => {
        console.warn('Failed to load services from API:', err);
      });

    return () => { isMounted = false; };
  }, []);

  const displayTitle = sectionTitle || 'Services I offer:';

  return (
    <section id="services" className="home-services-section">
      <div className="container">
        <ScrollReveal>
          <p className="services-section-title">{displayTitle}</p>
        </ScrollReveal>
        <div className="home-services-grid">
          {services.map((s, idx) => {
            const IconComp = s.icon;
            return (
              <ScrollReveal key={s.num} delay={idx * 100} className="service-card-wrapper">
                <div className="service-card service-card-white">
                  <div className="service-card-top">
                    <IconComp className="service-card-icon" size={24} />
                    <span className="service-card-num">{s.num}</span>
                    <h3 className="service-card-title" style={{ color: s.titleColor }}>{s.title}</h3>
                  </div>
                  <div className="service-card-bottom">
                    <div className="service-card-divider" style={{ backgroundColor: s.titleColor }} />
                    <p className="service-card-desc">{s.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
