import { useState } from 'react';
import { useGetAllWarehouseQuery } from '../api/warehouseApis';
import { showModal } from '../../../redux/slice/modalSlice';
import AddWarehouse from '../components/AddWarehouse';
import type { IWarehouse } from '../warehouse.interface';
import usePagination from '../../../components/common/hooks/usePagination';
import { useAppDispatch } from '../../../hooks/hooks';
import useUrlParams from '../../../components/common/hooks/useUrlParams';
import EditButton from '../../../components/common/edit-button';
import { CheckBoxTable } from '../../../components/common/checkbox-table';

const WarehouseList = () => {
  const dispatch = useAppDispatch();
  const [checkedList, setCheckedList] = useState<(keyof IWarehouse)[]>([
    'key',
    'name',
    'location',
    'createdAt',
  ]);

  const { limit, offset, changePagination, pagination } = usePagination();
  const { getAllUrlParams } = useUrlParams();

  const { data, isLoading, isFetching, refetch } = useGetAllWarehouseQuery({
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
        { title: 'Created at', key: 'createdAt', dataIndex: 'createdAt' },
        { title: 'Name', key: 'name', dataIndex: 'name' },
        { title: 'Location', key: 'location', dataIndex: 'location' },

        {
          title: 'Action',
          key: 'action',
          dataIndex: 'action',
          render: (_, rec) => {
            return (
              // <Flex>
              <EditButton
                onClick={() =>
                  dispatch(
                    showModal({
                      content: <AddWarehouse data={rec} />,
                      title: 'Add new warehouse',
                      width: 400,
                    })
                  )
                }
              >
                Edit
              </EditButton>
              // </Flex>
            );
          },
        },
      ]}
      setCheckedList={setCheckedList}
      pagination={changePagination(data?.count)}
      data={dataWithKey}
      loading={isLoading || isFetching}
      refetch={refetch}
      openModal={{
        content: <AddWarehouse />,
        title: 'Add new warehouse',
        show: true,
        width: 400,
      }}
      buttonLabel='Add Warehouse'
      count={data?.count}
    />
  );
};

export default WarehouseList;
