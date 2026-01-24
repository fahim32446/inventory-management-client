import { HTTPResponse, IQuery } from "../../../components/common/type";
import { baseApi } from "../../../redux/api/baseApi";
import { formatQueryParams } from "../../../utils/helper";
import type { IAddPurIPurchase, IPurchase } from "../purchase.interface";

export const purchaseApis = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllPurchase: build.query<HTTPResponse<IPurchase[]>, IQuery>({
      query: (arg) => {
        const query = formatQueryParams(arg);
        return {
          url: `/stock/purchase?${query}`,
          method: "GET",
        };
      },
      providesTags: () => ["PURCHASE"],
    }),

    addPurchase: build.mutation<HTTPResponse<void>, IAddPurIPurchase>({
      query: (body) => {
        return {
          url: `/stock/purchase`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: () => ["PURCHASE"],
    }),
    updatePurchase: build.mutation<
      HTTPResponse<void>,
      { body: IAddPurIPurchase; purchaseId: number | string }
    >({
      query: ({ body, purchaseId }) => {
        return {
          url: `/stock/purchase/${purchaseId}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: () => ["PURCHASE"],
    }),
    deletePurchase: build.mutation<HTTPResponse<void>, { purchaseId: number | string }>({
      query: ({ purchaseId }) => {
        return {
          url: `/stock/purchase/${purchaseId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: () => ["PURCHASE"],
    }),
  }),
});

export const {
  useGetAllPurchaseQuery,
  useAddPurchaseMutation,
  useUpdatePurchaseMutation,
  useDeletePurchaseMutation,
} = purchaseApis;
