export interface HTTPResponse<T> {
  success: boolean;
  count?: number;
  result?: T;
  message?: string;
}
export interface IQuery {
  limit?: number;
  offset?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}
