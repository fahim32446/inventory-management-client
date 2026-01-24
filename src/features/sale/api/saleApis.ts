import { HTTPResponse, IQuery } from "../../../components/common/type";
import { baseApi } from "../../../redux/api/baseApi";
import { formatQueryParams } from "../../../utils/helper";
import type {
  IAddPurISale,
  ISaleList,
  ISalesGetForEdit,
  ISelectStockProduct,
} from "../sale.interface";

export const saleApis = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllSale: build.query<HTTPResponse<ISaleList[]>, IQuery>({
      query: (arg) => {
        const query = formatQueryParams(arg);
        return {
          url: `/stock/sale?${query}`,
          method: "GET",
        };
      },
      providesTags: () => ["SALES"],
    }),
    getStockProduct: build.query<HTTPResponse<ISelectStockProduct[]>, IQuery>({
      query: (arg) => {
        const query = formatQueryParams(arg);
        return {
          url: `/stock/product?${query}`,
          method: "GET",
        };
      },
      providesTags: () => ["SALES"],
    }),

    getSalesForEdit: build.query<HTTPResponse<ISalesGetForEdit>, { id?: string }>({
      query: ({ id }) => {
        return {
          url: `/stock/sale/get-for-edit/${id}`,
          method: "GET",
        };
      },
      providesTags: () => ["SALES"],
    }),

    addSale: build.mutation<HTTPResponse<void>, IAddPurISale>({
      query: (body) => {
        return {
          url: `/stock/sale`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: () => ["SALES"],
    }),
    updateSale: build.mutation<HTTPResponse<void>, { body: IAddPurISale; saleId: any }>({
      query: ({ body, saleId }) => {
        return {
          url: `/stock/sale/${saleId}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: () => ["SALES"],
    }),
    deleteSale: build.mutation<HTTPResponse<void>, { saleId: number | string }>({
      query: ({ saleId }) => {
        return {
          url: `/stock/sale/${saleId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: () => ["SALES"],
    }),
  }),
});

export const {
  useGetAllSaleQuery,
  useAddSaleMutation,
  useUpdateSaleMutation,
  useDeleteSaleMutation,
  useGetStockProductQuery,
  useGetSalesForEditQuery,
} = saleApis;
