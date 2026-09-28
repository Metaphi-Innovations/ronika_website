import { fetchApi } from './apiClient';

export interface ServiceData {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  displayOrder: number;
  isActive: boolean;
}

export async function getServices(): Promise<ServiceData[]> {
  return fetchApi<ServiceData[]>('/services');
}
