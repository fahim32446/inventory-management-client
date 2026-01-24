import { Modal, Typography } from 'antd';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { closeModal, ModalState } from '../../redux/slice/modalSlice';

const ModalConfig: React.FC = () => {
  const { open, title, content, width, contentPadding = 10 } = useAppSelector(ModalState);
  const dispatch = useAppDispatch();

  const handleClose = (): void => {
    dispatch(closeModal());
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      onOk={handleClose}
      width={width}
      footer={null}
      destroyOnHidden
      styles={{ body: { padding: contentPadding }, header: { padding: '10px', height: '50px' } }}
      title={
        title ? (
          <>
            <Typography.Paragraph strong style={{ fontSize: '1rem' }}>
              {title}
            </Typography.Paragraph>
          </>
        ) : null
      }
      children={content || <>No content available</>}
    />
  );
};

export default ModalConfig;
