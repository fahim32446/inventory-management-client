import { Col, Form, InputNumber, Row } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { useGetStockProductQuery } from '../api/saleApis';
import { useEffect } from 'react';
import { CommonNumberInput, CommonTextInput } from '../../../components/common/input-items/input-item';
import SelectStockedProduct from '../../../components/common/select/select-stock-product';

type Props = {
  name: number;
  disabled?: boolean;
};

const ProductFormListSales = ({ name, disabled }: Props) => {
  const form = useFormInstance();

  const { data } = useGetStockProductQuery({});

  const productId = useWatch(['items', name, 'productId']);
  const selectedProduct = data?.result?.find((item) => item.stock_product_id === productId);

  useEffect(() => {
    form.setFieldValue(['items', name, 'stock'], selectedProduct?.quantity || 0);
    form.setFieldValue(['items', name, 'purchase price'], selectedProduct?.unitCost || 0);
  }, [selectedProduct]);

  return (
    <Row gutter={12}>
      <SelectStockedProduct
        colProps={{ lg: 4 }}
        formItemProps={{
          name: [name, 'productId'],
          label: 'Select product',
          rules: [{ required: true }],
        }}
        disabled={disabled}
        placeholder='Choose a product'
      />
      <CommonNumberInput
        colProps={{ lg: 4 }}
        placeholder='Stock'
        readOnly
        disabled={disabled}
        formItemProps={{
          name: [name, 'stock'],
          label: 'Stock',
        }}
      />
      <CommonNumberInput
        colProps={{ lg: 4 }}
        placeholder='Purchase price'
        readOnly
        disabled={disabled}
        formItemProps={{
          name: [name, 'purchase price'],
          label: 'Purchase price',
        }}
      />
      <CommonNumberInput
        colProps={{ lg: 4 }}
        placeholder='Quantity'
        disabled={disabled}
        formItemProps={{
          name: [name, 'quantity'],
          label: 'Quantity',
          rules: [{ required: true, message: 'Missing Quantity' }],
        }}
        onChange={(e) => {
          const stock = selectedProduct?.quantity || 0;
          form.setFieldValue(['items', name, 'stock'], stock - (e || 0));
        }}
        max={selectedProduct?.quantity}
      />

      <CommonNumberInput
        colProps={{ lg: 4 }}
        placeholder='Unit Cost'
        disabled={disabled}
        formItemProps={{
          name: [name, 'unitPrice'],
          label: 'Unit Cost',
          rules: [{ required: true, message: 'Missing Unit Cost' }],
        }}
      />
      <Col span={4}>
        <Form.Item
          shouldUpdate={(prev, curr) =>
            prev.items?.[name]?.quantity !== curr.items?.[name]?.quantity ||
            prev.items?.[name]?.unitPrice !== curr.items?.[name]?.unitPrice
          }
          noStyle
        >
          {() => {
            const { quantity = 0, unitPrice = 0 } = form.getFieldValue(['items', name]) || {};
            const subtotal = quantity * unitPrice;
            form.setFieldValue(['items', name, 'subtotal'], subtotal);
            return (
              <Form.Item name={[name, 'subtotal']} label='Subtotal' style={{ marginBottom: 0 }}>
                <InputNumber
                  disabled={disabled}
                  value={subtotal}
                  readOnly
                  style={{ width: '100%' }}
                />
              </Form.Item>
            );
          }}
        </Form.Item>
      </Col>

      <CommonTextInput
        disabled={disabled}
        colProps={{ span: 12 }}
        placeholder='purchase_item_id'
        formItemProps={{
          hidden: true,
          name: [name, 'purchase_item_id'],
          label: 'purchase_item_id',
        }}
      />
    </Row>
  );
};

export default ProductFormListSales;
