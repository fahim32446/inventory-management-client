import {
  Badge,
  Button,
  Card,
  Empty,
  List,
  Popconfirm,
  Segmented,
  Skeleton,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  Globe,
  History,
  Monitor,
  Smartphone,
  Tablet,
  Trash2,
  XCircle,
} from 'lucide-react';
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
  const revokedCount = allSessions.length - activeCount;

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

  return (
    <section className='p-6 space-y-8'>
      {/* Header */}
      <header className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div>
          <Title level={4} className='mb-0!'>
            Session Management
          </Title>
          <Text type='secondary'>Manage and monitor devices currently signed in</Text>
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
              {
                label: (
                  <div className='flex items-center gap-2 px-3'>
                    <History size={14} />
                    <span>History</span>
                    <Badge count={revokedCount} size='small' color='#9ca3af' />
                  </div>
                ),
                value: 'revoked',
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
                        : 'hover:shadow-xl hover:border-primary/30'
                    )}
                  >
                    {/* Top */}
                    <div className='flex items-start justify-between'>
                      <div className='flex gap-4'>
                        <div className='h-14 w-14 flex items-center justify-center rounded-2xl bg-primary/10'>
                          {getDeviceIcon(session.device)}
                        </div>
                        <div>
                          <div className='flex items-center gap-2'>
                            <Text strong>{session.device || 'Unknown device'}</Text>
                            {!session.is_revoked && <Badge status='processing' />}
                          </div>
                          <div className='flex items-center gap-1 text-xs text-gray-500'>
                            <Globe size={12} />
                            {session.ip_address}
                          </div>
                        </div>
                      </div>

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

                    {/* Meta */}
                    <div className='mt-6 grid grid-cols-2 gap-4 rounded bg-gray-50 dark:bg-gray-800 p-2'>
                      <div>
                        <Text type='secondary' className='text-xs uppercase'>
                          Location
                        </Text>
                        <div className='font-medium'>{session.location || 'Unknown'}</div>
                      </div>
                      <div className='text-right'>
                        <Text type='secondary' className='text-xs uppercase'>
                          Last login
                        </Text>
                        <div className='font-medium'>{dayjs(session.created_at).fromNow()}</div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className='mt-5 flex items-center justify-between'>
                      <div className='flex gap-2'>
                        <Tag className='rounded-lg'>{session.user_type}</Tag>
                        {session.is_revoked && <Tag color='default'>Revoked</Tag>}
                      </div>
                      <Tooltip title={session.user_agent}>
                        <div className='flex items-center gap-1 text-xs text-gray-400 cursor-help'>
                          <Monitor size={14} /> Meta
                        </div>
                      </Tooltip>
                    </div>
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
