import { Card, Table, Tag } from 'antd';

const dataSource = [
  {
    key: '1',
    name: 'Report A',
    status: 'completed',
    date: '2023-10-01',
    amount: '$1,200',
  },
  {
    key: '2',
    name: 'Report B',
    status: 'pending',
    date: '2023-10-02',
    amount: '$850',
  },
  {
    key: '3',
    name: 'Report C',
    status: 'failed',
    date: '2023-10-03',
    amount: '$0',
  },
];

const columns = [
  {
    title: 'Report Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      let color = 'default';
      if (status === 'completed') color = 'success';
      if (status === 'pending') color = 'warning';
      if (status === 'failed') color = 'error';
      return <Tag color={color}>{status.toUpperCase()}</Tag>;
    },
  },
];

export default function ReportsPage() {
  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold dark:text-white'>Reports</h1>
      <Card bordered={false} className='shadow-sm'>
        <Table dataSource={dataSource} columns={columns} />
      </Card>
    </div>
  );
}
