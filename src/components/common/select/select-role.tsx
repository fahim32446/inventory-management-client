import type { ColProps, FormItemProps, SelectProps } from 'antd';
import { useGetRoleListQuery } from '../../../features/administration/api/administrationApiEndpoints';
import { CommonSelectInput } from '../input-items/input-item';

interface Props extends SelectProps<any> {
  colProps?: ColProps | undefined;
  formItemProps?: FormItemProps<any> | undefined; 
  onChange?: ((value: string | number) => void) | undefined;
  value?: string | number | undefined;
}

const SelectRole = ({ colProps, formItemProps, onChange, value, ...rest }: Props) => {
  const { data } = useGetRoleListQuery();
  const list = data?.result || [];

  return (
    <CommonSelectInput
      {...rest}
      options={list?.map((item) => ({
        label: item.name,
        value: item.roleId,
      }))}
      colProps={colProps}
      formItemProps={formItemProps}
      onChange={onChange}
      value={value}
    />
  );
};

export default SelectRole;
