export type MoneyHistoryGroupedItem = {
  bucket: string;
  net_amount: string;
  first_balance_before: string;
  last_balance_after: string;
  tx_count: number;
};

export type GetMoneyHistoryGroupedResponse = {
  user_id: number;
  interval: string;
  from: string | null;
  to: string | null;
  type: string | null;
  data: {
    current_page: number;
    data: MoneyHistoryGroupedItem[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
};

export type GetMoneyHistoryGroupedRequest = {
  interval?: 'daily' | 'weekly' | 'monthly';
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
  type?: string;
  page?: number;
  per_page?: number;
};

export type GetWalletBalanceResponse = {
  balance: string;
};

export type GetWalletBalanceRequest = void;

// Coin Data Types
export type GetCoinsDataRequest = void;

export type GetCoinsDataResponse = {
  coins: number;
};

export type CoinHistoryItem = {
  bucket: string;
  net_amount: string;
  first_balance_before: number;
  last_balance_after: number;
  tx_count: number;
};

export type GetCoinHistoryResponse = {
  user_id: number;
  interval: string;
  from: string | null;
  to: string | null;
  data: {
    current_page: number;
    data: CoinHistoryItem[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
};

export type GetCoinHistoryRequest = {
  userId: string;
  interval?: string;
  from?: string;
  to?: string;
  page?: number;
  per_page?: string;
};

// Refill Request Types
export type RequestRefillRequest =
  | {
    wallet_type: 'money';
    target_user_id: number;
    money_amount: string;
    note: string;
  }
  | {
    wallet_type: 'coins';
    target_user_id: number;
    coins_amount: string;
    note: string;
  };

export type RefillRequest = {
  id: number;
  wallet_type: string;
  status: string;
  requested_by: number;
  target_user_id: number;
  coins_amount: number | null;
  money_amount: string;
  note: string;
  idempotency_key: string;
  approved_by: number | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
};

export type RequestRefillResponse = {
  message: string;
  data: {
    idempotent: boolean;
    auto_approved: boolean;
    request: RefillRequest;
  };
};

export type RequestLoanRequest = {
  borrower_user_id: string;
  amount: string;
  note: string;
};

export type RequestLoanResponse = {
  message: string;
  data: any;
};

export type ConvertMoneyToCoinRequest = {
  amount: number;
};

export type ConvertMoneyToCoinResponse = {
  message: string;
  data: {
    ok: boolean;
    idempotent: boolean;
    transaction_id: number;
    money_spent: number;
    coins_added: number;
    rate_used: number;
    money_before: number;
    money_after: number;
    coins_before: number;
    coins_after: number;
  };
};

export type GetCoinsRateResponse = {
  coin_to_money_rate: number;
};

export type RepayLoanRequest = {
  amount: number;
  note: string;
  photo: any; // Used for FormData
};

export type RepayLoanResponse = {
  message: string;
  data: any;
};
