import { rtkBaseApi } from '@/api/fetchers/rtkBaseApi';
import { ENDPOINTS } from '@/api/endpoints';
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
  GetPendingLoansRequest,
  GetPendingLoansResponse,
  GetRepayRequestsRequest,
  GetRepayRequestsResponse,
} from '@/api/actions/wallet/walletAPIDataTypes';

export const walletApi = rtkBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWalletBalance: builder.query<GetWalletBalanceResponse, GetWalletBalanceRequest>({
      query: () => ({
        url: ENDPOINTS.WALLET.GET_BALANCE,
        method: 'GET',
      }),
      providesTags: ['Wallet'],
    }),
    getCoinsData: builder.query<GetCoinsDataResponse, GetCoinsDataRequest>({
      query: () => ({
        url: ENDPOINTS.WALLET.GET_COINS_DATA,
        method: 'GET',
      }),
      providesTags: ['Wallet'],
    }),
    getCoinHistory: builder.query<GetCoinHistoryResponse, GetCoinHistoryRequest>({
      query: (params) => ({
        url: ENDPOINTS.WALLET.GET_COIN_HISTORY,
        method: 'GET',
        params,
      }),
      providesTags: ['Wallet'],
    }),
    requestRefill: builder.mutation<RequestRefillResponse, FormData>({
      query: (body) => ({
        url: ENDPOINTS.WALLET.REQUEST_REFILL,
        method: 'POST',
        body,
        headers: {
          'Idempotency-Key': `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
        },
      }),
      invalidatesTags: ['Wallet'],
    }),
    getMoneyHistoryGrouped: builder.query<
      GetMoneyHistoryGroupedResponse,
      GetMoneyHistoryGroupedRequest
    >({
      query: (params) => ({
        url: ENDPOINTS.WALLET.GET_MONEY_HISTORY_GROUPED,
        method: 'GET',
        params,
      }),
      providesTags: ['Wallet'],
    }),
    requestLoan: builder.mutation<RequestLoanResponse, RequestLoanRequest>({
      query: (body) => ({
        url: ENDPOINTS.WALLET.REQUEST_LOAN,
        method: 'POST',
        body,
        headers: {
          'Idempotency-Key': `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
        },
      }),
      invalidatesTags: ['Wallet'],
    }),
    convertMoneyToCoin: builder.mutation<ConvertMoneyToCoinResponse, ConvertMoneyToCoinRequest>({
      query: (body) => ({
        url: ENDPOINTS.WALLET.CONVERT_MONEY_TO_COIN,
        method: 'POST',
        body,
        headers: {
          'Idempotency-Key': `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
        },
      }),
      invalidatesTags: ['Wallet'],
    }),
    getCoinsRate: builder.query<GetCoinsRateResponse, void>({
      query: () => ({
        url: ENDPOINTS.WALLET.GET_COINS_RATE,
        method: 'GET',
      }),
    }),
    repayLoan: builder.mutation<RepayLoanResponse, FormData>({
      query: (body) => ({
        url: ENDPOINTS.WALLET.REPAY_LOAN,
        method: 'POST',
        body,
        headers: {
          'Idempotency-Key': `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
        },
      }),
      invalidatesTags: ['Wallet'],
    }),
    getPendingLoans: builder.query<GetPendingLoansResponse, GetPendingLoansRequest>({
      query: () => ({
        url: ENDPOINTS.WALLET.GET_PENDING_LOANS,
        method: 'GET',
      }),
      providesTags: ['Wallet'],
    }),
    getRepayRequests: builder.query<GetRepayRequestsResponse, GetRepayRequestsRequest>({
      query: (params) => ({
        url: ENDPOINTS.WALLET.GET_REPAY_REQUESTS,
        method: 'GET',
        params,
      }),
      providesTags: ['Wallet'],
    }),
  }),
  overrideExisting: false,
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
  useGetPendingLoansQuery,
  useGetRepayRequestsQuery,
} = walletApi;

