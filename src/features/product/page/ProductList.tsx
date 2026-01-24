import { useState } from 'react';
import { CheckBoxTable } from '../../../components/common/checkbox-table';
import usePagination from '../../../components/common/hooks/usePagination';
import useUrlParams from '../../../components/common/hooks/useUrlParams';
import { useGetAllProductQuery } from '../api/productApis';
import type { IProduct } from '../product.interface';

const ProductList = () => {
  const [checkedList, setCheckedList] = useState<(keyof IProduct)[]>([
    'key',
    'name',
    'description',
    'sku',
    'action',
  ]);

  const { limit, offset, changePagination, pagination } = usePagination();
  const { getAllUrlParams } = useUrlParams();

  const { data, isLoading, isFetching, refetch } = useGetAllProductQuery({
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
        { title: 'Description', key: 'description', dataIndex: 'description' },
        { title: 'SKU', key: 'sku', dataIndex: 'sku' },
        {
          title: 'Action',
          key: 'action',
          dataIndex: 'action',
        },
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

export default ProductList;
