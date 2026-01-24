import { Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect } from 'react';
import { closeModal } from '../../../redux/slice/modalSlice';
import type { IWarehouse } from '../warehouse.interface';
import {
  useAddWarehouseMutation,
  useUpdateWarehouseMutation,
} from '../api/warehouseApis';
import { useAppDispatch } from '../../../hooks/hooks';
import { CommonTextArea, CommonTextInput } from '../../../components/common/input-items/input-item';
import SubmitButton from '../../../components/common/submit-button';

interface IProps {
  data?: IWarehouse;
}

const AddWarehouse = ({ data }: IProps) => {
  const [form] = useForm();
  const dispatch = useAppDispatch();

  const isEdit = data?.whId;

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data]);

  const [addwarehouse, { isLoading, isSuccess }] = useAddWarehouseMutation();
  const [
    updatewarehouse,
    { isLoading: updateLoading, isSuccess: updateSuccess },
  ] = useUpdateWarehouseMutation();

  const submit = (e: any) => {
    if (isEdit) {
      updatewarehouse({ body: e, id: data!.whId });
    } else {
      addwarehouse(e);
    }
  };

  useEffect(() => {
    if (isSuccess || updateSuccess) {
      dispatch(closeModal());
    }
  }, [isSuccess, updateSuccess]);

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
          placeholder='Warehouse name'
        />
        <CommonTextArea
          formItemProps={{
            name: 'location',
            label: 'Location',
            rules: [{ required: true }],
          }}
          colProps={{ lg: 24 }}
          placeholder='warehouse location'
        />
      </Row>

      <SubmitButton loading={isLoading || updateLoading}>
        {isEdit ? 'Update' : 'Submit'}
      </SubmitButton>
    </Form>
  );
};

export default AddWarehouse;
