import { Tag } from 'antd';
import { useState } from 'react';
import { showModal } from '../../../redux/slice/modalSlice';
import type { IUser } from '../administration.interface';
import { useGetUserQuery } from '../api/usersApiEndpoints';
import ManageUser from './ManageUser';
import { useAppDispatch } from '../../../hooks/hooks';
import { CheckBoxTable } from '../../../components/common/checkbox-table';
import EditButton from '../../../components/common/edit-button';

const Users = () => {
  const dispatch = useAppDispatch();

  const [checkedList, setCheckedList] = useState<(keyof IUser)[]>([
    'key',
    'name',
    'email',
    'type',
    'roleName',
    'action',
  ]);

  const { data, isLoading, refetch } = useGetUserQuery();

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
          render: (_, _data, index) => index + 1,
        },

        { title: 'Name', key: 'name', dataIndex: 'name' },
        { title: 'Email', key: 'email', dataIndex: 'email' },
        {
          title: 'Type',
          key: 'type',
          dataIndex: 'type',
          render: (type: string) =>
            type == 'EMPLOYEE' ? (
              <Tag color='warning'>{type}</Tag>
            ) : (
              <Tag color='success'>{type}</Tag>
            ),
        },
        {
          title: 'Roles',
          key: 'roleName',
          dataIndex: 'roleName',
          render: (roleName: string) => <Tag>{roleName}</Tag>,
        },

        {
          title: 'Action',
          key: 'action',
          dataIndex: 'action',
          render: (_, rec) => {
            return (
              <EditButton
                onClick={() =>
                  dispatch(
                    showModal({
                      content: <ManageUser data={rec} />,
                      title: 'User Details',
                      width: 600,
                    })
                  )
                }
              >
                Details
              </EditButton>
            );
          },
        },
      ]}
      setCheckedList={setCheckedList}
      pagination={false}
      data={dataWithKey}
      loading={isLoading}
      refetch={refetch}
      buttonLabel='Create role'
      addUrl='create'
      count={data?.count}
      openModal={{ content: <ManageUser />, title: 'Create User', width: 600, show: true }}
    />
  );
};

export default Users;
