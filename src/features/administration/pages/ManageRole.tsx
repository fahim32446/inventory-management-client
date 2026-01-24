import { SaveFilled } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Divider, Input, Row, Tag, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ICreateRole, IPermission, IRoleDetails } from '../administration.interface';
import {
  useCreateRoleMutation,
  useGetPermissionsQuery,
  useGetRoleDetailsQuery,
  useUpdateRoleMutation,
} from '../api/administrationApiEndpoints';

const { Title, Text } = Typography;

interface IGroupedPermissions {
  [key: string]: IPermission[];
}

interface RoleFormProps {
  initialRole?: IRoleDetails;
  permissions: IPermission[];
  roleId?: string;
}

const RoleForm = ({ initialRole, permissions, roleId }: RoleFormProps) => {
  const navigate = useNavigate();
  const [checkedIds, setCheckedIds] = useState<number[]>(
    initialRole?.permissions.map((item) => item.permissionId) || []
  );
  const [roleName, setRoleName] = useState<string>(initialRole?.name || '');

  const groupedPermissions = useMemo<IGroupedPermissions>(() => {
    return permissions.reduce((acc: IGroupedPermissions, item: IPermission) => {
      const [category] = item.key.split(':');
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});
  }, [permissions]);

  const onChange = (id: number): void => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleCategory = (categoryItems: IPermission[]): void => {
    const itemIds = categoryItems.map((i) => i.permissionId);
    const allSelected = itemIds.every((id) => checkedIds.includes(id));

    if (allSelected) {
      setCheckedIds((prev) => prev.filter((id) => !itemIds.includes(id)));
    } else {
      setCheckedIds((prev) => [...new Set([...prev, ...itemIds])]);
    }
  };

  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();

  const handleSubmit = (): void => {
    const selectedData = permissions
      .filter((item) => checkedIds.includes(item.permissionId))
      .map((item) => item.permissionId);

    const body: ICreateRole = {
      name: roleName,
      permissionId: selectedData,
    };

    if (roleId) {
      updateRole({ body, id: roleId })
        .unwrap()
        .then(() => {
          navigate(-1);
        });
    } else {
      createRole(body)
        .unwrap()
        .then(() => {
          navigate(-1);
        });
    }
  };

  return (
    <Card
      style={{
        maxWidth: 1100,
        margin: '0 auto',
      }}
      type='inner'
      title={
        <Title level={4} style={{ margin: 0 }}>
          Role Permissions Configuration
        </Title>
      }
      extra={
        <Button
          loading={isCreating || isUpdating}
          type='primary'
          icon={<SaveFilled />}
          onClick={handleSubmit}
        >
          Save Changes
        </Button>
      }
    >
      <Text type='secondary' style={{ marginBottom: 24, display: 'block' }}>
        Assign specific access levels by checking the boxes below. Use the "Select All" feature to
        toggle entire modules quickly.
      </Text>

      <div style={{ marginBottom: '24px' }}>
        <Text strong style={{ display: 'block', marginBottom: '8px' }}>
          Role Name
        </Text>
        <Input
          placeholder='Provide role name'
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />
      </div>

      {Object.entries(groupedPermissions).map(([category, items]) => (
        <div key={category} style={{ marginBottom: '32px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              padding: '0 4px',
            }}
          >
            <Title
              level={5}
              style={{
                margin: 0,
                textTransform: 'uppercase',
                fontSize: '14px',
              }}
            >
              {category} Module
            </Title>
            <Button type='link' size='small' onClick={() => toggleCategory(items)}>
              Select All
            </Button>
          </div>

          <Row gutter={[12, 12]}>
            {items.map((item) => {
              const isChecked = checkedIds.includes(item.permissionId);
              return (
                <Col xs={24} sm={12} md={6} key={item.permissionId}>
                  <Card
                    hoverable
                    size='small'
                    bodyStyle={{ padding: '12px 16px' }}
                    style={{
                      cursor: 'pointer',
                      borderColor: isChecked ? '#1890ff' : '#b1b1b1ff',
                      transition: 'all 0.3s ease',
                    }}
                    onClick={() => onChange(item.permissionId)}
                  >
                    <Checkbox checked={isChecked} style={{ width: '100%' }}>
                      <Tag
                        color={isChecked ? 'blue' : 'default'}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          fontWeight: 600,
                          marginLeft: '8px',
                        }}
                      >
                        {item.key.split(':').pop()?.toUpperCase()}
                      </Tag>
                    </Checkbox>
                  </Card>
                </Col>
              );
            })}
          </Row>
          <Divider style={{ margin: '24px 0 0 0' }} />
        </div>
      ))}
    </Card>
  );
};

const ManageRole = () => {
  const { roleId } = useParams();

  const { data: res, isLoading: isRoleDetailsLoading } = useGetRoleDetailsQuery(
    { roleId: roleId },
    { skip: !roleId }
  );
  const roleDetails = res?.result;

  const { data, isLoading: isPermissionsLoading } = useGetPermissionsQuery();
  const permissions: IPermission[] = data?.result || [];

  if (isPermissionsLoading || isRoleDetailsLoading) {
    return (
      <Card
        style={{ maxWidth: 1100, margin: '0 auto' }}
        loading={true}
        type='inner'
        title='Loading...'
      />
    );
  }

  // If editing, wait for roleDetails. If creating, just need permissions.
  if (roleId && !roleDetails) {
    return null; // Or some error state
  }

  return (
    <div>
      <RoleForm
        // Use key to force remount when switching between roles or creating new role
        key={roleId || 'create'}
        initialRole={roleDetails}
        permissions={permissions}
        roleId={roleId}
      />
    </div>
  );
};

export default ManageRole;
