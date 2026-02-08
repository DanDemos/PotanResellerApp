import { BACKEND_API_URL } from '@env';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/redux/store';
import {
  GetWalletBalanceRequest,
  GetWalletBalanceResponse,
  GetCoinsDataRequest,
  GetCoinsDataResponse,
  GetCoinHistoryRequest,
  GetCoinHistoryResponse,
  RequestRefillRequest,
  RequestRefillResponse,
  GetMoneyHistoryGroupedRequest,
  GetMoneyHistoryGroupedResponse,
  RequestLoanRequest,
  RequestLoanResponse,
  ConvertMoneyToCoinRequest,
  ConvertMoneyToCoinResponse,
  GetCoinsRateResponse,
  RepayLoanRequest,
  RepayLoanResponse,
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
      if (!headers.has('Accept')) {
        headers.set('Accept', 'application/json');
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
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
    requestRefill: builder.mutation<RequestRefillResponse, RequestRefillRequest>({
      query: (body) => ({
        url: '/refills/request',
        method: 'POST',
        body,
        headers: {
          'Idempotency-Key': `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
        },
      }),
    }),
    getMoneyHistoryGrouped: builder.query<
      GetMoneyHistoryGroupedResponse,
      GetMoneyHistoryGroupedRequest
    >({
      query: (params) => ({
        url: '/money/historyGrouped',
        method: 'GET',
        params,
      }),
    }),
    requestLoan: builder.mutation<RequestLoanResponse, RequestLoanRequest>({
      query: (body) => ({
        url: '/money/loan',
        method: 'POST',
        body,
        headers: {
          'Idempotency-Key': `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
        },
      }),
    }),
    convertMoneyToCoin: builder.mutation<ConvertMoneyToCoinResponse, ConvertMoneyToCoinRequest>({
      query: (body) => ({
        url: '/money/convert',
        method: 'POST',
        body,
        headers: {
          'Idempotency-Key': `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
        },
      }),
    }),
    getCoinsRate: builder.query<GetCoinsRateResponse, void>({
      query: () => ({
        url: '/coins/rate',
        method: 'GET',
      }),
    }),
    repayLoan: builder.mutation<RepayLoanResponse, FormData>({
      query: (body) => ({
        url: '/money/loan/repay/request',
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
  useGetWalletBalanceQuery,
  useGetCoinsDataQuery,
  useGetCoinHistoryQuery,
  useRequestRefillMutation,
  useGetMoneyHistoryGroupedQuery,
  useRequestLoanMutation,
  useConvertMoneyToCoinMutation,
  useGetCoinsRateQuery,
  useRepayLoanMutation,
} = walletApi;
