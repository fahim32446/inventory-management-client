import { useState } from 'react';
import { showModal } from '../../../redux/slice/modalSlice';
import {
  useDeletePurchaseMutation,
  useGetAllPurchaseQuery,
} from '../api/purchaseApis';
import type { IPurchase } from '../purchase.interface';
import { default as AddPurchase, default as AddSuppliers } from './AddPurchase';
import { Flex } from 'antd';
import { useAppDispatch } from '../../../hooks/hooks';
import usePagination from '../../../components/common/hooks/usePagination';
import useUrlParams from '../../../components/common/hooks/useUrlParams';
import { CheckBoxTable } from '../../../components/common/checkbox-table';
import EditButton from '../../../components/common/edit-button';
import DeleteButton from '../../../components/common/delete-button';

const PurchaseList = () => {
  const [checkedList, setCheckedList] = useState<(keyof IPurchase)[]>([
    'key',
    'purchaseDate',
    'supplier_name',
    'product_name',
    'quantity',
    'unitCost',
    'subtotal',
    'action',
  ]);

  const dispatch = useAppDispatch();
  const { limit, offset, changePagination, pagination } = usePagination();
  const { getAllUrlParams } = useUrlParams();

  const [deletePurchase, { isLoading: loadingDelete }] =
    useDeletePurchaseMutation();

  const { data, isLoading, isFetching, refetch } = useGetAllPurchaseQuery({
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
            <>
              {((pagination?.current || 1) - 1) * (pagination?.pageSize || 20) +
                1 +
                index}
            </>
          ),
        },
        {
          title: 'Date',
          key: 'purchaseDate',
          dataIndex: 'purchaseDate',
        },
        {
          title: 'Supplier name',
          key: 'supplier_name',
          dataIndex: 'supplier_name',
        },
        {
          title: 'Product name',
          key: 'product_name',
          dataIndex: 'product_name',
        },
        { title: 'Quantity', key: 'quantity', dataIndex: 'quantity' },
        { title: 'Per unit', key: 'unitCost', dataIndex: 'unitCost' },
        { title: 'Total', key: 'subtotal', dataIndex: 'subtotal' },
        {
          title: 'Action',
          key: 'action',
          dataIndex: 'action',
          render: (_, rec) => (
            <Flex gap='8px'>
              <EditButton
                onClick={() =>
                  dispatch(
                    showModal({
                      content: <AddSuppliers data={rec} />,
                      title: 'Update purchase information',
                      width: 400,
                    })
                  )
                }
              >
                Edit
              </EditButton>

              <DeleteButton
                onConfirm={() => deletePurchase({ purchaseId: rec.purchaseId })}
                loading={loadingDelete}
              >
                Delete
              </DeleteButton>
            </Flex>
          ),
        },
      ]}
      setCheckedList={setCheckedList}
      pagination={changePagination(data?.count)}
      data={dataWithKey}
      loading={isLoading || isFetching}
      refetch={refetch}
      openModal={{
        content: <AddPurchase />,
        show: true,
        title: 'Add new purchase',
        width: 400,
      }}
      buttonLabel='Add New Purchase'
      count={data?.count}
    />
  );
};

export default PurchaseList;
