import { MinusCircleOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Flex, Form, Row, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { setDate } from '../../../utils/helper';
import { useGetSalesForEditQuery, useUpdateSaleMutation } from '../api/saleApis';
import ProductFormListSales from '../components/ProductFormListSales';
import type { IAddPurISale } from '../sale.interface';
import { CommonDateInput, CommonTextInput } from '../../../components/common/input-items/input-item';
import SubmitButton from '../../../components/common/submit-button';

const { Title } = Typography;

const EditSale = () => {
  const [form] = useForm();

  const { saleId } = useParams();

  const { data } = useGetSalesForEditQuery({ id: saleId });
  const editData = data?.result;

  const [updateSupplier, { isLoading }] = useUpdateSaleMutation();

  const submit = (e: IAddPurISale) => {
    const body: IAddPurISale = {
      customerName: e.customerName,
      saleDate: e.saleDate,
      supplierId: e.supplierId,
      items: e.items,
    };

    updateSupplier({ body, saleId: saleId! });
  };

  useEffect(() => {
    const body = {
      customerName: editData?.customerName!,
      saleDate: setDate(editData?.saleDate),

      items: editData?.items.map((item) => ({
        purchase_item_id: item.sales_item_id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      })),
    };

    form.setFieldsValue({ ...body });
  }, [data]);

  return (
    <>
      <Divider orientation='vertical'>
        <Title level={4}>Edit Sales</Title>
      </Divider>
      <Form form={form} layout='vertical' onFinish={submit}>
        <Row gutter={[10, 0]}>
          <CommonTextInput
            colProps={{ span: 6 }}
            placeholder='Provide customer name'
            formItemProps={{
              name: 'customerName',
              label: 'Customer name',
              rules: [{ required: true, message: 'Missing Name' }],
            }}
          />

          <CommonDateInput
            colProps={{ span: 6 }}
            placeholder='Select sales date'
            formItemProps={{
              name: 'saleDate',
              label: 'Sales date',
              rules: [{ required: true }],
            }}
          />

          <Col span={24}>
            <Form.List name='items' initialValue={[{ isDeleted: false }]}>
              {(fields) => (
                <Flex vertical>
                  {fields.map(({ key, name }, index) => {
                    return <ItemCard key={key} name={name} index={index} form={form} />;
                  })}
                </Flex>
              )}
            </Form.List>
          </Col>

          <Col span={24}>
            <SubmitButton loading={isLoading}>Update</SubmitButton>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default EditSale;

interface IItemCardProps {
  name: number;
  index: number;
  form: any;
}

const ItemCard = ({ name, index, form }: IItemCardProps) => {
  const isDeleted = Form.useWatch(['items', name, 'isDeleted'], form);

  return (
    <Card
      size='small'
      title={`Item ${index + 1}`}
      style={{
        marginBottom: 8,
        backgroundColor: isDeleted ? 'rgba(255, 0, 0, 0.2)' : '',
        border: isDeleted ? '1px solid red' : undefined,
        opacity: isDeleted ? 0.7 : 1,
      }}
      extra={
        <MinusCircleOutlined
          onClick={() => {
            const current = form.getFieldValue(['items', name, 'isDeleted']) ?? false;

            form.setFieldValue(['items', name, 'isDeleted'], !current);
          }}
          style={{
            color: isDeleted ? 'darkred' : 'red',
            cursor: 'pointer',
          }}
        />
      }
    >
      <Form.Item name={[name, 'purchase_item_id']} hidden />

      <Form.Item name={[name, 'isDeleted']} hidden initialValue={false} />

      <ProductFormListSales name={name} disabled={isDeleted} />
    </Card>
  );
};
