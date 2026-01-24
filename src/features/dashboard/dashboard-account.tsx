import { Button, Card, Col, DatePicker, Row, Select, Table, Tag, Typography } from 'antd';
import { motion } from 'framer-motion';
import {
  ArrowDownRight,
  ArrowRightLeft,
  ArrowUpRight,
  DollarSign,
  Download,
  Filter,
  MoreVertical,
  PieChart as PieChartIcon,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { useAppSelector } from '../../hooks/hooks';
import { cn } from '../../utils/cn';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// --- Dummy Data ---
const cashFlowData = [
  { month: 'Jan', inflow: 45000, outflow: 32000 },
  { month: 'Feb', inflow: 52000, outflow: 38000 },
  { month: 'Mar', inflow: 48000, outflow: 41000 },
  { month: 'Apr', inflow: 61000, outflow: 42000 },
  { month: 'May', inflow: 55000, outflow: 39000 },
  { month: 'Jun', inflow: 67000, outflow: 45000 },
  { month: 'Jul', inflow: 72000, outflow: 48000 },
];

const revenueDistribution = [
  { name: 'Product Sales', value: 45, color: '#3b82f6' },
  { name: 'Services', value: 30, color: '#10b981' },
  { name: 'Subscriptions', value: 15, color: '#f59e0b' },
  { name: 'Other', value: 10, color: '#6366f1' },
];

const recentTransactions = [
  {
    key: '1',
    id: 'TXN-8842',
    date: '2024-03-01',
    customer: 'Tech Global Inc.',
    amount: 15420.0,
    status: 'completed',
    type: 'Inbound',
    category: 'Sales',
  },
  {
    key: '2',
    id: 'TXN-8843',
    date: '2024-03-02',
    customer: 'Cloud Solutions',
    amount: -2100.5,
    status: 'pending',
    type: 'Outbound',
    category: 'Hosting',
  },
  {
    key: '3',
    id: 'TXN-8844',
    date: '2024-03-02',
    customer: 'Vertex Media',
    amount: 8900.0,
    status: 'completed',
    type: 'Inbound',
    category: 'Consulting',
  },
  {
    key: '4',
    id: 'TXN-8845',
    date: '2024-03-03',
    customer: 'Internal Salary',
    amount: -45000.0,
    status: 'completed',
    type: 'Outbound',
    category: 'Payroll',
  },
  {
    key: '5',
    id: 'TXN-8846',
    date: '2024-03-04',
    customer: 'Modern Office',
    amount: -1250.75,
    status: 'failed',
    type: 'Outbound',
    category: 'Supplies',
  },
];

const DashboardAccount = () => {
  const { mode, primaryColor } = useAppSelector((state) => state.theme);
  const isDark = mode === 'dark';

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const columns = [
    {
      title: 'Transaction ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => (
        <Text strong className='font-mono'>
          {text}
        </Text>
      ),
    },
    {
      title: 'Customer/Vendor',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (text: string) => <Tag color={isDark ? 'blue-inverse' : 'blue'}>{text}</Tag>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right' as const,
      render: (amount: number) => (
        <span className={cn('font-semibold', amount > 0 ? 'text-emerald-500' : 'text-rose-500')}>
          {amount > 0 ? '+' : ''}
          {amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = {
          completed: 'success',
          pending: 'processing',
          failed: 'error',
        };
        return <Tag color={colors[status as keyof typeof colors]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: () => <Button type='text' icon={<MoreVertical size={16} />} />,
    },
  ];

  return (
    <motion.div
      className='space-y-8'
      initial='hidden'
      animate='visible'
      variants={containerVariants}
    >
      {/* --- Header Section --- */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Accounts Analytics
          </Title>
          <Text type='secondary'>Real-time overview of your financial performance</Text>
        </div>
        <div className='flex items-center gap-3'>
          <RangePicker className='rounded-lg shadow-sm' />
          <Button icon={<Download size={16} />} className='flex items-center gap-2'>
            Export Report
          </Button>
          <Button
            type='primary'
            style={{ backgroundColor: primaryColor }}
            className='flex items-center gap-2'
          >
            Add Transaction
          </Button>
        </div>
      </div>

      {/* --- Stats Overview --- */}
      <Row gutter={[24, 24]}>
        {[
          {
            title: 'Total Revenue',
            value: '$124,592',
            trend: '+12.5%',
            isUp: true,
            icon: <DollarSign className='text-blue-500' />,
            color: 'bg-blue-50 dark:bg-blue-900/20',
          },
          {
            title: 'Total Expenses',
            value: '$82,400',
            trend: '+4.2%',
            isUp: false,
            icon: <Wallet className='text-rose-500' />,
            color: 'bg-rose-50 dark:bg-rose-900/20',
          },
          {
            title: 'Net Profit',
            value: '$42,192',
            trend: '+18.3%',
            isUp: true,
            icon: <TrendingUp className='text-emerald-500' />,
            color: 'bg-emerald-50 dark:bg-emerald-900/20',
          },
          {
            title: 'Pending Invoices',
            value: '$12,350',
            trend: '-2.1%',
            isUp: true,
            icon: <ArrowRightLeft className='text-amber-500' />,
            color: 'bg-amber-50 dark:bg-amber-900/20',
          },
        ].map((stat, idx) => (
          <Col xs={24} sm={12} lg={6} key={idx}>
            <motion.div variants={itemVariants}>
              <Card
                bordered={false}
                className='shadow-xs hover:shadow-md transition-shadow duration-300 overflow-hidden dark:bg-slate-900'
              >
                <div className='flex items-start justify-between'>
                  <div className='space-y-2'>
                    <Text type='secondary' className='text-xs font-medium uppercase tracking-wider'>
                      {stat.title}
                    </Text>
                    <div className='flex items-baseline gap-2'>
                      <Title level={3} style={{ margin: 0 }}>
                        {stat.value}
                      </Title>
                      <span
                        className={cn(
                          'text-xs font-semibold flex items-center gap-0.5',
                          stat.isUp ? 'text-emerald-500' : 'text-rose-500'
                        )}
                      >
                        {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                  <div className={cn('p-3 rounded-xl', stat.color)}>{stat.icon}</div>
                </div>
                <div className='mt-4 pt-4 border-t dark:border-slate-800'>
                  <Text type='secondary' className='text-xs'>
                    vrs previous 30 days
                  </Text>
                </div>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* --- Charts Section --- */}
      <Row gutter={[24, 24]}>
        <Col span={24} lg={16}>
          <motion.div variants={itemVariants}>
            <Card
              title={
                <div className='flex items-center justify-between w-full py-1'>
                  <div className='flex items-center gap-2'>
                    <TrendingUp size={18} className='text-blue-500' />
                    <span>Cash Flow Overview</span>
                  </div>
                  <Select defaultValue='7d' size='small' style={{ width: 100 }}>
                    <Select.Option value='7d'>Last 7 days</Select.Option>
                    <Select.Option value='30d'>Last 30 days</Select.Option>
                    <Select.Option value='90d'>Last 90 days</Select.Option>
                  </Select>
                </div>
              }
              bordered={false}
              className='shadow-sm dark:bg-slate-900'
            >
              <div className='h-[350px] w-full pt-4'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart data={cashFlowData}>
                    <defs>
                      <linearGradient id='colorInflow' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor={primaryColor} stopOpacity={0.1} />
                        <stop offset='95%' stopColor={primaryColor} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id='colorOutflow' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor='#ef4444' stopOpacity={0.1} />
                        <stop offset='95%' stopColor='#ef4444' stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray='3 3'
                      vertical={false}
                      stroke={isDark ? '#334155' : '#e2e8f0'}
                    />
                    <XAxis
                      dataKey='month'
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
                      tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        borderColor: isDark ? '#334155' : '#e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      }}
                      itemStyle={{ fontSize: '12px' }}
                    />
                    <Area
                      type='monotone'
                      dataKey='inflow'
                      stroke={primaryColor}
                      fillOpacity={1}
                      fill='url(#colorInflow)'
                      strokeWidth={3}
                    />
                    <Area
                      type='monotone'
                      dataKey='outflow'
                      stroke='#ef4444'
                      fillOpacity={1}
                      fill='url(#colorOutflow)'
                      strokeWidth={3}
                    />
                    <Legend verticalAlign='top' align='right' height={36} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </Col>

        <Col span={24} lg={8}>
          <motion.div variants={itemVariants} className='h-full'>
            <Card
              title={
                <div className='flex items-center gap-2 py-1'>
                  <PieChartIcon size={18} className='text-emerald-500' />
                  <span>Revenue Channels</span>
                </div>
              }
              bordered={false}
              className='shadow-sm h-full dark:bg-slate-900'
            >
              <div className='h-[300px] w-full mt-4'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={revenueDistribution}
                      cx='50%'
                      cy='50%'
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={8}
                      dataKey='value'
                    >
                      {revenueDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        borderColor: isDark ? '#334155' : '#e2e8f0',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend layout='horizontal' verticalAlign='bottom' align='center' />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className='mt-4 space-y-3'>
                {revenueDistribution.map((item, idx) => (
                  <div key={idx} className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <div
                        className='w-2 h-2 rounded-full'
                        style={{ backgroundColor: item.color }}
                      />
                      <Text className='text-sm'>{item.name}</Text>
                    </div>
                    <Text strong className='text-sm'>
                      {item.value}%
                    </Text>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* --- Transactions Section --- */}
      <motion.div variants={itemVariants}>
        <Card
          title={
            <div className='flex items-center justify-between w-full py-1'>
              <div className='flex items-center gap-2'>
                <Filter size={18} className='text-amber-500' />
                <span>Recent Transactions</span>
              </div>
              <Button type='link' className='text-sm'>
                View All
              </Button>
            </div>
          }
          bordered={false}
          className='shadow-sm dark:bg-slate-900'
        >
          <Table
            columns={columns}
            dataSource={recentTransactions}
            pagination={false}
            className='custom-table'
            scroll={{ x: 700 }}
          />
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DashboardAccount;
