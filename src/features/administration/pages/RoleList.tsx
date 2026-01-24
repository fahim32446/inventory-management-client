import { Tag } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckBoxTable } from '../../../components/common/checkbox-table';
import EditButton from '../../../components/common/edit-button';
import type { IRoleList } from '../administration.interface';
import { useGetRoleListQuery } from '../api/administrationApiEndpoints';

const RoleList = () => {
  const navigate = useNavigate();
  const [checkedList, setCheckedList] = useState<(keyof IRoleList)[]>([
    'key',
    'name',
    'isAdmin',
    'action',
  ]);

  const { data, isLoading, refetch } = useGetRoleListQuery();

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
        {
          title: 'Main role',
          key: 'isAdmin',
          dataIndex: 'isAdmin',
          render: (isAdmin: boolean) => (isAdmin ? <Tag color='success'>Yes</Tag> : <Tag>No</Tag>),
        },
        {
          title: 'Action',
          key: 'action',
          dataIndex: 'action',
          render: (_, rec) => {
            return (
              <EditButton onClick={() => navigate(`/administration/role/update/${rec.roleId}`)}>
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
    />
  );
};

export default RoleList;
