import type { ColProps, FormItemProps, SelectProps } from 'antd';
import { useGetAllCategoryQuery } from '../../../features/categories/api/categoryApis';
import { CommonSelectInput } from '../input-items/input-item';

interface Props extends SelectProps<any> {
  colProps?: ColProps | undefined;
  formItemProps?: FormItemProps<any> | undefined;
  onChange?: ((value: string | number) => void) | undefined;
  value?: string | number | undefined;
}

const SelectCategories = ({ colProps, formItemProps, onChange, value, ...rest }: Props) => {
  const { data } = useGetAllCategoryQuery({});
  const list = data?.result || [];

  return (
    <CommonSelectInput
      {...rest}
      options={list?.map((item: any) => ({
        label: item.name,
        value: item.catId,
      }))}
      colProps={colProps}
      formItemProps={formItemProps}
      onChange={onChange}
      value={value}
    />
  );
};

export default SelectCategories;
