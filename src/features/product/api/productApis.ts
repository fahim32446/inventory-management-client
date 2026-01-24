import { HTTPResponse, IQuery } from "../../../components/common/type";
import { baseApi } from "../../../redux/api/baseApi";
import { formatQueryParams } from "../../../utils/helper";
import type { IAddProduct, IProduct } from "../product.interface";

export const productApis = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllProduct: build.query<HTTPResponse<IProduct[]>, IQuery | void>({
      query: (arg) => {
        const query = formatQueryParams(arg);
        return {
          url: `/product?${query}`,
          method: "GET",
        };
      },
      providesTags: () => ["PRODUCT"],
    }),

    addProduct: build.mutation<HTTPResponse<void>, IAddProduct>({
      query: (body) => {
        return {
          url: `/product`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: () => ["PRODUCT"],
    }),
  }),
});

export const { useGetAllProductQuery, useAddProductMutation } = productApis;
