import { SendOutlined } from '@ant-design/icons';
import { Button, Flex, type ButtonProps } from 'antd';

interface SubmitButtonProps extends ButtonProps {
  type?: 'primary' | 'link' | 'text' | 'default' | 'dashed';
  children?: React.ReactNode;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  type = 'primary',
  children = 'Submit',
  ...rest
}) => {
  return (
    <Flex justify='end' style={{ width: '100%' }}>
      <Button
        icon={<SendOutlined />}
        iconPosition='end'
        type={type}
        htmlType='submit'
        {...rest}
      >
        {children}
      </Button>
    </Flex>
  );
};

export default SubmitButton;
