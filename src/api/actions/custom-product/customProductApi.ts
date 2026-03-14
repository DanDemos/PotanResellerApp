import { rtkBaseApi } from '@/api/fetchers/rtkBaseApi';
import { ENDPOINTS } from '@/api/endpoints';
import { 
  GetCustomProductPurchasesResponse, 
  GetCustomProductPurchasesRequest 
} from '@/api/actions/custom-product/customProductAPIDataTypes';

export const customProductApi = rtkBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomProductPurchases: builder.query<GetCustomProductPurchasesResponse, GetCustomProductPurchasesRequest>({
      query: () => ({
        url: ENDPOINTS.CUSTOM_PRODUCT.GET_PURCHASES,
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetCustomProductPurchasesQuery } = customProductApi;

