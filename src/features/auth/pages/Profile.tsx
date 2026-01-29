import { Avatar, Button, Card, Col, Form, Input, Row, Switch, Typography } from 'antd';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Key,
  Lock,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from 'lucide-react';
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
        name: profileData.name,
        email: profileData.email,
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={containerVariants}
      className='min-h-screen p-2 md:px-8 max-w-7xl mx-auto space-y-8 dark:from-slate-950 dark:to-slate-900'
    >
      {/* Premium Header Section */}
      <motion.section variants={itemVariants} className='relative'>
        <div className='absolute inset-0 -z-10'>
          <div className='absolute top-0 right-0 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
          <div className='absolute top-0 -left-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
        </div>

        <Card
          className='border-0  bg-linear-to-br from-white via-blue-50 to-indigo-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800 overflow-hidden'
          styles={{ body: { padding: 32 } }}
        >
          <div className='flex flex-col md:flex-row items-center gap-8'>
            {/* Avatar Section */}
            <motion.div variants={cardVariants} className='relative shrink-0'>
              <div className='relative'>
                <Avatar
                  size={{ xs: 100, sm: 120, md: 140, lg: 140, xl: 140, xxl: 140 }}
                  src={profileData?.photo}
                  icon={<User />}
                  className='border-8 border-white  bg-linear-to-br from-blue-100 to-indigo-100'
                />
                <div className='absolute bottom-3 right-3 flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-lg'>
                  <div className='w-3 h-3 rounded-full bg-emerald-500 animate-pulse'></div>
                  <Text className='text-xs font-semibold text-gray-700'>Online</Text>
                </div>
              </div>
            </motion.div>

            {/* Profile Info Section */}
            <motion.div variants={itemVariants} className='flex-1 text-center md:text-left'>
              <div className='space-y-4'>
                <div>
                  <Title
                    level={2}
                    className='mb-1! text-3xl! md:text-4xl! font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'
                  >
                    {profileData?.name}
                  </Title>
                  <div className='flex items-center justify-center md:justify-start gap-3 mt-2'>
                    <div className='h-1.5 w-12 rounded-full bg-linear-to-r from-blue-500 to-indigo-500'></div>
                    <span className='text-sm font-semibold px-4 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full'>
                      {profileData?.role.role_name}
                    </span>
                    <CheckCircle2 size={18} className='text-emerald-500' />
                  </div>
                </div>

                <div className='flex flex-col md:flex-row gap-4 text-gray-600 dark:text-gray-300'>
                  <div className='flex items-center gap-2'>
                    <Mail size={16} className='text-blue-500' />
                    <Text>{profileData?.email}</Text>
                  </div>
                  <div className='hidden md:block h-6 w-px bg-gray-200 dark:bg-gray-700'></div>
                  <div className='flex items-center gap-2'>
                    <Phone size={16} className='text-indigo-500' />
                    <Text>{profileData?.phone_number || 'Not provided'}</Text>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Card>
      </motion.section>

      {/* Two-Factor Authentication Prominent Section */}
      <motion.section variants={itemVariants}>
        <Card
          className={cn(
            'border-0  transition-all duration-300 overflow-hidden',
            profileData?.two_fa
              ? 'bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950'
              : 'bg-linear-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950',
          )}
          styles={{ body: { padding: 0 } }}
        >
          <div className='flex flex-col md:flex-row items-center justify-between p-8 md:p-10'>
            <div className='flex items-center gap-6 flex-1'>
              <motion.div
                animate={{ rotate: profileData?.two_fa ? [0, 5, -5, 0] : 0 }}
                transition={{ duration: 2, repeat: Infinity }}
                className={cn(
                  'p-4 rounded-2xl shadow-lg',
                  profileData?.two_fa ? 'bg-emerald-500' : 'bg-red-500',
                )}
              >
                <ShieldCheck size={32} className='text-white' />
              </motion.div>

              <div className='flex-1'>
                <Title level={3} className='mb-2! font-bold'>
                  Two-Factor Authentication
                </Title>
                <div className='flex items-center gap-2'>
                  <span
                    className={cn(
                      'inline-block px-3 py-1 rounded-full text-sm font-semibold',
                      profileData?.two_fa
                        ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
                        : 'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200',
                    )}
                  >
                    {profileData?.two_fa ? '✓ ENABLED' : '✗ DISABLED'}
                  </span>
                  <Text className='text-gray-600 dark:text-gray-400'>
                    {profileData?.two_fa
                      ? 'Your account is protected with 2FA'
                      : 'Enhance your account security'}
                  </Text>
                </div>
              </div>
            </div>

            <motion.div variants={cardVariants} className='mt-6 md:mt-0 flex items-center gap-4'>
              <Switch
                checked={profileData?.two_fa}
                onChange={onToggle2FA}
                loading={isToggling2FA}
                className={cn(
                  'transition-all',
                  profileData?.two_fa
                    ? '[&.ant-switch]:bg-emerald-500'
                    : '[&.ant-switch]:bg-red-500',
                )}
              />
            </motion.div>
          </div>
        </Card>
      </motion.section>

      <Row gutter={[32, 32]}>
        {/* Left Sidebar - Profile Information */}
        <Col xs={24} lg={8}>
          <motion.div variants={itemVariants} className='space-y-6!'>
            {/* Profile Info Card */}
            <Card
              className='border-0 transition-shadow duration-300 bg-white dark:bg-slate-800'
              styles={{ body: { padding: 24 } }}
            >
              <div className='space-y-6'>
                <div className='flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700'>
                  <div className='p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg'>
                    <User size={20} className='text-blue-600 dark:text-blue-400' />
                  </div>
                  <Title level={4} className='mb-0! font-bold'>
                    Profile Information
                  </Title>
                </div>

                {/* Full Name */}
                <div className='space-y-2'>
                  <Text className='text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wide'>
                    Full Name
                  </Text>
                  <div className='p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 rounded-lg border border-gray-200 dark:border-slate-600'>
                    <Text className='font-semibold text-gray-900 dark:text-white text-lg'>
                      {profileData?.name || 'N/A'}
                    </Text>
                  </div>
                </div>

                {/* Email */}
                <div className='space-y-2'>
                  <Text className='text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wide'>
                    Email Address
                  </Text>
                  <div className='p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 rounded-lg border border-gray-200 dark:border-slate-600 flex items-center gap-2'>
                    <Mail size={16} className='text-blue-500 flex-shrink-0' />
                    <Text className='font-medium text-gray-700 dark:text-gray-300 text-sm truncate'>
                      {profileData?.email || 'N/A'}
                    </Text>
                  </div>
                </div>

                {/* Phone */}
                <div className='space-y-2'>
                  <Text className='text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wide'>
                    Phone Number
                  </Text>
                  <div className='p-3 bg-linear-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 rounded-lg border border-gray-200 dark:border-slate-600 flex items-center gap-2'>
                    <Phone size={16} className='text-indigo-500 shrink-0' />
                    <Text className='font-medium text-gray-700 dark:text-gray-300 text-sm'>
                      {profileData?.phone_number || 'Not provided'}
                    </Text>
                  </div>
                </div>

                {/* Role */}
                <div className='space-y-2'>
                  <Text className='text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wide'>
                    Account Role
                  </Text>
                  <div className='p-3 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800 flex items-center gap-2'>
                    <CheckCircle2 size={16} className='text-blue-600 dark:text-blue-400 shrink-0' />
                    <Text className='font-semibold text-blue-700 dark:text-blue-300'>
                      {profileData?.role.role_name}
                    </Text>
                  </div>
                </div>
              </div>
            </Card>

            {/* Security Status Card */}
            <Card
              className='border-0  transition-shadow duration-300 bg-white dark:bg-slate-800'
              styles={{ body: { padding: 24 } }}
            >
              <div className='space-y-4'>
                <div className='flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700'>
                  <div className='p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg'>
                    <Lock size={20} className='text-emerald-600 dark:text-emerald-400' />
                  </div>
                  <Title level={4} className='mb-0! font-bold'>
                    Security Status
                  </Title>
                </div>

                <div className='space-y-3'>
                  <div className='flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'>
                    <CheckCircle2
                      size={18}
                      className='text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5'
                    />
                    <div>
                      <Text className='font-semibold text-emerald-900 dark:text-emerald-100 text-sm'>
                        Account Verified
                      </Text>
                      <Text className='text-xs text-emerald-700 dark:text-emerald-300'>
                        Your email is verified
                      </Text>
                    </div>
                  </div>

                  <div
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-lg border',
                      profileData?.two_fa
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                        : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
                    )}
                  >
                    {profileData?.two_fa ? (
                      <CheckCircle2
                        size={18}
                        className='text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5'
                      />
                    ) : (
                      <AlertCircle
                        size={18}
                        className='text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5'
                      />
                    )}
                    <div>
                      <Text
                        className={cn(
                          'font-semibold text-sm',
                          profileData?.two_fa
                            ? 'text-emerald-900 dark:text-emerald-100'
                            : 'text-amber-900 dark:text-amber-100',
                        )}
                      >
                        Two-Factor Authentication {profileData?.two_fa ? 'Enabled' : 'Disabled'}
                      </Text>
                      <Text
                        className={cn(
                          'text-xs',
                          profileData?.two_fa
                            ? 'text-emerald-700 dark:text-emerald-300'
                            : 'text-amber-700 dark:text-amber-300',
                        )}
                      >
                        {profileData?.two_fa
                          ? 'Your account is extra secure'
                          : 'Add 2FA for extra security'}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </Col>

        {/* Right Section - Forms and Settings */}
        <Col xs={24} lg={16}>
          <motion.div variants={itemVariants} className='space-y-6'>
            {/* Edit Profile Card */}
            <Card
              className='border-0 transition-shadow duration-300 bg-white dark:bg-slate-800'
              styles={{ body: { padding: 24 } }}
            >
              <div className='space-y-6'>
                <div className='flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700'>
                  <div className='p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg'>
                    <User size={20} className='text-indigo-600 dark:text-indigo-400' />
                  </div>
                  <Title level={4} className='mb-0! font-bold'>
                    Edit Profile
                  </Title>
                </div>

                <Form
                  form={profileForm}
                  layout='vertical'
                  onFinish={onUpdateProfile}
                  requiredMark={false}
                >
                  <Row gutter={24}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label={
                          <Text className='font-semibold text-gray-700 dark:text-gray-300'>
                            Username
                          </Text>
                        }
                        name='username'
                        rules={[{ required: true, message: 'Username is required' }]}
                      >
                        <Input
                          prefix={<User size={16} className='text-gray-400' />}
                          size='large'
                          placeholder='Enter username'
                          className='rounded-lg'
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label={
                          <Text className='font-semibold text-gray-700 dark:text-gray-300'>
                            Display Name
                          </Text>
                        }
                        name='name'
                        rules={[{ required: true, message: 'Name is required' }]}
                      >
                        <Input
                          prefix={<User size={16} className='text-gray-400' />}
                          size='large'
                          placeholder='Enter display name'
                          className='rounded-lg'
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item
                    label={
                      <Text className='font-semibold text-gray-700 dark:text-gray-300'>
                        Primary Email
                      </Text>
                    }
                    name='email'
                    rules={[{ required: true, type: 'email' }]}
                  >
                    <Input
                      readOnly
                      prefix={<Mail size={16} className='text-gray-400' />}
                      size='large'
                      className='rounded-lg bg-gray-50 dark:bg-gray-700'
                    />
                  </Form.Item>
                  <Form.Item
                    label={
                      <Text className='font-semibold text-gray-700 dark:text-gray-300'>
                        Phone Number
                      </Text>
                    }
                    name='phone_number'
                  >
                    <Input
                      readOnly
                      prefix={<Phone size={16} className='text-gray-400' />}
                      size='large'
                      placeholder='Phone number'
                      className='rounded-lg bg-gray-50 dark:bg-gray-700'
                    />
                  </Form.Item>
                  <div className='flex justify-end pt-2'>
                    <Button type='primary' htmlType='submit' loading={isUpdatingProfile}>
                      Save Changes
                    </Button>
                  </div>
                </Form>
              </div>
            </Card>

            {/* Change Password Card */}
            <Card
              className='border-0  transition-shadow duration-300 bg-white dark:bg-slate-800'
              styles={{ body: { padding: 24 } }}
            >
              <div className='space-y-6'>
                <div className='flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700'>
                  <div className='p-2 bg-red-100 dark:bg-red-900/30 rounded-lg'>
                    <Key size={20} className='text-red-600 dark:text-red-400' />
                  </div>
                  <Title level={4} className='mb-0! font-bold'>
                    Change Password
                  </Title>
                </div>

                <Form
                  form={passwordForm}
                  layout='vertical'
                  onFinish={onChangePassword}
                  requiredMark={false}
                >
                  <Form.Item
                    label={
                      <Text className='font-semibold text-gray-700 dark:text-gray-300'>
                        Current Password
                      </Text>
                    }
                    name='old_password'
                    rules={[{ required: true, message: 'Please enter current password' }]}
                  >
                    <Input.Password
                      prefix={<Lock size={16} className='text-gray-400' />}
                      size='large'
                      placeholder='Enter your current password'
                      className='rounded-lg'
                    />
                  </Form.Item>

                  <Row gutter={24}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label={
                          <Text className='font-semibold text-gray-700 dark:text-gray-300'>
                            New Password
                          </Text>
                        }
                        name='new_password'
                        rules={[
                          {
                            required: true,
                            min: 6,
                            message: 'Password must be at least 6 characters',
                          },
                        ]}
                      >
                        <Input.Password
                          prefix={<Lock size={16} className='text-gray-400' />}
                          size='large'
                          placeholder='Enter new password'
                          className='rounded-lg'
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label={
                          <Text className='font-semibold text-gray-700 dark:text-gray-300'>
                            Confirm Password
                          </Text>
                        }
                        name='confirm_password'
                        dependencies={['new_password']}
                        rules={[
                          { required: true, message: 'Please confirm password' },
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
                          prefix={<Lock size={16} className='text-gray-400' />}
                          size='large'
                          placeholder='Confirm password'
                          className='rounded-lg'
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <div className='flex justify-end pt-2'>
                    <Button type='primary' htmlType='submit' loading={isChangingPassword} danger>
                      Update Password
                    </Button>
                  </div>
                </Form>
              </div>
            </Card>

            {/* Current Login Sessions */}
            <Card
              className='border-0  transition-shadow duration-300 bg-white dark:bg-slate-800'
              styles={{ body: { padding: 24 } }}
            >
              <div className='space-y-6'>
                <div className='flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700'>
                  <div className='p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg'>
                    <LogOut size={20} className='text-purple-600 dark:text-purple-400' />
                  </div>
                  <Title level={4} className='mb-0! font-bold'>
                    Current Login Sessions
                  </Title>
                </div>
                <CurrentLogin />
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .ant-form-item-label label {
          font-size: 0.875rem !important;
          color: #6b7280 !important;
        }

        .dark .ant-form-item-label label {
          color: #d1d5db !important;
        }

        .ant-input, .ant-input-password {
          border-radius: 0.5rem !important;
        }

        .ant-input:focus-within, .ant-input-password-input:focus {
          border-color: #4f46e5 !important;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1) !important;
        }

        .ant-btn-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%) !important;
          border: none !important;
        }

        .ant-btn-primary:hover {
          background: linear-gradient(135deg, #2563eb 0%, #4338ca 100%) !important;
        }
      `}</style>
    </motion.div>
  );
};

export default Profile;
