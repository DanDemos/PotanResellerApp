import { rtkBaseApi } from '@/api/fetchers/rtkBaseApi';
import { ENDPOINTS } from '@/api/endpoints';
import {
  GetGiftCardListResponse,
  GetGiftCardListRequest,
  GetCategoriesResponse,
  GetCategoriesRequest,
  PurchaseGiftCardResponse,
  PurchaseGiftCardRequest,
  GetGiftCardHistoryResponse,
  GetGiftCardHistoryRequest,
} from '@/api/actions/gift-card/giftCardAPIDataTypes';

export const giftCardApi = rtkBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategoryList: builder.query<GetCategoriesResponse, GetCategoriesRequest>({
      query: (params) => ({
        url: ENDPOINTS.GIFT_CARD.GET_CATEGORIES,
        method: 'GET',
        params,
      }),
    }),
    getGiftCardList: builder.query<GetGiftCardListResponse, GetGiftCardListRequest>({
      query: (params) => ({
        url: ENDPOINTS.GIFT_CARD.GET_GIFT_CARD_LIST,
        method: 'GET',
        params,
      }),
    }),
    getGiftCardHistory: builder.query<GetGiftCardHistoryResponse, GetGiftCardHistoryRequest>({
      query: (params) => ({
        url: ENDPOINTS.GIFT_CARD.GET_GIFT_CARD_HISTORY,
        method: 'GET',
        params,
      }),
    }),
    purchaseGiftCard: builder.mutation<PurchaseGiftCardResponse, PurchaseGiftCardRequest>({
      query: (body) => ({
        url: ENDPOINTS.GIFT_CARD.PURCHASE_GIFT_CARD,
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetGiftCardListQuery, useGetCategoryListQuery, usePurchaseGiftCardMutation, useGetGiftCardHistoryQuery } = giftCardApi;

