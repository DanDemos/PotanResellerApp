export type MoneyHistoryItem = {
  id: number;
  type: string;
  amount: string;
};

export type GetMoneyHistoryResponse = {
  data: MoneyHistoryItem[];
};

export type GetMoneyHistoryRequest = {
  per_page?: string;
  type?: string;
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
  net_amount: number;
  tx_count: number;
};

export type GetCoinHistoryResponse = {
  user_id: number;
  interval: string;
  data: {
    data: CoinHistoryItem[];
  };
};

export type GetCoinHistoryRequest = {
  userId: string;
  interval?: string;
  from?: string;
  to?: string;
  per_page?: string;
};
