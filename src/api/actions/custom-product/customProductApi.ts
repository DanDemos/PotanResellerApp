import { rtkBaseApi } from '@/api/fetchers/rtkBaseApi';
import { ENDPOINTS } from '@/api/endpoints';
import {
  GetCustomProductListResponse,
  GetCustomProductListRequest,
  GetCategoriesResponse,
  GetCategoriesRequest,
  PurchaseCustomProductResponse,
  PurchaseCustomProductRequest,
  GetPurchaseProductHistoryResponse,
  GetPurchaseProductHistoryRequest,
} from '@/api/actions/custom-product/customProductAPIDataTypes';

export const customProductApi = rtkBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategoryList: builder.query<GetCategoriesResponse, GetCategoriesRequest>({
      query: (params) => ({
        url: ENDPOINTS.CUSTOM_PRODUCT.GET_CATEGORIES,
        method: 'GET',
        params,
      }),
    }),
    getCustomProductList: builder.query<GetCustomProductListResponse, GetCustomProductListRequest>({
      query: (params) => ({
        url: ENDPOINTS.CUSTOM_PRODUCT.GET_PRODUCT_LIST,
        method: 'GET',
        params,
      }),
    }),
    getPurchaseProductHistory: builder.query<GetPurchaseProductHistoryResponse, GetPurchaseProductHistoryRequest>({
      query: (params) => ({
        url: ENDPOINTS.CUSTOM_PRODUCT.GET_PURCHASE_PRODUCT_HISTORY,
        method: 'GET',
        params,
      }),
    }),
    PurchaseCustomProduct: builder.mutation<PurchaseCustomProductResponse, PurchaseCustomProductRequest>({
      query: (body) => ({
        url: ENDPOINTS.CUSTOM_PRODUCT.PURCHASE_PRODUCT,
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetCustomProductListQuery, useGetCategoryListQuery, usePurchaseCustomProductMutation, useGetPurchaseProductHistoryQuery } = customProductApi;

