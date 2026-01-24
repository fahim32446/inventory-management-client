import { HTTPResponse, IQuery } from "../../../components/common/type";
import { baseApi } from "../../../redux/api/baseApi";
import { formatQueryParams } from "../../../utils/helper";
import type { ISalesReport, IStockReport } from "../report.interface";

export const reportApiEndpoints = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSalesReport: build.query<HTTPResponse<ISalesReport[]>, IQuery | void>({
      query: (arg) => {
        const query = formatQueryParams(arg);
        return {
          url: `stock/report/sales?${query}`,
          method: "GET",
        };
      },
      providesTags: () => ["PRODUCT"],
    }),

    getStockReport: build.query<HTTPResponse<IStockReport[]>, IQuery | void>({
      query: () => {
        return {
          url: `/stock/report/stock`,
          method: "GET",
        };
      },
      providesTags: () => ["PRODUCT"],
    }),
  }),
});

export const { useGetSalesReportQuery, useGetStockReportQuery } = reportApiEndpoints;
