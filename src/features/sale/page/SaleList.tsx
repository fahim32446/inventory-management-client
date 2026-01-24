import { Flex, Table } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckBoxTable } from '../../../components/common/checkbox-table';
import EditButton from '../../../components/common/edit-button';
import usePagination from '../../../components/common/hooks/usePagination';
import useUrlParams from '../../../components/common/hooks/useUrlParams';
import { useGetAllSaleQuery } from '../api/saleApis';
import type { ISaleList } from '../sale.interface';

const SaleList = () => {
  const [checkedList, setCheckedList] = useState<(keyof ISaleList)[]>([
    'key',
    'saleDate',
    'customerName',
    'totalQuantity',
    'totalPrice',
    'saleId',
  ]);

  const navigate = useNavigate();

  const { limit, offset, changePagination, pagination } = usePagination();
  const { getAllUrlParams } = useUrlParams();



  const { data, isLoading, isFetching, refetch } = useGetAllSaleQuery({
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
      expandable={{
        expandedRowRender: (record) => (
          <Table
            rowKey='salesItemId'
            pagination={false}
            columns={[
              { title: 'SL.', key: 'sl', render: (_text, _record, index) => <>{index + 1}</> },
              { title: 'Item Name', dataIndex: 'product_name', key: 'product_name' },
              { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
              { title: 'Unit Price', dataIndex: 'unitPrice', key: 'unitPrice' },
              { title: 'Subtotal', dataIndex: 'subtotal', key: 'subtotal' },
            ]}
            dataSource={record.items}
            size='small'
          />
        ),

        rowExpandable: (record) => record.items?.length > 0,
      }}
      columns={[
        {
          title: 'SL.',
          key: 'key',
          dataIndex: 'key',
          render: (_, _data, index) => (
            <>{((pagination?.current || 1) - 1) * (pagination?.pageSize || 20) + 1 + index}</>
          ),
        },
        {
          title: 'Date',
          key: 'saleDate',
          dataIndex: 'saleDate',
        },
        {
          title: 'Customer name',
          key: 'customerName',
          dataIndex: 'customerName',
        },

        { title: 'Quantity', key: 'totalQuantity', dataIndex: 'totalQuantity' },
        { title: 'Total', key: 'totalPrice', dataIndex: 'totalPrice' },

        {
          title: 'Action',
          key: 'saleId',
          dataIndex: 'action',
          render: (_, rec) => (
            <Flex gap='8px'>
              <EditButton
                onClick={
                  () => navigate(`/sale/edit/${rec.saleId}`)
                  // dispatch(
                  //   showModal({
                  //     content: <AddSuppliers data={rec} />,
                  //     title: 'Update purchase information',
                  //     width: 400,
                  //   })
                  // )
                }
              >
                Edit
              </EditButton>

              {/* <DeleteButton
                onConfirm={() => deletePurchase({ purchaseId: rec.purchaseId })}
                loading={loadingDelete}
              >
                Delete
              </DeleteButton> */}
            </Flex>
          ),
        },
      ]}
      setCheckedList={setCheckedList}
      pagination={changePagination(data?.count)}
      data={dataWithKey}
      loading={isLoading || isFetching}
      refetch={refetch}
      addUrl='/sale/add'
      buttonLabel='Add New Sale'
      count={data?.count}
    />
  );
};

export default SaleList;
