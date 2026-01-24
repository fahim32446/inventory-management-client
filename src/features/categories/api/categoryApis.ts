import { HTTPResponse, IQuery } from "../../../components/common/type";
import { baseApi } from "../../../redux/api/baseApi";
import { formatQueryParams } from "../../../utils/helper";
import type { ICategory } from "../category.interface";

export const categoryApis = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllCategory: build.query<HTTPResponse<ICategory[]>, IQuery>({
      query: (arg) => {
        const query = formatQueryParams(arg);
        return {
          url: `/category?${query}`,
          method: "GET",
        };
      },
      providesTags: () => ["CATEGORY"],
    }),

    addCategory: build.mutation<HTTPResponse<void>, ICategory>({
      query: (body) => {
        return {
          url: `/category`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: () => ["CATEGORY"],
    }),

    updateCategory: build.mutation<HTTPResponse<void>, { body: ICategory; id: string }>({
      query: ({ body, id }) => {
        return {
          url: `/category/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: () => ["CATEGORY"],
    }),
  }),
});

export const { useGetAllCategoryQuery, useAddCategoryMutation, useUpdateCategoryMutation } =
  categoryApis;
