import type { ColProps, FormItemProps, SelectProps } from 'antd';
import { CommonSelectInput } from '../input-items/input-item';
import { useGetAllSupplierQuery } from '../../../features/suppliers/api/suppliersApis';


interface Props extends SelectProps<any> {
  colProps?: ColProps | undefined;
  formItemProps?: FormItemProps<any> | undefined;
  onChange?: ((value: string | number) => void) | undefined;
  value?: string | number | undefined;
}

const SelectSupplier = ({
  colProps,
  formItemProps,
  onChange,
  value,
  ...rest
}: Props) => {
  const { data } = useGetAllSupplierQuery({});
  const list = data?.result || [];

  return (
    <CommonSelectInput
      {...rest}
      options={list?.map((item) => ({ label: item.name, value: item.supId }))}
      colProps={colProps}
      formItemProps={formItemProps}
      onChange={onChange}
      value={value}
    />
  );
};

export default SelectSupplier;
