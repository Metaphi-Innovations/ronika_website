import { fetchApi } from './apiClient';

export interface ApiShopCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface ApiShopProductImage {
  _id?: string;
  url: string;
  filename: string;
  originalName: string;
  width: number;
  height: number;
  aspectRatio: number;
  alt?: string;
  label?: string;
  order: number;
}

export interface ApiShopProductDetails {
  medium?: string;
  dimensions?: string;
  materials?: string;
  year?: string;
  availability?: string;
  bulletPoints?: string[];
}

export interface ApiShopProduct {
  _id: string;
  name: string;
  slug: string;
  category: ApiShopCategory | string;
  shortDescription: string;
  description: string;
  price: number;
  currency: string;
  mainImage: {
    url: string;
    filename: string;
    width: number;
    height: number;
    aspectRatio: number;
  };
  images: ApiShopProductImage[];
  details?: ApiShopProductDetails;
  stockQuantity: number;
  published: boolean;
  displayOrder: number;
}

export async function getShopCategories(): Promise<ApiShopCategory[]> {
  return fetchApi<ApiShopCategory[]>('/shop/categories');
}

export async function getShopProducts(categoryId?: string): Promise<ApiShopProduct[]> {
  const query = categoryId ? `?category=${encodeURIComponent(categoryId)}` : '';
  return fetchApi<ApiShopProduct[]>(`/shop/products${query}`);
}

export async function getShopProductBySlug(slug: string): Promise<ApiShopProduct> {
  return fetchApi<ApiShopProduct>(`/shop/products/${slug}`);
}
