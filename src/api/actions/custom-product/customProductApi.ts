import { BACKEND_API_URL } from '@env';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { GetCustomProductPurchasesResponse, GetCustomProductPurchasesRequest } from '@/api/actions/custom-product/customProductAPIDataTypes';
import type { RootState } from '@/redux/store';

console.log(BACKEND_API_URL, "BACKEND_API_URL in customProductApi")
export const customProductApi = createApi({
  reducerPath: 'customProductApi',
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
    getCustomProductPurchases: builder.query<GetCustomProductPurchasesResponse, GetCustomProductPurchasesRequest>({
      query: () => ({
        url: '/custom-product-purchases',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetCustomProductPurchasesQuery } = customProductApi;
