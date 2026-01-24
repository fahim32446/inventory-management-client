import { Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect } from 'react';
import { closeModal } from '../../../redux/slice/modalSlice';
import {
  useAddCategoryMutation,
  useUpdateCategoryMutation,
} from '../api/categoryApis';
import type { ICategory } from '../category.interface';
import { CommonTextArea, CommonTextInput } from '../../../components/common/input-items/input-item';
import SubmitButton from '../../../components/common/submit-button';
import { useAppDispatch } from '../../../hooks/hooks';

interface IProps {
  data?: ICategory;
}

const AddCategory = ({ data }: IProps) => {
  const [form] = useForm();
  const dispatch = useAppDispatch();

  const isEdit = data?.catId;

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data]);

  const [addCategory, { isLoading, isSuccess }] = useAddCategoryMutation();
  const [
    updateCategory,
    { isLoading: updateLoading, isSuccess: updateSuccess },
  ] = useUpdateCategoryMutation();

  const submit = (e: any) => {
    if (isEdit) {
      updateCategory({ body: e, id: data!.catId });
    } else {
      addCategory(e);
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
          placeholder='Category name'
        />
        <CommonTextArea
          formItemProps={{
            name: 'description',
            label: 'Description',
            rules: [{ required: true }],
          }}
          colProps={{ lg: 24 }}
          placeholder='Category description'
        />
      </Row>

      <SubmitButton loading={isLoading || updateLoading}>
        {isEdit ? 'Update' : 'Submit'}
      </SubmitButton>
    </Form>
  );
};

export default AddCategory;
