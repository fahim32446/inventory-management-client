import { type ColProps, type FormItemProps } from 'antd';
import type { SelectProps } from 'antd/lib';
import { useGetStockProductQuery } from '../../../features/sale/api/saleApis';
import { CommonSelectInput } from '../input-items/input-item';
  
interface Props extends SelectProps<any> {
  colProps?: ColProps | undefined;
  formItemProps?: FormItemProps<any> | undefined;
  onChange?: ((value: string | number) => void) | undefined;
  value?: string | number | undefined;
}

const SelectStockedProduct = ({ colProps, formItemProps, onChange, value, ...rest }: Props) => {
  const { data } = useGetStockProductQuery({});
  const list = data?.result || [];

  return (
    <>
      <CommonSelectInput
        {...rest}
        options={list?.map((item) => ({
          label: item.product_name,
          value: item.stock_product_id,
        }))}
        colProps={colProps}
        formItemProps={formItemProps}
        onChange={onChange}
        value={value}
      />
    </>
  );
};

export default SelectStockedProduct;
