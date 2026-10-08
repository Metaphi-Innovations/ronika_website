export type ProjectCategory = 
  | 'All'
  | 'Branding'
  | 'Graphic Design'
  | 'Illustration'
  | 'Art Direction'
  | 'Personal Project'
  | 'University Project';

export interface ProjectMetadata {
  client?: string;
  role?: string;
  tools?: string[];
  deliverables?: string[];
  [key: string]: unknown;
}

export interface ProjectImage {
  src: string;
  caption?: string;
  aspectRatio?: string;
  type?: 'fullwidth' | 'half' | 'third' | 'hero';
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: ProjectCategory;
  role?: string;
  heroImage: string;
  images: any[];
  description: string;
  details?: string;
  aspect?: 'portrait' | 'landscape' | 'square' | 'wide' | 'tall';
  tags?: string[];
  featured?: boolean;
  metadata?: ProjectMetadata;
}

export interface ProjectNavigation {
  previousProject: { slug: string; title: string } | null;
  nextProject: { slug: string; title: string } | null;
}

export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  projectSlug: string;
  category: ProjectCategory;
  aspect?: string;
}

export interface LightboxState {
  isOpen: boolean;
  currentIndex: number;
  images: Array<{ src: string; title: string; projectSlug?: string }>;
  isZoomed?: boolean;
}

export interface FilterState {
  selectedCategory: ProjectCategory;
  projectCount: number;
}
