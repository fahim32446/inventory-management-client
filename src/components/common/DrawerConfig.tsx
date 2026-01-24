import React from 'react';

import { Drawer } from 'antd';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { closeDrawer, DrawerState } from '../../redux/slice/drawerSlice';

const DrawerConfig: React.FC = () => {
  const { open, title, content, extra, footer, placement, size, width } =
    useAppSelector(DrawerState);
  const dispatch = useAppDispatch();

  return (
    <Drawer
      onClose={() => dispatch(closeDrawer())}
      open={open}
      mask={{ blur: false }}
      title={title}
      children={content}
      extra={extra}
      footer={footer}
      placement={placement}
      size={size}
      width={width}
    />
  );
};

export default DrawerConfig;
