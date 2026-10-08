import { fetchApi } from './apiClient';

export interface CategoryData {
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

export interface ProjectImageData {
  _id?: string;
  url: string;
  filename: string;
  originalName: string;
  width: number;
  height: number;
  aspectRatio: number;
  caption?: string;
  order: number;
  layouts?: ILayouts;
}

export interface HeroImageData {
  url: string;
  filename: string;
  width: number;
  height: number;
  aspectRatio: number;
}

export interface ApiProject {
  _id: string;
  title: string;
  slug: string;
  subtitle?: string;
  category: CategoryData | string;
  role?: string;
  client?: string;
  description?: string;
  details?: string;
  heroImage?: HeroImageData;
  images: ProjectImageData[];
  tags: string[];
  featured: boolean;
  published: boolean;
  displayOrder: number;
  metadata?: any;
  createdAt?: string;
  updatedAt?: string;
}

export async function getProjects(): Promise<ApiProject[]> {
  return fetchApi<ApiProject[]>('/projects');
}

export async function getProjectBySlug(slugOrId: string): Promise<ApiProject> {
  return fetchApi<ApiProject>(`/projects/${slugOrId}`);
}

export async function getCategories(): Promise<CategoryData[]> {
  return fetchApi<CategoryData[]>('/projects/categories');
}
