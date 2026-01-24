import { HTTPResponse, IQuery } from "../../../components/common/type";
import { baseApi } from "../../../redux/api/baseApi";
import { formatQueryParams } from "../../../utils/helper";
import type { IAddSupplier, ISupplier } from "../supplier.interface";

export const suppliersApis = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllSupplier: build.query<HTTPResponse<ISupplier[]>, IQuery>({
      query: (arg) => {
        const query = formatQueryParams(arg);
        return {
          url: `/supplier?${query}`,
          method: "GET",
        };
      },
      providesTags: () => ["SUPPLIER"],
    }),

    addSupplier: build.mutation<HTTPResponse<void>, IAddSupplier>({
      query: (body) => {
        return {
          url: `/supplier`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: () => ["SUPPLIER"],
    }),
    updateSupplier: build.mutation<HTTPResponse<void>, { body: IAddSupplier; id: number }>({
      query: ({ body, id }) => {
        return {
          url: `/supplier/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: () => ["SUPPLIER"],
    }),
  }),
});

export const { useGetAllSupplierQuery, useAddSupplierMutation, useUpdateSupplierMutation } =
  suppliersApis;
