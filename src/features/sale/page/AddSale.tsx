import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Divider, Flex, Form, Row, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect } from "react";
import { closeModal } from "../../../redux/slice/modalSlice";
import { setDate } from "../../../utils/helper";
import { useAddSaleMutation, useUpdateSaleMutation } from "../api/saleApis";
import ProductFormListSales from "../components/ProductFormListSales";
import type { IAddPurISale, ISale } from "../sale.interface";
import { useAppDispatch } from "../../../hooks/hooks";
import {
  CommonDateInput,
  CommonTextInput,
} from "../../../components/common/input-items/input-item";
import SubmitButton from "../../../components/common/submit-button";
import { IAddPurIPurchase } from "../../purchase/purchase.interface";
import { useNavigate } from "react-router-dom";

interface IProps {
  data?: ISale;
}

const { Title } = Typography;

const AddSale = ({ data }: IProps) => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isEdit = data?.supplierId;

  const [addSupplier, { isLoading, isSuccess }] = useAddSaleMutation();
  const [updateSupplier, { isLoading: upLoading, isSuccess: upSucc }] = useUpdateSaleMutation();

  const submit = (e: IAddPurISale) => {
    const body: IAddPurISale = {
      customerName: e.customerName,
      saleDate: e.saleDate,
      supplierId: e.supplierId,
      items: e.items,
    };

    if (isEdit) {
      updateSupplier({ body: body, saleId: data.purchaseId })
        .unwrap()
        .then(() => {
          navigate("/sale");
        });
    } else {
      addSupplier(body)
        .unwrap()
        .then(() => {
          navigate("/sale");
        });
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
            unitPrice: data.unitPrice,
            subtotal: data.subtotal,
          },
        ],
      } as any;

      form.setFieldsValue({ ...body });
    }
  }, [data]);

  return (
    <>
      <Divider orientation="horizontal">
        <Title level={4}>ADD NEW SALES</Title>
      </Divider>
      <Form onFinish={submit} form={form} layout="vertical">
        <Row gutter={[10, 0]}>
          <CommonTextInput
            colProps={{ span: 6 }}
            placeholder="Provide customer name"
            formItemProps={{
              name: "customerName",
              label: "Customer name",
              rules: [{ required: true, message: "Missing Name" }],
            }}
          />
          <CommonDateInput
            colProps={{ span: 6 }}
            formItemProps={{
              name: "saleDate",
              label: "Sales date",
              rules: [{ required: true }],
            }}
            placeholder="Select sales date"
          />

          <Col span={24}>
            <Form.List name="items" initialValue={[{}]}>
              {(fields, { add, remove }) => (
                <Flex vertical>
                  <div>
                    {fields.map(({ key, name }) => (
                      <Card
                        size="small"
                        title={`Item ${name + 1}`}
                        key={key}
                        style={{ marginBottom: 5 }}
                        extra={
                          isEdit ? null : (
                            <MinusCircleOutlined
                              onClick={() => remove(name)}
                              style={{ color: "red" }}
                            />
                          )
                        }
                      >
                        <ProductFormListSales name={name} key={key} />
                      </Card>
                    ))}
                  </div>
                  {isEdit ? null : (
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Add more product
                      </Button>
                    </Form.Item>
                  )}
                </Flex>
              )}
            </Form.List>
          </Col>
          <SubmitButton loading={isLoading || upLoading}>
            {isEdit ? "Update" : "Submit"}
          </SubmitButton>
        </Row>
      </Form>
    </>
  );
};

export default AddSale;
