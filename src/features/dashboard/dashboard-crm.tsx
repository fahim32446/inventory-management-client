import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Progress,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Clock,
  Download,
  Layers,
  Phone,
  PieChart as PieChartIcon,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import {
  Bar,
  BarChart,
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
const pipelineData = [
  { stage: 'Leads', count: 450, value: 120000, color: '#3b82f6' },
  { stage: 'Contacted', count: 280, value: 85000, color: '#6366f1' },
  { stage: 'Qualified', count: 150, value: 52000, color: '#8b5cf6' },
  { stage: 'Proposal', count: 80, value: 34000, color: '#ec4899' },
  { stage: 'Negotiation', count: 45, value: 21000, color: '#f59e0b' },
  { stage: 'Closed Won', count: 25, value: 15000, color: '#10b981' },
];

const leadSourceData = [
  { name: 'Organic Search', value: 400, color: '#3b82f6' },
  { name: 'Paid Ads', value: 300, color: '#f43f5e' },
  { name: 'Referral', value: 200, color: '#10b981' },
  { name: 'Social Media', value: 150, color: '#fbbf24' },
];

const topDeals = [
  {
    key: '1',
    company: 'Nexus Tech',
    contact: 'Sarah Wilson',
    value: 24500,
    probability: 85,
    status: 'Proposal',
    priority: 'High',
  },
  {
    key: '2',
    company: 'Blue Wave',
    contact: 'Michael Chen',
    value: 12000,
    probability: 60,
    status: 'Qualified',
    priority: 'Medium',
  },
  {
    key: '3',
    company: 'Innovate Corp',
    contact: 'Emma Brown',
    value: 48000,
    probability: 45,
    status: 'Negotiation',
    priority: 'Critical',
  },
  {
    key: '4',
    company: 'Apex Systems',
    contact: 'James Miller',
    value: 8500,
    probability: 95,
    status: 'Closed Won',
    priority: 'Low',
  },
  {
    key: '5',
    company: 'Future Apps',
    contact: 'Linda Davis',
    value: 15800,
    probability: 30,
    status: 'Leads',
    priority: 'Medium',
  },
];

const DashboardCrm = () => {
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

  const tableColumns = [
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      render: (text: string) => (
        <Space>
          <Avatar className='bg-blue-100 dark:bg-blue-900/30 text-blue-600 border-none'>
            {text[0]}
          </Avatar>
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Primary Contact',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: 'Deal Value',
      dataIndex: 'value',
      key: 'value',
      align: 'right' as const,
      render: (value: number) => (
        <Text strong className='text-blue-600 dark:text-blue-400'>
          {value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </Text>
      ),
    },
    {
      title: 'Probability',
      dataIndex: 'probability',
      key: 'probability',
      render: (percent: number) => (
        <div className='w-24'>
          <Progress
            percent={percent}
            size='small'
            strokeColor={percent > 70 ? '#10b981' : percent > 40 ? '#fbbf24' : '#6366f1'}
          />
        </div>
      ),
    },
    {
      title: 'Stage',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag className='rounded-full px-3' color={isDark ? 'blue-inverse' : 'blue'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const config = {
          High: { color: 'orange', icon: <Clock size={12} className='mr-1' /> },
          Medium: { color: 'blue', icon: <Clock size={12} className='mr-1' /> },
          Critical: { color: 'red', icon: <Zap size={12} className='mr-1' /> },
          Low: { color: 'gray', icon: <Clock size={12} className='mr-1' /> },
        };
        const { color, icon } = config[priority as keyof typeof config];
        return (
          <Tag
            color={color}
            className='flex items-center w-fit border-none px-3 py-0.5 rounded-full'
          >
            {icon} {priority}
          </Tag>
        );
      },
    },
  ];

  return (
    <motion.div
      className='space-y-8'
      initial='hidden'
      animate='visible'
      variants={containerVariants}
    >
      {/* --- Header --- */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            CRM Dashboard
          </Title>
          <Text type='secondary'>Monitor your sales pipeline and lead performance</Text>
        </div>
        <div className='flex items-center gap-3'>
          <RangePicker className='rounded-lg shadow-sm border-gray-200 dark:border-slate-800' />
          <Button icon={<Download size={16} />} className='flex items-center gap-2'>
            Export Data
          </Button>
          <Button
            type='primary'
            style={{ backgroundColor: primaryColor }}
            className='flex items-center gap-2'
          >
            Add New Lead
          </Button>
        </div>
      </div>

      {/* --- Stats Cards --- */}
      <Row gutter={[24, 24]}>
        {[
          {
            title: 'Total Leads',
            value: '1,284',
            trend: '+14%',
            icon: <Users className='text-blue-500' />,
            color: 'bg-blue-50 dark:bg-blue-900/20',
          },
          {
            title: 'Open Opportunities',
            value: '84',
            trend: '+8%',
            icon: <Target className='text-indigo-500' />,
            color: 'bg-indigo-50 dark:bg-indigo-900/20',
          },
          {
            title: 'Goal Conversion',
            value: '28.4%',
            trend: '+3.2%',
            icon: <Zap className='text-amber-500' />,
            color: 'bg-amber-50 dark:bg-amber-900/20',
          },
          {
            title: 'Avg. Deal Size',
            value: '$12,450',
            trend: '+5.5%',
            icon: <BarChart3 className='text-emerald-500' />,
            color: 'bg-emerald-50 dark:bg-emerald-900/20',
          },
        ].map((stat, idx) => (
          <Col xs={24} sm={12} lg={6} key={idx}>
            <motion.div variants={itemVariants}>
              <Card
                bordered={false}
                className='shadow-xs hover:shadow-md transition-all duration-300 dark:bg-slate-900'
              >
                <div className='flex items-start justify-between'>
                  <div className='space-y-1'>
                    <Text type='secondary' className='text-xs font-bold uppercase tracking-tight'>
                      {stat.title}
                    </Text>
                    <div className='flex items-baseline gap-2'>
                      <Title level={3} style={{ margin: 0 }}>
                        {stat.value}
                      </Title>
                      <Text className='text-xs font-semibold text-emerald-500 flex items-center gap-0.5'>
                        <ArrowUpRight size={14} /> {stat.trend}
                      </Text>
                    </div>
                  </div>
                  <div className={cn('p-4 rounded-2xl', stat.color)}>{stat.icon}</div>
                </div>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* --- Charts --- */}
      <Row gutter={[24, 24]}>
        <Col span={24} lg={16}>
          <motion.div variants={itemVariants}>
            <Card
              title={
                <div className='flex items-center gap-2 py-1'>
                  <Layers size={18} className='text-indigo-500' />
                  <span>Sales Pipeline Stages</span>
                </div>
              }
              bordered={false}
              className='shadow-sm dark:bg-slate-900'
            >
              <div className='h-[350px] w-full mt-4'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={pipelineData} layout='vertical' margin={{ left: 20 }}>
                    <CartesianGrid
                      strokeDasharray='3 3'
                      horizontal={false}
                      stroke={isDark ? '#334155' : '#e2e8f0'}
                    />
                    <XAxis type='number' hide />
                    <YAxis
                      dataKey='stage'
                      type='category'
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 13 }}
                    />
                    <RechartsTooltip
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Bar dataKey='count' radius={[0, 8, 8, 0]} barSize={32}>
                      {pipelineData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
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
                  <PieChartIcon size={18} className='text-pink-500' />
                  <span>Lead Distribution</span>
                </div>
              }
              bordered={false}
              className='shadow-sm h-full dark:bg-slate-900'
            >
              <div className='h-[280px] w-full'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={leadSourceData}
                      cx='50%'
                      cy='50%'
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={6}
                      dataKey='value'
                    >
                      {leadSourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        border: 'none',
                        borderRadius: '12px',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className='mt-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-between'>
                <div>
                  <Text type='secondary' className='text-xs block'>
                    Most Efficient Channel
                  </Text>
                  <Text strong className='text-blue-500'>
                    Organic Search (42%)
                  </Text>
                </div>
                <Button type='text' icon={<ArrowRight size={18} />} />
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* --- Detailed Section --- */}
      <Row gutter={[24, 24]}>
        <Col span={24} lg={16}>
          <motion.div variants={itemVariants}>
            <Card
              title={
                <div className='flex items-center justify-between w-full py-1'>
                  <div className='flex items-center gap-2'>
                    <CheckCircle2 size={18} className='text-emerald-500' />
                    <span>Top Active Deals</span>
                  </div>
                  <Button type='link'>View All Leads</Button>
                </div>
              }
              bordered={false}
              className='shadow-sm dark:bg-slate-900'
            >
              <Table
                columns={tableColumns}
                dataSource={topDeals}
                pagination={false}
                scroll={{ x: 800 }}
                className='crm-table rounded-xl overflow-hidden'
              />
            </Card>
          </motion.div>
        </Col>

        <Col span={24} lg={8}>
          <motion.div variants={itemVariants} className='space-y-6'>
            <Card bordered={false} className='shadow-sm dark:bg-slate-900'>
              <div className='flex items-center gap-4'>
                <div className='p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl'>
                  <Phone size={24} className='text-blue-600' />
                </div>
                <div>
                  <Title level={4} style={{ margin: 0 }}>
                    Active Follow-ups
                  </Title>
                  <Text type='secondary'>24 calls scheduled for today</Text>
                </div>
              </div>
              <div className='mt-6 flex flex-col gap-3'>
                {[
                  { name: 'Sarah Wilson', time: '10:30 AM', type: 'Call' },
                  { name: 'James Miller', time: '02:00 PM', type: 'Meeting' },
                  { name: 'Emma Brown', time: '04:15 PM', type: 'Email' },
                ].map((item, id) => (
                  <div
                    key={id}
                    className='flex items-center justify-between p-3 border border-gray-300 shadow dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors'
                  >
                    <Space>
                      <Avatar
                        size='small'
                        className='bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                      >
                        {item.name[0]}
                      </Avatar>
                      <Text className='text-sm'>{item.name}</Text>
                    </Space>
                    <Tag className='rounded-full border-none bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 text-[10px]'>
                      {item.time}
                    </Tag>
                  </div>
                ))}
              </div>
            </Card>

            <Card
              bordered={false}
              className='shadow-sm dark:bg-slate-900 bg-linear-to-br from-indigo-500 to-purple-600'
            >
              <div className='space-y-4'>
                <Title level={4} className='text-white! m-0!'>
                  Weekly Goal
                </Title>
                <div className='flex items-end gap-2'>
                  <Title level={2} className='text-white! m-0!'>
                    72%
                  </Title>
                  <Text className='text-indigo-100 text-sm mb-1'>completed</Text>
                </div>
                <Progress
                  percent={72}
                  showInfo={false}
                  strokeColor='#ffffff'
                  trailColor='rgba(255,255,255,0.2)'
                />
                <Text className='text-white/80 text-xs block'>
                  You need 14 more leads to hit this week's target of 45 leads.
                </Text>
                <Button
                  block
                  ghost
                  className='border-white/30 text-white hover:bg-white/10 rounded-xl'
                >
                  Update Goals
                </Button>
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </motion.div>
  );
};

export default DashboardCrm;
