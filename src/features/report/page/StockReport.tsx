import { useState } from 'react';
import usePagination from '../../../components/common/hooks/usePagination';
import { useGetStockReportQuery } from '../api/reportApiEndpoints';
import type { IStockReport } from '../report.interface';
import useUrlParams from '../../../components/common/hooks/useUrlParams';
import { CheckBoxTable } from '../../../components/common/checkbox-table';



const StockReport = () => {
  const [checkedList, setCheckedList] = useState<(keyof IStockReport)[]>([
    'key',
    'name',
    'totalPurchased',
    'totalSold',
    'currentStock',
  ]);

  const { limit, offset, changePagination, pagination } = usePagination();
  const { getAllUrlParams } = useUrlParams();

  const { data, isLoading, isFetching, refetch } = useGetStockReportQuery({
    ...getAllUrlParams(),
    limit,
    offset,
  });

  const dataWithKey = data?.result?.map((item, index) => ({
    key: String(index),
    ...item,
  }));

  return (
    <CheckBoxTable
      checkedList={checkedList}
      columns={[
        {
          title: 'SL.',
          key: 'key',
          dataIndex: 'key',
          render: (_, _data, index) => (
            <>{((pagination?.current || 1) - 1) * (pagination?.pageSize || 20) + 1 + index}</>
          ),
        },
        { title: 'Name', key: 'name', dataIndex: 'name' },
        { title: 'Total Sold', key: 'totalSold', dataIndex: 'totalSold' },
        { title: 'Total Purchased', key: 'totalPurchased', dataIndex: 'totalPurchased' },
        { title: 'Current Stock', key: 'currentStock', dataIndex: 'currentStock' },
      ]}
      setCheckedList={setCheckedList}
      pagination={changePagination(data?.count)}
      data={dataWithKey}
      loading={isLoading || isFetching}
      refetch={refetch}
      addUrl='/products/add'
      buttonLabel='Add Product'
      count={data?.count}
    />
  );
};

export default StockReport;
