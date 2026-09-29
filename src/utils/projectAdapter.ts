import type { ApiProject } from '../api/projectsApi';
import type { Project } from '../types/portfolio';
import { getImageUrl } from './imageUrl';

export function adaptApiProject(apiProj: ApiProject): Project {
  const categoryName = typeof apiProj.category === 'object' && apiProj.category
    ? apiProj.category.name
    : (typeof apiProj.category === 'string' && !/^[0-9a-fA-F]{24}$/.test(apiProj.category) ? apiProj.category : '');

  const heroUrl = apiProj.heroImage?.url
    ? getImageUrl(apiProj.heroImage.url)
    : (apiProj.images && apiProj.images.length > 0 ? getImageUrl(apiProj.images[0].url) : '');

  const galleryImageUrls = (apiProj.images || [])
    .slice()
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((img) => getImageUrl(img.url));

  return {
    id: apiProj._id,
    slug: apiProj.slug,
    title: apiProj.title,
    subtitle: apiProj.subtitle || '',
    category: categoryName as any,
    year: apiProj.year || '',
    role: apiProj.role || '',
    heroImage: heroUrl,
    images: galleryImageUrls,
    description: apiProj.description || '',
    details: apiProj.details || '',
    tags: apiProj.tags || [],
    featured: apiProj.featured || false,
    metadata: {
      client: apiProj.client || '',
      year: apiProj.year || '',
      role: apiProj.role || '',
    }
  };
}
