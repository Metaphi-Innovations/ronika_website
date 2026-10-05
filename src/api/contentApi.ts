import { fetchApi } from './apiClient';

export interface SocialButtonData {
  _id?: string;
  label: string;
  url: string;
  order: number;
  isActive: boolean;
}

export interface SiteSettingsData {
  siteTitle: string;
  metaDescription: string;
  contactEmail: string;
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    behance?: string;
    pinterest?: string;
    twitter?: string;
  };
  socialButtons?: SocialButtonData[];
  footerText: string;
  logo?: string;
  galleryHeader?: string;
  shopHeaderTitle?: string;
  shopHeaderSubtitle?: string;
}

export interface HomeContentData {
  heroTitle: string;
  heroSubtitle: string;
  heroQuote?: string;
  heroQuoteAuthor?: string;
  heroImage?: {
    url: string;
    filename: string;
  };
  introTitle: string;
  introText: string;
  introImage?: {
    url: string;
    filename: string;
  };
  servicesSectionTitle?: string;
  featuredProjects?: any[];
  ctaText: string;
  ctaLink: string;
}

export interface ExperienceItem {
  year: string;
  role: string;
  company: string;
}

export interface AwardItem {
  year: string;
  title: string;
}

export interface AboutContentData {
  heading: string;
  subheading?: string;
  bioParagraphs: string[];
  headshotImage?: {
    url: string;
    filename: string;
  };
  supportingImage?: {
    url: string;
    filename: string;
  };
  experience: ExperienceItem[];
  awards: AwardItem[];
  ctaText: string;
  ctaLink: string;
}

export interface ContactContentData {
  heading: string;
  description: string;
  email: string;
  phone?: string;
  location?: string;
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    behance?: string;
    pinterest?: string;
  };
  ctaText: string;
}

export async function getSiteSettings(): Promise<SiteSettingsData> {
  return fetchApi<SiteSettingsData>('/content/settings');
}

export async function getHomeContent(): Promise<HomeContentData> {
  return fetchApi<HomeContentData>('/content/home');
}

export async function getAboutContent(): Promise<AboutContentData> {
  return fetchApi<AboutContentData>('/content/about');
}

export async function getContactContent(): Promise<ContactContentData> {
  return fetchApi<ContactContentData>('/content/contact');
}
