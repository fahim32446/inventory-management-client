import { IQuery } from "../../../components/common/type";
import { baseApi } from "../../../redux/api/baseApi";
import { IDashboard } from "../dashboard.interface";

export const dashboardApiEndpoints = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDashboardData: build.query<IDashboard, IQuery | void>({
      query: () => {
        return {
          url: `/dashboard/analytics`,
          method: "GET",
        };
      },
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetDashboardDataQuery } = dashboardApiEndpoints;
