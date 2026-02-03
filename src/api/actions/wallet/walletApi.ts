import { BACKEND_API_URL } from '@env';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/redux/store';
import {
  GetMoneyHistoryRequest,
  GetMoneyHistoryResponse,
  GetWalletBalanceRequest,
  GetWalletBalanceResponse,
  GetCoinsDataRequest,
  GetCoinsDataResponse,
  GetCoinHistoryRequest,
  GetCoinHistoryResponse,
  RefillMoneyRequest,
  RefillMoneyResponse
} from '@/api/actions/wallet/walletAPIDataTypes';

export const walletApi = createApi({
  reducerPath: 'walletApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getMoneyHistory: builder.query<GetMoneyHistoryResponse, GetMoneyHistoryRequest>({
      query: (params) => ({
        url: '/money/history',
        method: 'GET',
        params,
      }),
    }),
    getWalletBalance: builder.query<GetWalletBalanceResponse, GetWalletBalanceRequest>({
      query: () => ({
        url: '/money/me',
        method: 'GET',
      }),
    }),
    getCoinsData: builder.query<GetCoinsDataResponse, GetCoinsDataRequest>({
      query: () => ({
        url: '/coins/me',
        method: 'GET',
      }),
    }),
    getCoinHistory: builder.query<GetCoinHistoryResponse, GetCoinHistoryRequest>({
      query: (params) => ({
        url: '/coins/history',
        method: 'GET',
        params,
      }),
    }),
    refillMoney: builder.mutation<RefillMoneyResponse, RefillMoneyRequest>({
      query: (body) => ({
        url: '/money/refill',
        method: 'POST',
        body,
        headers: {
          'Idempotency-Key': `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
        },
      }),
    }),
  }),
});

export const {
  useGetMoneyHistoryQuery,
  useGetWalletBalanceQuery,
  useGetCoinsDataQuery,
  useGetCoinHistoryQuery,
  useRefillMoneyMutation
} = walletApi;
