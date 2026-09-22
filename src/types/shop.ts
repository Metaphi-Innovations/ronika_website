export interface ShopProductImage {
  src: string;
  alt: string;
  label?: string;
}

export interface ShopProductDetails {
  medium?: string;
  dimensions?: string;
  materials?: string;
  year?: string;
  availability?: string;
}

export interface ShopProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  mainImage: string;
  images: ShopProductImage[];
  details?: ShopProductDetails;
  displayOrder: number;
  published: boolean;
}

export interface ShopCategory {
  id: string;
  name: string;
  displayOrder: number;
}
