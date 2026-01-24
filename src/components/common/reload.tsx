import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useState } from 'react';

export type refetchArr = () => any;
type Props = {
  refetch?: () => any;
  refetchArr?: refetchArr[];
  reloaderSize?: any;
};

export default function Reload({ refetch, refetchArr, reloaderSize }: Props) {
  const [loading, setLoading] = useState(false);

  const handleRefetch = () => {
    setLoading(true);
    if (refetch) refetch();
    if (refetchArr?.length) {
      refetchArr.forEach((refetchItem) => refetchItem());
    }
    setTimeout(() => setLoading(false), 200);
  };

  const onReloadClick = () => {
    setLoading(true);
    setTimeout(() => {
      handleRefetch();
    }, 500);
  };

  return (
    // <Tooltip title='Reload'>
    <Button
      style={{ backgroundColor: '#3AAF85' }}
      onClick={onReloadClick}
      size={reloaderSize || 'middle'}
      type='primary'
      disabled={loading} // Disables button while loading
    >
      {loading ? (
        <LoadingOutlined style={{ fontWeight: 'bolder', fontSize: '20px', color: 'white' }} />
      ) : (
        <ReloadOutlined style={{ fontWeight: 'bolder', fontSize: '20px', color: 'white' }} />
      )}
      Reload
    </Button>
    // </Tooltip>
  );
}
