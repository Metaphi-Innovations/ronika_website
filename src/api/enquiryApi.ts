import { fetchApi } from './apiClient';

export interface ShopEnquiryPayload {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  productName: string;
  productSlug?: string;
  productId?: string;
}

export async function submitShopEnquiry(data: ShopEnquiryPayload): Promise<{ success: boolean; data?: any; message?: string }> {
  return fetchApi('/enquiries', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
