import { Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { CommonTextInput } from '../../../components/common/input-items/input-item';
import SelectCategories from '../../../components/common/select/select-categories';
import SubmitButton from '../../../components/common/submit-button';
import { useAddProductMutation } from '../api/productApis';
import { useNavigate } from 'react-router';

const AddProduct = () => {
  const [form] = useForm();
  const navigate = useNavigate();

  const [addProduct, { isLoading }] = useAddProductMutation();

  const submit = (e: any) => {
    addProduct(e)
      .unwrap()
      .then(() => {
        navigate('/products');
      });
  };

  return (
    <Form onFinish={submit} form={form} layout='vertical'>
      <Row style={{ maxWidth: '300px', margin: '0 auto' }} gutter={[16, 0]}>
        <SelectCategories
          formItemProps={{
            name: 'catId',
            label: 'Select a Category',
            rules: [{ required: true }],
          }}
          colProps={{ lg: 24 }}
        />
        <CommonTextInput
          formItemProps={{
            name: 'name',
            label: 'Name',
            rules: [{ required: true }],
          }}
          placeholder='Product name'
          colProps={{ lg: 24 }}
        />

        <CommonTextInput
          formItemProps={{
            name: 'sku',
            label: 'sku',
            rules: [{ required: true }],
          }}
          placeholder='Product sku'
          colProps={{ lg: 24 }}
        />

        <CommonTextInput
          formItemProps={{
            name: 'description',
            label: 'Description',
            rules: [{ required: true }],
          }}
          placeholder='Product description'
          colProps={{ lg: 24 }}
        />

        <SubmitButton loading={isLoading} />
      </Row>
    </Form>
  );
};

export default AddProduct;
