
import { HTTPResponse, IQuery } from '../../../components/common/type';
import { baseApi } from '../../../redux/api/baseApi';
import { formatQueryParams } from '../../../utils/helper';
import type { IWarehouse } from '../warehouse.interface';

export const warehouseApis = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllWarehouse: build.query<HTTPResponse<IWarehouse[]>, IQuery>({
      query: (arg) => {
        const query = formatQueryParams(arg);
        return {
          url: `/warehouse?${query}`,
          method: 'GET',
        };
      },
      providesTags: () => ['WAREHOUSE'],
    }),

    addWarehouse: build.mutation<HTTPResponse<void>, IWarehouse>({
      query: (body) => {
        return {
          url: `/warehouse`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: () => ['WAREHOUSE'],
    }),

    updateWarehouse: build.mutation<
      HTTPResponse<void>,
      { body: IWarehouse; id: number }
    >({
      query: ({ body, id }) => {
        return {
          url: `/warehouse/${id}`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: () => ['WAREHOUSE'],
    }),
  }),
});

export const {
  useGetAllWarehouseQuery,
  useAddWarehouseMutation,
  useUpdateWarehouseMutation,
} = warehouseApis;
