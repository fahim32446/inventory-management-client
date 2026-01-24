import { Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect } from 'react';

import { closeModal } from '../../../redux/slice/modalSlice';
import {
  useAddSupplierMutation,
  useUpdateSupplierMutation,
} from '../api/suppliersApis';
import type { ISupplier } from '../supplier.interface';
import { useAppDispatch } from '../../../hooks/hooks';
import { CommonTextArea, CommonTextInput } from '../../../components/common/input-items/input-item';
import SubmitButton from '../../../components/common/submit-button';

interface IProps {
  data?: ISupplier;
}

const AddSuppliers = ({ data }: IProps) => {
  const [form] = useForm();
  const dispatch = useAppDispatch();

  const [addPSupplier, { isLoading, isSuccess }] = useAddSupplierMutation();
  const [updateSupplier, { isLoading: upLoading, isSuccess: upSucc }] =
    useUpdateSupplierMutation();

  const submit = (e: any) => {
    if (data?.supId) {
      updateSupplier({ body: e, id: data.supId });
    } else {
      addPSupplier(e);
    }
  };

  useEffect(() => {
    if (isSuccess || upSucc) {
      dispatch(closeModal());
    }
  }, [isSuccess, upSucc]);

  useEffect(() => {
    if (data?.supId) {
      form.setFieldsValue({ ...data });
    }
  }, [data]);

  return (
    <Form onFinish={submit} form={form} layout='vertical'>
      <Row>
        <CommonTextInput
          formItemProps={{
            name: 'name',
            label: 'Name',
            rules: [{ required: true }],
          }}
          colProps={{ lg: 24 }}
          placeholder='Supplier name'
        />
        <CommonTextInput
          formItemProps={{
            name: 'phone',
            label: 'Phone',
            rules: [{ required: true }],
          }}
          placeholder='Supplier phone no'
          colProps={{ lg: 24 }}
        />

        <CommonTextInput
          formItemProps={{
            name: 'email',
            label: 'Email',
            rules: [{ required: true, type: 'email' }],
          }}
          placeholder='Supplier email'
          colProps={{ lg: 24 }}
        />

        <CommonTextArea
          formItemProps={{
            name: 'address',
            label: 'Address',
            rules: [{ required: true }],
          }}
          placeholder='Supplier address'
          colProps={{ lg: 24 }}
        />

        <SubmitButton loading={isLoading || upLoading}>
          {data?.supId ? 'Edit' : 'Submit'}
        </SubmitButton>
      </Row>
    </Form>
  );
};

export default AddSuppliers;
