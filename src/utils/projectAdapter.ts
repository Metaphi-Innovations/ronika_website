import type { ApiProject } from '../api/projectsApi';
import type { Project } from '../types/portfolio';
import { getImageUrl } from './imageUrl';

export function adaptApiProject(apiProj: ApiProject): Project {
  const categoryName = typeof apiProj.category === 'string' ? apiProj.category : '';

  const heroUrl = apiProj.heroImage?.url
    ? getImageUrl(apiProj.heroImage.url)
    : (apiProj.images && apiProj.images.length > 0 ? getImageUrl(apiProj.images[0].url) : '');

  const galleryImageItems = (apiProj.images || [])
    .slice()
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((img) => ({
      _id: img._id ? String(img._id) : '',
      url: getImageUrl(img.url),
      layouts: img.layouts
    }));

  return {
    id: apiProj._id ? String(apiProj._id) : '',
    slug: apiProj.slug,
    title: apiProj.title,
    subtitle: apiProj.subtitle || '',
    category: categoryName as any,
    role: apiProj.role || '',
    heroImage: heroUrl,
    images: galleryImageItems,
    description: apiProj.description || '',
    details: apiProj.details || '',
    tags: apiProj.tags || [],
    featured: apiProj.featured || false,
    metadata: {
      client: apiProj.client || '',
      role: apiProj.role || '',
    }
  };
}
