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

export type NotificationItem = {
  id: string;
  type: string;
  read_at: string | null;
  created_at: string;
  data: {
    title: string;
    message: string;
    meta: any;
  };
  title: string;
  message: string;
  meta: any;
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
