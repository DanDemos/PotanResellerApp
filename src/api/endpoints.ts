/**
 * Centralized API Registry
 * 
 * 1. Endpoints: All API URLs are defined here as a single source of truth.
 * 2. Note: Data Types must be imported directly from their respective functional folders
 *    (e.g., import { LoginRequest } from './actions/auth/authDataTypes')
 */

// --- 1. Centralized Endpoints (URLs) ---
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    LOGOUT: '/logout',
    CHANGE_PASSWORD: '/change-password',
  },
  USER: {
    GET_ME: '/me',
    NOTIFICATIONS: '/notifications',
    MARK_NOTIFICATION_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_NOTIFICATIONS_READ: '/notifications/read-all',
  },
  WALLET: {
    GET_BALANCE: '/money/me',
    GET_COINS_DATA: '/coins/me',
    GET_COIN_HISTORY: '/coins/history',
    REQUEST_REFILL: '/refills/request',
    GET_MONEY_HISTORY_GROUPED: '/money/historyGrouped',
    REQUEST_LOAN: '/money/loan',
    CONVERT_MONEY_TO_COIN: '/money/convert',
    GET_COINS_RATE: '/coins/rate',
    REPAY_LOAN: '/money/loan/repay/request',
    GET_PENDING_LOANS: '/money/loan/pending',
    GET_REPAY_REQUESTS: '/money/loan/repay/my-requests',
  },
  GAME_CHANNEL: {
    GET_CHANNELS: '/games',
    SEND_CHAT_MESSAGE: (game_id: string) => `/chat/channels/${game_id}/messages`,
    GET_CHANNEL_MESSAGES: (channelUuid: string) => `/chat/channels/${channelUuid}`,
    MARK_MESSAGE_READ: (messageId: number) => `/chat/messages/${messageId}/read`,
  },
  GIFT_CARD: {
    GET_CATEGORIES: '/categories',
    GET_GIFT_CARD_LIST: '/custom-products',
    PURCHASE_GIFT_CARD: '/custom-product-purchases',
    GET_GIFT_CARD_HISTORY: '/custom-product-purchases',
  },
} as const;