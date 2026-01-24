import { LoginOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Form, Input, Row, Switch, Tabs, Typography } from 'antd';
import { motion } from 'framer-motion';
import { CheckCircle2, Key, Mail, Phone, ShieldCheck, User } from 'lucide-react';
import { useEffect } from 'react';
import Loading from '../../../components/common/loading';
import { cn } from '../../../utils/cn';
import {
  useChangePasswordMutation,
  useGetProfileQuery,
  useToggle2FAMutation,
  useUpdateProfileMutation,
} from '../api/authApi';
import CurrentLogin from '../components/current-login';

const { Title, Text } = Typography;

const Profile = () => {
  const { data: profileResponse, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [toggle2FA, { isLoading: isToggling2FA }] = useToggle2FAMutation();

  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const profileData = profileResponse?.data;

  useEffect(() => {
    if (profileData) {
      profileForm.setFieldsValue({
        username: profileData.username,
        name: profileData.name,
        email: profileData.email,
        phone_number: profileData.phone_number,
      });
    }
  }, [profileData, profileForm]);

  const onUpdateProfile = async (values: any) => {
    const { email: _e, phone_number: _p, ...rest } = values;
    updateProfile(rest);
  };

  const onChangePassword = async (values: any) => {
    await changePassword({
      old_password: values.old_password,
      new_password: values.new_password,
    })
      .unwrap()
      .then(() => {
        passwordForm.resetFields();
      });
  };

  const onToggle2FA = async (checked: boolean) => {
    await toggle2FA({ two_fa: checked }).unwrap();
  };

  if (isLoading) {
    return <Loading />;
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={containerVariants}
      className='p-2 md:px-8 max-w-7xl mx-auto space-y-8'
    >
      {/* Header Section with Cover and Overlapping Avatar */}
      <section className='relative'>
        <div className='h-48 md:h-64 w-full rounded bg-linear-to-r from-blue-600 to-indigo-700 overflow-hidden relative shadow-lg'>
          <div className='absolute inset-0  opacity-20'></div>
          <div className='absolute inset-0 bg-black/10'></div>
        </div>

        <div className='px-6 md:px-12 -mt-16 md:-mt-20 flex flex-col md:flex-row items-end gap-6 relative z-10'>
          <div className='relative group'>
            <Avatar
              size={{ xs: 100, sm: 120, md: 160, lg: 160, xl: 160, xxl: 160 }}
              src={profileData?.photo}
              icon={<User />}
              className='border-8 border-white shadow-2xl bg-gray-100'
            />
            <div className='absolute bottom-4 right-4 h-6 w-6 rounded-full bg-green-500 border-4 border-white shadow-sm ring-2 ring-green-100 animate-pulse'></div>
          </div>

          <div className='flex-1 pb-2 text-center md:text-left'>
            <Title level={1} className='mb-0! text-3xl! md:text-4xl! font-bold'>
              {profileData?.name}
            </Title>
            <div className='flex items-center justify-center md:justify-start gap-2 mt-1'>
              <Text className='text-gray-500 font-medium'>@{profileData?.username}</Text>
              <span className='h-1 w-1 rounded-full bg-gray-300'></span>
              <Text className='text-primary font-semibold'>{profileData?.role.role_name}</Text>
            </div>
          </div>

          <div className='flex gap-3 mb-2 w-full md:w-auto'>
            <Button
              type='primary'
              size='large'
              icon={<CheckCircle2 size={18} />}
              className='rounded-2xl bg-primary hover:bg-primary-hover border-none shadow-md px-8 flex-1 md:flex-initial'
            >
              Verified Account
            </Button>
          </div>
        </div>
      </section>

      <Row gutter={[32, 32]}>
        <Col xs={24} lg={8}>
          <motion.div variants={itemVariants} className='space-y-6!'>
            <Card
              size='small'
              className='shadow-sm border-gray-100 bg-linear-to-br from-gray-900 to-gray-800 text-white border-none'
            >
              <div>
                <Title level={5} className='dark:text-white! mb-6 flex items-center gap-2'>
                  <div className='p-2 bg-white/10 rounded-xl'>
                    <ShieldCheck size={18} />
                  </div>
                  Security Status
                </Title>
                <div className='space-y-4'>
                  <div
                    className={cn(
                      'flex items-center justify-between p-3 bg-red-300/30! rounded',
                      profileData?.two_fa ? 'bg-green-300/30!' : ''
                    )}
                  >
                    <div className='flex items-center gap-3'>
                      <ShieldCheck className='text-green-400' size={20} />
                      <Text className='dark:text-white! font-medium'>Two-Factor Auth</Text>
                    </div>
                    <Switch
                      checked={profileData?.two_fa}
                      onChange={onToggle2FA}
                      loading={isToggling2FA}
                      className='bg-gray-700 [&.ant-switch-checked]:bg-green-500'
                    />
                  </div>
                </div>
              </div>
            </Card>
            <Card
              size='small'
              className='shadow-sm border-gray-100 bg-linear-to-br from-gray-900 to-gray-800 text-white border-none'
            >
              <div>
                <Title
                  level={5}
                  className='flex items-center gap-3 text-gray-800 dark:text-gray-100'
                >
                  <div
                    className='flex h-9 w-9 items-center justify-center rounded-xl 
                   bg-blue-50 text-blue-600 
                   dark:bg-blue-900/30 dark:text-blue-400'
                  >
                    <User size={18} />
                  </div>
                  <span className='font-semibold tracking-wide'>About Me</span>
                </Title>

                <div className='space-y-4'>
                  {/* Full Name */}
                  <div className='flex flex-col gap-1'>
                    <Text className='text-xs font-semibold uppercase  text-gray-500 dark:text-gray-400'>
                      Full Name
                    </Text>
                    <Text className='text-base font-medium text-gray-800 dark:text-gray-100'>
                      {profileData?.name || 'N/A'}
                    </Text>
                  </div>

                  {/* Email */}
                  <div className='flex flex-col gap-1'>
                    <Text className='text-xs font-semibold uppercase  text-gray-500 dark:text-gray-400'>
                      Email Address
                    </Text>
                    <div className='flex items-center gap-2 text-gray-700 dark:text-gray-200'>
                      <Mail size={14} className='text-gray-400 dark:text-gray-500' />
                      <Text className='text-sm font-medium'>{profileData?.email || 'N/A'}</Text>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className='flex flex-col gap-1'>
                    <Text className='text-xs font-semibold uppercase  text-gray-500 dark:text-gray-400'>
                      Phone Number
                    </Text>
                    <div className='flex items-center gap-2 text-gray-700 dark:text-gray-200'>
                      <Phone size={14} className='text-gray-400 dark:text-gray-500' />
                      <Text className='text-sm font-medium'>
                        {profileData?.phone_number || 'N/A'}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} lg={16}>
          <motion.div variants={itemVariants}>
            <Card size='small' className='overflow-hidden' styles={{ body: { padding: 0 } }}>
              <Tabs
                defaultActiveKey='1'
                className='premium-tabs'
                items={[
                  {
                    key: '1',
                    label: (
                      <div className='flex items-center gap-2 px-6 py-3'>
                        <User size={18} />
                        <span>Public Profile</span>
                      </div>
                    ),
                    children: (
                      <Card className='shadow'>
                        <Form
                          form={profileForm}
                          layout='vertical'
                          onFinish={onUpdateProfile}
                          requiredMark={false}
                        >
                          <Row gutter={24}>
                            <Col span={12}>
                              <Form.Item
                                label={<Text className='font-semibold'>Username</Text>}
                                name='username'
                                rules={[{ required: true, message: 'Username is required' }]}
                              >
                                <Input
                                  prefix={<User size={16} className='text-gray-400' />}
                                  size='middle'
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                label={<Text className='font-semibold'>Display Name</Text>}
                                name='name'
                                rules={[{ required: true, message: 'Name is required' }]}
                              >
                                <Input
                                  prefix={<User size={16} className='text-gray-400' />}
                                  size='middle'
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Form.Item
                            label={<Text className='font-semibold'>Primary Email</Text>}
                            name='email'
                            rules={[{ required: true, type: 'email' }]}
                          >
                            <Input
                              readOnly
                              prefix={<Mail size={16} className='text-gray-400' />}
                              size='middle'
                            />
                          </Form.Item>
                          <Form.Item
                            label={<Text className='font-semibold'>Phone Contact</Text>}
                            name='phone_number'
                          >
                            <Input
                              readOnly
                              prefix={<Phone size={16} className='text-gray-400' />}
                              size='middle'
                            />
                          </Form.Item>
                          <div className=' flex justify-end'>
                            <Button
                              type='primary'
                              htmlType='submit'
                              loading={isUpdatingProfile}
                              className='rounded-2xl bg-primary h-12 px-12 font-bold shadow-lg shadow-primary/20'
                            >
                              Save Changes
                            </Button>
                          </div>
                        </Form>
                      </Card>
                    ),
                  },
                  {
                    key: '2',
                    label: (
                      <div className='flex items-center gap-2 px-6 py-3'>
                        <Key size={18} />
                        <span>Security Settings</span>
                      </div>
                    ),
                    children: (
                      <Card className='shadow'>
                        <Title level={4} className='mb-6!'>
                          Change Your Password
                        </Title>
                        <Form
                          form={passwordForm}
                          layout='vertical'
                          onFinish={onChangePassword}
                          requiredMark={false}
                        >
                          <Form.Item
                            label={<Text className='font-semibold'>Current Password</Text>}
                            name='old_password'
                            rules={[{ required: true, message: 'Please enter current password' }]}
                          >
                            <Input.Password
                              prefix={<Key size={16} className='text-gray-400' />}
                              placeholder='Provide your current password'
                            />
                          </Form.Item>
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <Form.Item
                              label={<Text className='font-semibold'>New Password</Text>}
                              name='new_password'
                              rules={[
                                { required: true, min: 6, message: 'Please enter new password' },
                              ]}
                            >
                              <Input.Password
                                prefix={<Key size={16} className='text-gray-400' />}
                                placeholder='Provide your new password'
                              />
                            </Form.Item>
                            <Form.Item
                              label={<Text className='font-semibold'>Confirm Password</Text>}
                              name='confirm_password'
                              dependencies={['new_password']}
                              rules={[
                                { required: true },
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    if (!value || getFieldValue('new_password') === value) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match'));
                                  },
                                }),
                              ]}
                            >
                              <Input.Password
                                prefix={<Key size={16} className='text-gray-400' />}
                                placeholder='Provide your confirm password'
                              />
                            </Form.Item>
                          </div>
                          <div className='flex justify-end'>
                            <Button
                              type='primary'
                              htmlType='submit'
                              loading={isChangingPassword}
                              className='rounded-2xl bg-gray-900 border-none h-12 px-12 font-bold shadow-lg shadow-black/20'
                            >
                              Update Password
                            </Button>
                          </div>
                        </Form>
                      </Card>
                    ),
                  },

                  {
                    key: '3',
                    label: (
                      <div className='flex items-center gap-2 px-6 py-3'>
                        <LoginOutlined size={18} />
                        <span>Current Login</span>
                      </div>
                    ),
                    children: <CurrentLogin />,
                  },
                ]}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      <style>{`
        .premium-tabs .ant-tabs-nav {
          margin-bottom: 0 !important;

        }
        .premium-tabs .ant-tabs-tab {
          margin: 0 !important;
          padding: 0 !important;
          transition: all 0.3s ease;
        }
        .premium-tabs .ant-tabs-tab-active {
          background-color: #f9fafb;
        }
        .premium-tabs .ant-tabs-ink-bar {

        }
        .ant-form-item-label label {
          font-size: 0.875rem !important;
          color: #374151 !important;
        }
      `}</style>
    </motion.div>
  );
};

export default Profile;
