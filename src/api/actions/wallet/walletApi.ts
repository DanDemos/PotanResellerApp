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
  GetCoinHistoryResponse
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
  }),
});

export const {
  useGetMoneyHistoryQuery,
  useGetWalletBalanceQuery,
  useGetCoinsDataQuery,
  useGetCoinHistoryQuery
} = walletApi;
