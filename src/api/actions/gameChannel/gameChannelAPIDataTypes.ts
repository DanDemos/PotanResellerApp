export type User = {
  id: number;
  name: string;
  type: string;
};

export type GameRegionPivot = {
  game_id: number;
  region_id: number;
  created_at: string;
  updated_at: string;
};

export type GameRegion = {
  id: number;
  uuid: string;
  code: string;
  name: string;
  is_active: boolean;
  pivot: GameRegionPivot;
};

export type Game = {
  id: number;
  uuid: string;
  name: string;
  regions?: GameRegion[];
};

export type Message = {
  id: number;
  channel_id: number;
  sender_id: number;
  body: string;
  read_at: string | null;
  created_at: string;
  updated_at: string;
  sender: User;
  kind?: 'user' | 'bot' | string;
};

export type Channel = {
  id: number;
  uuid: string;
  game_id: number;
  user_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  game: Game;
  user: User;
  last_message: Message | null;
  // UI helper fields (not in API yet)
  isPinned?: boolean;
};

export type GetChannelsResponse = {
  current_page: number;
  data: Channel[];
  total: number;
};

export type GetChannelsRequest = void;

export type GetChannelMessagesResponse = {
  channel: Channel;
  messages: {
    current_page: number;
    data: Message[];
    total: number;
  };
};

export type GetChannelMessagesRequest = string; // channel_uuid

export type MarkMessageAsReadRequest = number; // message_id

export type MarkMessageAsReadResponse = {
  ok: boolean;
  message?: string;
};

export type CreateOrderRequest = {
  region_id: number;
  product: string;
  product_id: number;
};

export type CreateOrderResponse = {
  message: string;
};

type PaginationLink = {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
};

export type GetChatHistoryResponse = {
  channel: Channel;
  game: Game;
  messages: {
    current_page: number;
    data: Message[];
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
};

export type GetChatHistoryRequest = {
  game_id: number;
  page?: number;
  per_page?: number;
};

export type SendChatMessageRequest = {
  channelUuid: string;
  body: string;
}

export type SendChatMessageResponse = {
  message: string;
}