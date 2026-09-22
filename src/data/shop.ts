import { ShopCategory, ShopProduct } from '../types/shop';

export const SHOP_CATEGORIES: ShopCategory[] = [
  { id: 'cat-artworks', name: 'Artworks', displayOrder: 1 },
  { id: 'cat-prints', name: 'Prints', displayOrder: 2 },
  { id: 'cat-commissions', name: 'Commissions', displayOrder: 3 },
  { id: 'cat-objects', name: 'Objects', displayOrder: 4 },
];

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: 'prod-001',
    slug: 'bombay-textures-print',
    name: 'Bombay Textures Print',
    category: 'Prints',
    shortDescription: 'High quality giclée print exploring the visual vernacular of Mumbai.',
    description: 'A limited edition archival print capturing the layered textures, faded signage, and typographic chaos of Bombay streets. Produced on 300gsm Hahnemühle Photo Rag for exceptional color depth and longevity.',
    mainImage: '/assets/projects/Bombayphilia/d8b75e_8c4bb68c06464764be3a23d978863346~mv2.webp',
    images: [{ src: '/assets/projects/Bombayphilia/d8b75e_8c4bb68c06464764be3a23d978863346~mv2.webp', alt: 'Full print view' },
      { src: '/assets/projects/Bombayphilia/d8b75e_299731382b3c4ce4a32ce4ba763df5ab~mv2.webp', alt: 'Detail view of typography' }
    ],
    details: {
      medium: 'Giclée Print on 300gsm Hahnemühle Photo Rag',
      dimensions: '40 x 50 cm',
      year: '2024',
      availability: 'Edition of 50'
    },
    displayOrder: 1,
    published: true
  },
  {
    id: 'prod-002',
    slug: 'thinking-cap-original',
    name: 'Thinking Cap Original',
    category: 'Artworks',
    shortDescription: 'Original mixed media illustration on canvas.',
    description: 'An original surrealist exploration of cognitive overload. Hand-painted using acrylics, ink, and pastel on stretched canvas.',
    mainImage: '/assets/projects/Thinking Cap/d8b75e_4646182b70ad46e7b91222f19145faac~mv2.webp',
    images: [{ src: '/assets/projects/Thinking Cap/d8b75e_4646182b70ad46e7b91222f19145faac~mv2.webp', alt: 'Full artwork' },
      { src: '/assets/projects/Thinking Cap/d8b75e_e23b48f9652e40878ade909a7ab42d33~mv2.webp', alt: 'Brushwork detail' }
    ],
    details: {
      medium: 'Acrylic and Ink on Canvas',
      dimensions: '100 x 100 cm',
      year: '2023',
      availability: 'Unique Original'
    },
    displayOrder: 2,
    published: true
  },
  {
    id: 'prod-003',
    slug: 'custom-brand-motif',
    name: 'Custom Brand Motif Commission',
    category: 'Commissions',
    shortDescription: 'Bespoke illustrative motifs tailored for your brand identity.',
    description: 'Commission a set of custom, hand-drawn motifs to elevate your brand packaging, digital presence, or editorial publications.',
    mainImage: '/assets/projects/Packaging Design/d8b75e_b83a6500bc6641a4ae2e5cf7447b5ee9~mv2.webp',
    images: [{ src: '/assets/projects/Packaging Design/d8b75e_b83a6500bc6641a4ae2e5cf7447b5ee9~mv2.webp', alt: 'Example packaging motif' },
      { src: '/assets/projects/Packaging Design/d8b75e_26ed78428b74435c901af48c7994a549~mv2.webp', alt: 'Example label motif' }
    ],
    details: {
      medium: 'Digital / Vector / Hand-drawn',
      availability: 'Currently accepting 2 commissions per month'
    },
    displayOrder: 3,
    published: true
  },
  {
    id: 'prod-004',
    slug: 'live-and-breathe-poster',
    name: 'Live & Breathe Poster Set',
    category: 'Prints',
    shortDescription: 'Set of two typography-led posters focusing on breath and movement.',
    description: 'A typographic poster series exploring the rhythmic nature of breathing through kinetic type manipulation.',
    mainImage: '/assets/projects/Text Me/d8b75e_92e99096c84b485da519b64e0bb8e536~mv2.webp',
    images: [{ src: '/assets/projects/Text Me/d8b75e_92e99096c84b485da519b64e0bb8e536~mv2.webp', alt: 'Poster set displayed on wall' }
    ],
    details: {
      medium: 'Screenprint on 250gsm Uncoated Stock',
      dimensions: 'A2 (42 x 59.4 cm) each',
      year: '2022',
      availability: 'Open Edition'
    },
    displayOrder: 4,
    published: true
  },
  {
    id: 'prod-005',
    slug: 'editorial-sketch-collection',
    name: 'Editorial Sketch Collection',
    category: 'Artworks',
    shortDescription: 'A bound collection of 10 original ink sketches.',
    description: 'Original pages from the 2024 editorial sketchbook series, bound in a single portfolio.',
    mainImage: '/assets/projects/Illustration & Sketches/d8b75e_6e96498ab923431f862265e05d2509ed~mv2.webp',
    images: [{ src: '/assets/projects/Illustration & Sketches/d8b75e_6e96498ab923431f862265e05d2509ed~mv2.webp', alt: 'Sketch' }],
    details: {
      medium: 'Ink on 120gsm Cartridge Paper',
      dimensions: 'A5 (14.8 x 21 cm)',
      year: '2024',
      availability: 'Original Collection'
    },
    displayOrder: 5,
    published: true
  },
  {
    id: 'prod-006',
    slug: 'client-hero-print',
    name: 'Client Spotlight Print',
    category: 'Prints',
    shortDescription: 'Exclusive client editorial print in large format.',
    description: 'Large format print featuring editorial styling.',
    mainImage: '/assets/projects/Bombayphilia/d8b75e_a0839acd31dd4984ae84ce826d094043~mv2.webp',
    images: [{ src: '/assets/projects/Bombayphilia/d8b75e_a0839acd31dd4984ae84ce826d094043~mv2.webp', alt: 'Hero' }],
    details: {
      medium: 'Giclée Print on Fine Art Paper',
      dimensions: '50 x 70 cm',
      year: '2023',
      availability: 'Limited Edition of 25'
    },
    displayOrder: 6,
    published: true
  },
  {
    id: 'prod-007',
    slug: 'surreal-character-study',
    name: 'Surreal Character Study',
    category: 'Artworks',
    shortDescription: 'Original vector artwork printed on demand.',
    description: 'Bold character design blending flat vector shapes with deep conceptual narrative.',
    mainImage: '/assets/projects/Illustration & Sketches/d8b75e_83cd4eec04eb4932af096384e0b4b535~mv2.webp',
    images: [{ src: '/assets/projects/Illustration & Sketches/d8b75e_83cd4eec04eb4932af096384e0b4b535~mv2.webp', alt: 'Character' }],
    details: {
      medium: 'Digital Vector Illustration',
      dimensions: 'Available in various sizes',
      year: '2024',
      availability: 'Open Edition Print'
    },
    displayOrder: 7,
    published: true
  },
  {
    id: 'prod-008',
    slug: 'brand-identity-object',
    name: 'Brand Identity Object Box',
    category: 'Objects',
    shortDescription: 'Physical brand identity kit.',
    description: 'A physical showcase box demonstrating luxury brand identity elements.',
    mainImage: '/assets/projects/Bombayphilia Shoot/d8b75e_0772efab406b4901841954d3500d7a2f~mv2.webp',
    images: [{ src: '/assets/projects/Bombayphilia Shoot/d8b75e_0772efab406b4901841954d3500d7a2f~mv2.webp', alt: 'Box' }],
    details: {
      medium: 'Mixed Media Packaging',
      dimensions: '30 x 20 x 10 cm',
      year: '2023',
      availability: 'Prototype 1 of 1'
    },
    displayOrder: 8,
    published: true
  },
  {
    id: 'prod-009',
    slug: 'bombay-shoot-zine',
    name: 'Bombayphilia Photo Zine',
    category: 'Prints',
    shortDescription: 'A photographic zine exploring the styling of the Bombayphilia project.',
    description: 'Curated 24-page photo zine printed on recycled uncoated stock.',
    mainImage: '/assets/projects/Bombayphilia Shoot/d8b75e_387ba6dcc67c4ba282d77724cdface08~mv2.webp',
    images: [{ src: '/assets/projects/Bombayphilia Shoot/d8b75e_387ba6dcc67c4ba282d77724cdface08~mv2.webp', alt: 'Zine' }],
    details: {
      medium: 'Saddle-stitched Zine, 24 Pages',
      dimensions: 'A5 (14.8 x 21 cm)',
      year: '2024',
      availability: 'Edition of 100'
    },
    displayOrder: 9,
    published: true
  },
  {
    id: 'prod-010',
    slug: 'client-editorial-2',
    name: 'Editorial Portrait',
    category: 'Artworks',
    shortDescription: 'From the client archives.',
    description: 'Editorial portrait piece available as a limited commission.',
    mainImage: '/assets/projects/Illustration & Sketches/d8b75e_db4eac8ae76b4f039c86415d6c1a616e~mv2.webp',
    images: [{ src: '/assets/projects/Illustration & Sketches/d8b75e_db4eac8ae76b4f039c86415d6c1a616e~mv2.webp', alt: 'Client 2' }],
    details: {
      medium: 'Ink and Gouache on Paper',
      dimensions: 'A3 (29.7 x 42 cm)',
      year: '2023',
      availability: 'Original Available'
    },
    displayOrder: 10,
    published: true
  },
  {
    id: 'prod-011',
    slug: 'client-editorial-3',
    name: 'Editorial Feature',
    category: 'Prints',
    shortDescription: 'Featured editorial graphic print.',
    description: 'A beautiful graphic print from the client asset files.',
    mainImage: '/assets/projects/Bombayphilia Shoot/d8b75e_48272af2069c4f5198f3f29bf1a78a28~mv2.webp',
    images: [{ src: '/assets/projects/Bombayphilia Shoot/d8b75e_48272af2069c4f5198f3f29bf1a78a28~mv2.webp', alt: 'Client 3' }],
    details: {
      medium: 'Archival Matte Print',
      dimensions: '40 x 50 cm',
      year: '2024',
      availability: 'Edition of 50'
    },
    displayOrder: 11,
    published: true
  },
  {
    id: 'prod-012',
    slug: 'client-editorial-4',
    name: 'Minimalist Poster',
    category: 'Prints',
    shortDescription: 'Minimalist poster from the client asset files.',
    description: 'A beautiful minimalist poster.',
    mainImage: '/assets/projects/Bombayphilia Shoot/d8b75e_8e2bc8cdb66447748971820f1c4fc8cf~mv2.webp',
    images: [{ src: '/assets/projects/Bombayphilia Shoot/d8b75e_8e2bc8cdb66447748971820f1c4fc8cf~mv2.webp', alt: 'Client 4' }],
    details: {
      medium: 'Screenprint on 300gsm Cotton Paper',
      dimensions: 'A1 (59.4 x 84.1 cm)',
      year: '2023',
      availability: 'Open Edition'
    },
    displayOrder: 12,
    published: true
  },
  {
    id: 'prod-013',
    slug: 'abstract-texture-study',
    name: 'Abstract Texture Study',
    category: 'Objects',
    shortDescription: 'Physical texture study on handmade paper.',
    description: 'Exploration of physical textures and printing anomalies on heavy stock handmade paper.',
    mainImage: '/assets/projects/Bombayphilia Shoot/d8b75e_9218cad4bf7f4df4a3348bb38378c67e~mv2.webp',
    images: [{ src: '/assets/projects/Bombayphilia Shoot/d8b75e_9218cad4bf7f4df4a3348bb38378c67e~mv2.webp', alt: 'Texture' }],
    details: {
      medium: 'Acrylic and Charcoal on Handmade Paper',
      dimensions: '20 x 20 cm',
      year: '2024',
      availability: 'Unique Original'
    },
    displayOrder: 13,
    published: true
  },
  {
    id: 'prod-014',
    slug: 'vector-portrait-commission',
    name: 'Vector Portrait Commission',
    category: 'Commissions',
    shortDescription: 'Custom vector portrait commission.',
    description: 'Book a slot for a custom vector portrait in Ronika\'s signature style.',
    mainImage: '/assets/projects/Illustration & Sketches/d8b75e_dd5fe0027a1c44c795c89d602f2d9b6b~mv2.webp',
    images: [{ src: '/assets/projects/Illustration & Sketches/d8b75e_dd5fe0027a1c44c795c89d602f2d9b6b~mv2.webp', alt: 'Portrait' }],
    details: {
      medium: 'Digital Illustration',
      availability: 'Accepting 3 commissions per month'
    },
    displayOrder: 14,
    published: true
  },
  {
    id: 'prod-015',
    slug: 'packaging-mockup-kit',
    name: 'Luxury Packaging Mockup Kit',
    category: 'Objects',
    shortDescription: 'Digital asset kit for luxury brand packaging.',
    description: 'A premium digital kit containing highly detailed packaging die-lines and mockup templates.',
    mainImage: '/assets/projects/Bombayphilia Shoot/d8b75e_b122b484f3b3456d9b952b9cb4975bb2~mv2.webp',
    images: [{ src: '/assets/projects/Bombayphilia Shoot/d8b75e_b122b484f3b3456d9b952b9cb4975bb2~mv2.webp', alt: 'Packaging Kit' }],
    details: {
      medium: 'Digital Download (.PSD & .AI)',
      year: '2024',
      availability: 'Instant Access'
    },
    displayOrder: 15,
    published: true
  },
  {
    id: 'prod-016',
    slug: 'experimental-typography-sheet',
    name: 'Experimental Typography Sheet',
    category: 'Artworks',
    shortDescription: 'Original typography exploration sheet.',
    description: 'An original 1-of-1 typography exploration sheet from the Bombayphilia project archives.',
    mainImage: '/assets/projects/Illustration & Sketches/d8b75e_fbf2bd9c6cbb4f218c142028a7cf3990~mv2.webp',
    images: [{ src: '/assets/projects/Illustration & Sketches/d8b75e_fbf2bd9c6cbb4f218c142028a7cf3990~mv2.webp', alt: 'Typography Sheet' }],
    details: {
      medium: 'Ink and Letraset on Tracing Paper',
      dimensions: 'A4 (21.0 x 29.7 cm)',
      year: '2023',
      availability: 'Original Sold'
    },
    displayOrder: 16,
    published: true
  }
];
