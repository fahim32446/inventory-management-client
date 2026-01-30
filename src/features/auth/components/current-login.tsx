import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  List,
  Popconfirm,
  Row,
  Segmented,
  Skeleton,
  Space,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, Globe, Monitor, Smartphone, Tablet, Trash2, XCircle } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { cn } from '../../../utils/cn';
import {
  useGetCurrentLoginQuery,
  useRevokeAllSessionsMutation,
  useRevokeSessionMutation,
} from '../api/authApi';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

const MotionCard = motion(Card);

const CurrentLogin: React.FC = () => {
  const [view, setView] = useState<'active' | 'revoked'>('active');
  const { data: response, isLoading } = useGetCurrentLoginQuery();

  const [revokeSession] = useRevokeSessionMutation();
  const [revokeAllSessions, { isLoading: isRevokingAll }] = useRevokeAllSessionsMutation();

  const allSessions = response?.data || [];

  const filteredSessions = useMemo(() => {
    return allSessions.filter((s) => (view === 'active' ? !s.is_revoked : s.is_revoked));
  }, [allSessions, view]);

  const activeCount = useMemo(() => allSessions.filter((s) => !s.is_revoked).length, [allSessions]);

  const getDeviceIcon = (device?: string) => {
    const d = device?.toLowerCase() || '';
    if (d.includes('phone') || d.includes('android') || d.includes('iphone'))
      return <Smartphone size={22} className='text-blue-500' />;
    if (d.includes('tablet') || d.includes('ipad'))
      return <Tablet size={22} className='text-purple-500' />;
    return <Monitor size={22} className='text-indigo-500' />;
  };

  if (isLoading) {
    return (
      <Card className='border-none shadow-none bg-transparent'>
        <Skeleton active paragraph={{ rows: 5 }} />
      </Card>
    );
  }

  const revokedCount = allSessions.filter((s) => s.is_revoked).length;

  return (
    <section className='p-6 space-y-8'>
      {/* Header */}
      <header className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div>
          <Title level={4} className='mb-0!'>
            Session Management
          </Title>
          <Text type='secondary'>Monitor and manage active sessions across devices</Text>
        </div>

        <div className='flex flex-wrap items-center gap-3'>
          <Segmented
            value={view}
            onChange={(v) => setView(v as 'active' | 'revoked')}
            className='rounded-xl bg-gray-100/80 dark:bg-gray-800'
            options={[
              {
                label: (
                  <div className='flex items-center gap-2 px-3'>
                    <Activity size={14} />
                    <span>Active</span>
                    <Badge count={activeCount} size='small' />
                  </div>
                ),
                value: 'active',
              },
            ]}
          />

          {view === 'active' && activeCount > 1 && (
            <Popconfirm
              title='Sign out from all devices?'
              description='This will end all active sessions except your current one.'
              onConfirm={() => revokeAllSessions()}
              okText='Sign out all'
              okButtonProps={{ danger: true }}
            >
              <Button
                danger
                type='primary'
                icon={<XCircle size={16} />}
                loading={isRevokingAll}
                className='rounded-xl'
              >
                Sign out all
              </Button>
            </Popconfirm>
          )}
        </div>
      </header>

      {/* Content */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {filteredSessions.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={view === 'active' ? 'No active sessions found' : 'No revoked sessions'}
              className='py-16 rounded-3xl bg-gray-50/50 dark:bg-gray-800/40'
            />
          ) : (
            <List
              grid={{ gutter: 20, xs: 1, md: 2, xl: 3 }}
              dataSource={filteredSessions}
              renderItem={(session) => (
                <List.Item>
                  <MotionCard
                    size='small'
                    layout
                    hoverable={!session.is_revoked}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      session.is_revoked
                        ? 'opacity-70 grayscale'
                        : 'hover:shadow-xl hover:border-primary/30',
                    )}
                  >
                    <Row align='middle' gutter={[12, 12]}>
                      <Col flex='none'>
                        <Avatar size={56} className='bg-gray-100 dark:bg-gray-800'>
                          {getDeviceIcon(session.device)}
                        </Avatar>
                      </Col>

                      <Col flex='auto'>
                        <Space direction='vertical' size={2} style={{ width: '100%' }}>
                          <div className='flex items-center justify-between gap-3'>
                            <div>
                              <Text strong className='block'>
                                {session.device || 'Unknown device'}
                              </Text>
                              <Text type='secondary' className='text-xs block'>
                                <Globe size={12} className='inline mr-1' /> {session.ip_address}
                              </Text>
                            </div>

                            <div className='text-right'>
                              <Text type='secondary' className='text-xs uppercase'>
                                Last active
                              </Text>
                              <div className='font-medium'>
                                <Tooltip
                                  title={dayjs(session.created_at).format('MMM D, YYYY HH:mm')}
                                >
                                  {dayjs(session.created_at).fromNow()}
                                </Tooltip>
                              </div>
                            </div>
                          </div>

                          <Divider style={{ margin: '6px 0' }} />

                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                              <Tag
                                className='rounded-lg'
                                color={session.is_revoked ? 'default' : 'processing'}
                              >
                                {session.user_type || 'User'}
                              </Tag>
                              {session.location && (
                                <Text type='secondary' className='text-xs'>
                                  {session.location}
                                </Text>
                              )}
                            </div>

                            <div className='flex items-center gap-2'>
                              <Tooltip title={session.user_agent} placement='left'>
                                <Text className='text-xs text-gray-400 cursor-help'>Meta</Text>
                              </Tooltip>

                              {!session.is_revoked && (
                                <Popconfirm
                                  title='End this session?'
                                  onConfirm={() => revokeSession({ sessionId: session.id })}
                                  okText='End'
                                  okButtonProps={{ danger: true }}
                                >
                                  <Button type='text' danger icon={<Trash2 size={16} />} />
                                </Popconfirm>
                              )}
                            </div>
                          </div>
                        </Space>
                      </Col>
                    </Row>
                  </MotionCard>
                </List.Item>
              )}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default CurrentLogin;
