import { EditOutlined } from '@ant-design/icons';
import { Button, type ButtonProps } from 'antd';

interface EditButtonProps extends ButtonProps {
  type?: 'primary' | 'link' | 'text' | 'default' | 'dashed';
  children?: React.ReactNode;
}

const EditButton: React.FC<EditButtonProps> = ({
  type = 'primary',
  children,
  ...rest
}) => {
  return (
    <Button
      icon={<EditOutlined />}
      iconPosition='start'
      type={type}
      size='small'
      htmlType='button'
      {...rest}
    >
      {children}
    </Button>
  );
};

export default EditButton;
