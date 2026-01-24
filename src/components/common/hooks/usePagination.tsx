import type { TablePaginationConfig } from 'antd';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { isObjectEmpty } from '../../../utils/helper';
import useUrlParams from './useUrlParams';

export interface Pagination {
  current: number;
  pageSize: number;
}

interface UsePaginationProps {
  search?: string;
  defaultPageSize?: number;
}

interface UsePaginationReturn {
  pagination: Pagination;
  handlePaginationChange: (current: number, pageSize: number) => void;
  resetPagination: () => void;
  limit: number;
  offset: number;
  changePagination: any;
}

const usePagination = ({
  search = '',
  defaultPageSize = 100,
}: UsePaginationProps = {}): UsePaginationReturn => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { getAllUrlParams } = useUrlParams();
  const ifParams = !isObjectEmpty(getAllUrlParams());

  const getPaginationFromParams = (): Pagination => {
    const current = parseInt(searchParams.get('current') || '1', 10);
    const pageSize = parseInt(
      searchParams.get('pageSize') || defaultPageSize?.toString(),
      10
    );
    return { current, pageSize };
  };

  const setPaginationToParams = (pagination: Pagination): void => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('current', pagination.current?.toString());
    newParams.set('pageSize', pagination.pageSize?.toString());
    setSearchParams(newParams);
  };

  const pagination = getPaginationFromParams();
  const limit = pagination.pageSize;
  const offset = (pagination.current - 1) * pagination.pageSize;

  const handlePaginationChange = 
    (current: number, pageSize: number) => {
      const newPagination = { current, pageSize };
      setPaginationToParams(newPagination);
    }

  const resetPagination = () => {
    const defaultPagination = { current: 1, pageSize: defaultPageSize };
    setPaginationToParams(defaultPagination);
  }

  const changePagination = (
    total?: number
  ): false | TablePaginationConfig | undefined => {
    return total !== undefined && total < defaultPageSize
      ? false
      : {
          ...pagination,
          total: total,
          showSizeChanger: true,
          pageSizeOptions: ['100', '300', '500'],
          onChange: handlePaginationChange,
          size: 'small',
        };
  };

  useEffect(() => {
    if (search && ifParams) {
      resetPagination();
    }
  }, [search, resetPagination, ifParams]);

  return {
    pagination,
    handlePaginationChange,
    resetPagination,
    limit,
    offset,
    changePagination,
  };
};

export default usePagination;
