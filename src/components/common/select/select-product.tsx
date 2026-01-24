import type { ColProps, FormItemProps, SelectProps } from 'antd';
import { useGetAllProductQuery } from '../../../features/product/api/productApis';
import { CommonSelectInput } from '../input-items/input-item';

interface Props extends SelectProps<any> {
  colProps?: ColProps | undefined;
  formItemProps?: FormItemProps<any> | undefined;
  onChange?: ((value: string | number) => void) | undefined;
  value?: string | number | undefined;
}

const SelectProduct = ({ colProps, formItemProps, onChange, value, ...rest }: Props) => {
  const { data } = useGetAllProductQuery({});
  const list = data?.result || [];

  return (
    <CommonSelectInput
      {...rest}
      options={list?.map((item: any) => ({
        label: item.name,
        value: item.productId,
      }))}
      colProps={colProps}
      formItemProps={formItemProps}
      onChange={onChange}
      value={value}
    />
  );
};

export default SelectProduct;
