import { fetchApi } from './apiClient';

export interface GalleryCategoryData {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface ILayoutItem {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ILayouts {
  lg?: ILayoutItem;
  md?: ILayoutItem;
  sm?: ILayoutItem;
  xs?: ILayoutItem;
}

export interface GalleryImageData {
  _id: string;
  title: string;
  category: GalleryCategoryData | string;
  image: {
    url: string;
    filename: string;
    originalName: string;
    width: number;
    height: number;
    aspectRatio: number;
  };
  projectSlug?: string;
  caption?: string;
  displayOrder: number;
  published: boolean;
  layouts?: ILayouts;
}

export async function getGalleryCategories(): Promise<GalleryCategoryData[]> {
  return fetchApi<GalleryCategoryData[]>('/projects/categories');
}

export async function getGalleryImages(categoryId?: string): Promise<GalleryImageData[]> {
  const query = categoryId ? `?category=${encodeURIComponent(categoryId)}` : '';
  return fetchApi<GalleryImageData[]>(`/gallery/images${query}`);
}
