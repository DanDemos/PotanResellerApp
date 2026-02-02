export type User = {
  id: number;
  name: string;
  type: string;
};

export type Game = {
  id: number;
  uuid: string;
  name: string;
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
