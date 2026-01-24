import { useState } from 'react';
import { showModal } from '../../../redux/slice/modalSlice';
import { useGetAllSupplierQuery } from '../api/suppliersApis';
import type { ISupplier } from '../supplier.interface';
import AddSuppliers from './AddSuppliers';
import { useAppDispatch } from '../../../hooks/hooks';
import usePagination from '../../../components/common/hooks/usePagination';
import useUrlParams from '../../../components/common/hooks/useUrlParams';
import { CheckBoxTable } from '../../../components/common/checkbox-table';
import EditButton from '../../../components/common/edit-button';

const SuppliersList = () => {
  const [checkedList, setCheckedList] = useState<(keyof ISupplier)[]>([
    'key',
    'name',
    'phone',
    'email',
    'address',
    'action',
  ]);

  const dispatch = useAppDispatch();
  const { limit, offset, changePagination, pagination } = usePagination();
  const { getAllUrlParams } = useUrlParams();

  const { data, isLoading, isFetching, refetch } = useGetAllSupplierQuery({
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
        { title: 'Name', key: 'name', dataIndex: 'name' },
        { title: 'Phone', key: 'phone', dataIndex: 'phone' },
        { title: 'Email', key: 'email', dataIndex: 'email' },
        { title: 'ADDRESS', key: 'address', dataIndex: 'address' },
        {
          title: 'Action',
          key: 'action',
          dataIndex: 'action',
          render: (_, rec) => (
            <>
              <EditButton
                onClick={() =>
                  dispatch(
                    showModal({
                      content: <AddSuppliers data={rec} />,
                      title: 'Add new category',
                      width: 400,
                    })
                  )
                }
              >
                Edit
              </EditButton>
            </>
          ),
        },
      ]}
      setCheckedList={setCheckedList}
      pagination={changePagination(data?.count)}
      data={dataWithKey}
      loading={isLoading || isFetching}
      refetch={refetch}
      openModal={{
        content: <AddSuppliers />,
        show: true,
        title: 'Add supplier',
        width: 400,
      }}
      buttonLabel='Add Supplier'
      count={data?.count}
    />
  );
};

export default SuppliersList;
