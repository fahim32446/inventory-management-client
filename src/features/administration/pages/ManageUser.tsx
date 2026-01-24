import { Button, Flex, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { CommonPasswordInput, CommonTextInput } from '../../../components/common/input-items/input-item';
import SelectRole from '../../../components/common/select/select-role';
import type { IUser } from '../administration.interface';
import { useCreateUserMutation, useUpdateUserMutation } from '../api/usersApiEndpoints';
import { closeModal } from '../../../redux/slice/modalSlice';
import { useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/hooks';

type Props = { data?: IUser };

const ManageUser = ({ data }: Props) => {
  const [form] = useForm();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
      });
    }
  }, [data]);

  const [createUser, { isLoading }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const submit = (values: any) => {
    if (data) {
      const updatePayload = values;

      if (data.email === updatePayload.email) {
        delete updatePayload.email;
      }

      updateUser({ body: updatePayload, id: data.userId })
        .unwrap()
        .then(() => {
          dispatch(closeModal());
        });
    } else {
      createUser(values)
        .unwrap()
        .then(() => {
          dispatch(closeModal());
        });
    }
  };

  return (
    <Form form={form} layout='vertical' onFinish={submit}>
      <Row gutter={[12, 0]}>
        <CommonTextInput
          placeholder='Provide user name'
          formItemProps={{ rules: [{ required: true }], label: 'Name', name: 'name' }}
          colProps={{ span: 12 }}
        />
        <CommonTextInput
          name='email'
          placeholder='Provider user email'
          formItemProps={{
            rules: [{ type: 'email' }, { required: true }],
            label: 'Email',
            name: 'email',
          }}
          colProps={{ span: 12 }}
        />

        <SelectRole
          colProps={{ span: 12 }}
          placeholder='Select a role'
          formItemProps={{
            rules: [{ required: true, message: 'Please select a role!' }],
            name: 'roleId',
            label: 'Role',
          }}
        />

        <CommonPasswordInput
          colProps={{ span: 12 }}
          placeholder='Provide a password'
          formItemProps={{
            rules: [
              {
                required: true,
                message: 'Please input your password!',
              },
            ],
            name: 'password',
            label: 'Password',
          }}
        />
      </Row>

      <Flex justify='end'>
        <Button loading={isLoading || isUpdating} type='primary' htmlType='submit'>
          Submit
        </Button>
      </Flex>
    </Form>
  );
};

export default ManageUser;
