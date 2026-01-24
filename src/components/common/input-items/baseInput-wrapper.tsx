import React from 'react';
import { Form, Col, type FormItemProps, type ColProps } from 'antd';

interface BaseInputWrapperProps {
  children: React.ReactNode;
  formItemProps?: FormItemProps;
  colProps?: ColProps;
}

export const BaseInputWrapper: React.FC<BaseInputWrapperProps> = ({
  children,
  formItemProps,
  colProps,
}) => {
  const content = formItemProps ? <Form.Item {...formItemProps}>{children}</Form.Item> : children;

  return colProps ? <Col {...colProps}>{content}</Col> : content;
};
