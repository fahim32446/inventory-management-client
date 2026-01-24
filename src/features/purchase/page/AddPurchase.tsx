import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, InputNumber, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect } from 'react';
import { closeModal } from '../../../redux/slice/modalSlice';
import { setDate } from '../../../utils/helper';
import {
  useAddPurchaseMutation,
  useUpdatePurchaseMutation,
} from '../api/purchaseApis';
import type { IAddPurIPurchase, IPurchase } from '../purchase.interface';
import { useAppDispatch } from '../../../hooks/hooks';
import { CommonDateInput, CommonNumberInput, CommonTextInput } from '../../../components/common/input-items/input-item';
import SelectSupplier from '../../../components/common/select/select-supplier';
import SelectProduct from '../../../components/common/select/select-product';
import SubmitButton from '../../../components/common/submit-button';

interface IProps {
  data?: IPurchase;
}

const AddPurchase = ({ data }: IProps) => {
  const [form] = useForm();
  const dispatch = useAppDispatch();

  const isEdit = data?.supplierId;

  const [addSupplier, { isLoading, isSuccess }] = useAddPurchaseMutation();
  const [updateSupplier, { isLoading: upLoading, isSuccess: upSucc }] =
    useUpdatePurchaseMutation();

  const submit = (e: IAddPurIPurchase) => {
    const body: IAddPurIPurchase = {
      purchaseDate: e.purchaseDate,
      supplierId: e.supplierId,
      items: e.items,
    };

    if (isEdit) {
      updateSupplier({ body: body, purchaseId: data.purchaseId });
    } else {
      addSupplier(body);
    }
  };

  useEffect(() => {
    if (isSuccess || upSucc) {
      dispatch(closeModal());
    }
  }, [isSuccess, upSucc]);

  useEffect(() => {
    if (data?.supplierId) {
      const body: IAddPurIPurchase = {
        supplierId: data.supplierId,
        purchaseDate: setDate(data.purchaseDate),
        items: [
          {
            purchase_item_id: data.purchase_item_id,
            productId: data.productId,
            quantity: data.quantity,
            unitCost: data.unitCost,
            subtotal: data.subtotal,
          },
        ],
      };

      form.setFieldsValue({ ...body });
    }
  }, [data]);

  return (
    <Form onFinish={submit} form={form} layout='vertical'>
      <Row gutter={[0, 0]}>
        <CommonDateInput
          colProps={{ span: 24 }}
          formItemProps={{
            name: 'purchaseDate',
            label: 'Purchase date',
            rules: [{ required: true }],
          }}
          placeholder='Select purchase date'
        />
        <SelectSupplier
          colProps={{ span: 24 }}
          formItemProps={{
            name: 'supplierId',
            label: 'Select supplier',
            rules: [{ required: true }],
          }}
          placeholder='Choose a supplier'
        />

        <Form.List name='items' initialValue={[{}]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <Card
                  size='small'
                  title={`Item ${name + 1}`}
                  key={key}
                  style={{ marginBottom: 5 }}
                  extra={
                    isEdit ? null : (
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        style={{ color: 'red' }}
                      />
                    )
                  }
                >
                  <Row key={key} gutter={12}>
                    <SelectProduct
                      colProps={{ span: 12 }}
                      formItemProps={{
                        name: [name, 'productId'],
                        label: 'Select product',
                        rules: [{ required: true }],
                      }}
                      placeholder='Choose a product'
                    />

                    <CommonNumberInput
                      colProps={{ span: 12 }}
                      placeholder='Quantity'
                      formItemProps={{
                        name: [name, 'quantity'],
                        label: 'Quantity',
                        rules: [
                          { required: true, message: 'Missing Quantity' },
                        ],
                      }}
                    />
                    <CommonNumberInput
                      colProps={{ span: 12 }}
                      placeholder='Unit Cost'
                      formItemProps={{
                        name: [name, 'unitCost'],
                        label: 'Unit Cost',
                        rules: [
                          { required: true, message: 'Missing Unit Cost' },
                        ],
                      }}
                    />
                    <Col span={12}>
                      <Form.Item
                        shouldUpdate={(prev, curr) =>
                          prev.items?.[name]?.quantity !==
                            curr.items?.[name]?.quantity ||
                          prev.items?.[name]?.unitCost !==
                            curr.items?.[name]?.unitCost
                        }
                        noStyle
                      >
                        {() => {
                          const { quantity = 0, unitCost = 0 } =
                            form.getFieldValue(['items', name]) || {};
                          const subtotal = quantity * unitCost;
                          form.setFieldValue(
                            ['items', name, 'subtotal'],
                            subtotal
                          );
                          return (
                            <Form.Item
                              name={[name, 'subtotal']}
                              label='Subtotal'
                              style={{ marginBottom: 0 }}
                            >
                              <InputNumber
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
                      colProps={{ span: 12 }}
                      placeholder='purchase_item_id'
                      formItemProps={{
                        hidden: true,
                        name: [name, 'purchase_item_id'],
                        label: 'purchase_item_id',
                      }}
                    />
                  </Row>
                </Card>
              ))}
              {isEdit ? null : (
                <Form.Item>
                  <Button
                    type='dashed'
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add more product
                  </Button>
                </Form.Item>
              )}
            </>
          )}
        </Form.List>

        <SubmitButton loading={isLoading || upLoading}>
          {isEdit ? 'Update' : 'Submit'}
        </SubmitButton>
      </Row>
    </Form>
  );
};

export default AddPurchase;
