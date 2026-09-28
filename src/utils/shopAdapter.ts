import type { ApiShopProduct } from '../api/shopApi';
import type { ShopProduct } from '../types/shop';
import { getImageUrl } from './imageUrl';

export function adaptApiShopProduct(apiProd: ApiShopProduct): ShopProduct {
  const categoryName = typeof apiProd.category === 'object' && apiProd.category
    ? apiProd.category.name
    : (typeof apiProd.category === 'string' ? apiProd.category : 'Artwork');

  const mainUrl = apiProd.mainImage?.url ? getImageUrl(apiProd.mainImage.url) : '';

  const galleryImages = (apiProd.images || [])
    .slice()
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map(img => ({
      src: getImageUrl(img.url),
      alt: img.alt || apiProd.name,
      label: img.label || ''
    }));

  return {
    id: apiProd._id,
    slug: apiProd.slug,
    name: apiProd.name,
    category: categoryName,
    shortDescription: apiProd.shortDescription || '',
    description: apiProd.description || '',
    mainImage: mainUrl,
    images: galleryImages.length > 0 ? galleryImages : (mainUrl ? [{ src: mainUrl, alt: apiProd.name }] : []),
    details: apiProd.details,
    displayOrder: apiProd.displayOrder || 0,
    published: apiProd.published !== undefined ? apiProd.published : true,
  };
}
