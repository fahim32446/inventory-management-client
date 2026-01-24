import { HTTPResponse, IQuery } from '../../../components/common/type';
import { baseApi } from '../../../redux/api/baseApi';
import { formatQueryParams } from '../../../utils/helper';
import { IEmployee } from './employee.interface';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployee: builder.query<HTTPResponse<IEmployee[]>, IQuery>({
      query: (arg) => {
        const query = formatQueryParams(arg);
        return {
          url: `/admin/employee?${query}`,
          method: 'GET',
        };
      },
      providesTags: ['EMPLOYEE'],
    }),
    createEmployee: builder.mutation<HTTPResponse<void>, FormData>({
      query: (body) => {
        return {
          url: `/admin/employee`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['EMPLOYEE'],
    }),
  }),
});

export const { useGetEmployeeQuery, useCreateEmployeeMutation } = authApi;
