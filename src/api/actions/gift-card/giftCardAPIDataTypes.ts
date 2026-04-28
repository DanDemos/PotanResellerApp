import { User } from '@/api/actions/user/userAPIDataTypes';

export type GiftCard = {
  id: number;
  category_id: number;
  name: string;
  image_path: string;
  price: string;
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    name: string;
    image_path: string;
  };
};

type PaginationLink = {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
};

export type GetGiftCardListRequest = {
  page?: number;
  per_page?: number;
  category_id?: number;
};

export type GetGiftCardListResponse = {
  current_page: number;
  data: GiftCard[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
};

export type Category = {
  id: number;
  name: string;
  image_path: string;
  created_at: string;
  updated_at: string;
};

export type GetCategoriesResponse = {
  current_page: number;
  data: Category[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
};

export type GetCategoriesRequest = {
  page?: number;
  per_page?: number;
};

export type PurchaseGiftCardRequest = {
  custom_product_id: number;
};

export type PurchaseGiftCardResponse = {
  message: string;
};

export type GetGiftCardHistoryRequest = {
  page?: number;
  per_page?: number;
};

export type PurchaseHistoryItem = {
  id: number;
  custom_product_id: number;
  user_id: number;
  image_path: string;
  status: 'pending' | 'approved' | 'rejected' | string;
  approved_by: number | null;
  approved_at: string | null;
  rejected_by: number | null;
  rejected_at: string | null;
  reject_reason: string | null;
  created_at: string;
  updated_at: string;
  custom_product: GiftCard;
  user: User;
};

export type GetGiftCardHistoryResponse = {
  current_page: number;
  data: PurchaseHistoryItem[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
};