export type User = {
  id: number;
  name: string;
  email: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  phone: string;
  type: string;
  coins: number;
  money_balance: string;
  coin_balance: number;
  money_balance_value: number;
  coin_history: any[];
  money_history: any[];
  money_debt: number;
  net_money: number;
  profile_photo_url?: string | null; // Keeping as optional if not in sample but might exist
};

export type GetUserResponse = {
  ok: boolean;
  web_check: boolean;
  web_user_id: number;
  session_id: string;
  user: User;
};

export type GetUserRequest = void;

export type CustomProductPurchaseSuccessMeta = {
  kind: 'custom_product_purchase_success';
  custom_product_id: number;
  custom_product_purchase_id: number;
  /** Single code, or multiple codes joined with ", " (codes may themselves end with ",") */
  sku_code?: string;
  sku_codes?: string[];
  amount_deducted: number;
  product_name: string;
  category_name?: string;
};

export type NotificationMeta =
  | CustomProductPurchaseSuccessMeta
  | {
      kind?: string;
    };

export type NotificationItem = {
  id: string;
  type: string;
  read_at: string | null;
  created_at: string;
  data: {
    title: string;
    message: string;
    meta: NotificationMeta;
  };
  title: string;
  message: string;
  meta: NotificationMeta;
};

export type GetNotificationListResponse = {
  unread: number;
  items: NotificationItem[];
  current_page?: number;
  last_page?: number;
  total?: number;
  per_page?: number;
};

export type GetNotificationListRequest = {
  page?: number;
  per_page?: number;
};

export type MarkNotificationAsReadRequest = {
  id: string;
};

export type MarkNotificationAsReadResponse = {
  ok: boolean;
};

export type MarkAllNotificationsAsReadRequest = void;

export type MarkAllNotificationsAsReadResponse = {
  ok: boolean;
};
