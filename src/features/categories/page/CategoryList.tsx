import { useState } from 'react';
import { useGetAllCategoryQuery } from '../api/categoryApis';
import { showModal } from '../../../redux/slice/modalSlice';
import type { ICategory } from '../category.interface';
import AddCategory from '../components/AddCategory';
import { useAppDispatch } from '../../../hooks/hooks';
import usePagination from '../../../components/common/hooks/usePagination';
import useUrlParams from '../../../components/common/hooks/useUrlParams';
import { CheckBoxTable } from '../../../components/common/checkbox-table';
import EditButton from '../../../components/common/edit-button';

const CategoryList = () => {
  const dispatch = useAppDispatch();
  const [checkedList, setCheckedList] = useState<(keyof ICategory)[]>([
    'key',
    'name',
    'description',
    'createdAt',
    'action',
  ]);

  const { limit, offset, changePagination, pagination } = usePagination();
  const { getAllUrlParams } = useUrlParams();

  const { data, isLoading, isFetching, refetch } = useGetAllCategoryQuery({
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
        { title: 'Description', key: 'description', dataIndex: 'description' },

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
                      content: <AddCategory data={rec} />,
                      title: 'Add new category',
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
        content: <AddCategory />,
        title: 'Add new category',
        show: true,
        width: 400,
      }}
      buttonLabel='Add Category'
      count={data?.count}
    />
  );
};

export default CategoryList;
