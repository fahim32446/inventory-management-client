import { DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm, type ButtonProps } from 'antd';
import React, { useState } from 'react';

interface DeleteButtonProps extends ButtonProps {
  type?: 'primary' | 'link' | 'text' | 'default' | 'dashed';
  children?: React.ReactNode;
  confirmMessage?: string;
  onConfirm?: any;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  type = 'primary',
  children,
  confirmMessage = 'Are you sure to delete?',
  onConfirm,
  ...rest
}) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (onConfirm) {
      try {
        setLoading(true);
        await onConfirm();
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Popconfirm
      title={confirmMessage}
      onConfirm={handleConfirm}
      okText='Yes'
      cancelText='No'
    >
      <Button
        icon={<DeleteOutlined />}
        iconPosition='start'
        type={type}
        danger
        size='small'
        htmlType='button'
        loading={loading}
        {...rest}
      >
        {children}
      </Button>
    </Popconfirm>
  );
};

export default DeleteButton;
