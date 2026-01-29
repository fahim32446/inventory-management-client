import { Button, Checkbox, Form, Input, message, Typography } from 'antd';
import { BroadcastChannel } from 'broadcast-channel';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLogin2FAMutation, useLoginMutation } from '../api/authApi';
import { ILoginBody } from '../auth.interface';

export interface IAuthChannel {
  type: 'LOGIN';
  credentials: ILoginBody;
}

const { Title, Text } = Typography;

export default function LoginPage() {
  const channel = new BroadcastChannel('auth_channel');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [loginUser, { isLoading }] = useLoginMutation();
  const [login2FA, { isLoading: isLoading2FA }] = useLogin2FAMutation();
  const [show2FA, setShow2FA] = useState(false);
  const [savedCredentials, setSavedCredentials] = useState<ILoginBody | null>(null);

  const onFinish = async (values: any) => {
    if (show2FA) {
      const payload = {
        otp: values.otp,
        user_or_email: savedCredentials?.user_or_email,
      };
      login2FA(payload as any)
        .unwrap()
        .then(() => {
          navigate(from, { replace: true });
        });

      return;
    }

    const { remember: _r, ...rest } = values;
    channel.postMessage({ type: 'LOGIN', credentials: values });

    loginUser({ ...rest })
      .unwrap()
      .then((res) => {
        if (res?.data?.two_fa) {
          setShow2FA(true);
          setSavedCredentials(rest);
        } else {
          navigate(from, { replace: true });
        }
      })
      .catch((e) => {
        message.error(e?.data?.message || 'Login failed. Please try again.');
      });
  };

  useEffect(() => {
    const handleMessage = (event: IAuthChannel) => {
      if (event?.type === 'LOGIN') {
        const { credentials = null } = event;
        if (credentials?.user_or_email && credentials?.password) {
          onFinish(credentials);
        }
      }
    };

    channel.addEventListener('message', handleMessage);
    return () => {
      channel.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div className='min-h-screen flex flex-col md:flex-row bg-white dark:bg-slate-950 overflow-hidden'>
      {/* Left Side: Illustration and Brand */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className='hidden md:flex flex-1 relative flex-col justify-center p-12 bg-linear-to-br from-indigo-700 via-blue-800 to-slate-900 text-white overflow-hidden'
      >
        {/* Animated Background Elements */}
        <div className='absolute inset-0 z-0'>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className='absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-white rounded-full blur-[100px]'
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [0, -90, 0],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className='absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[120px]'
          />
        </div>

        <div className='relative z-10'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className='flex items-center gap-3 mb-8'>
              <div className='w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30'>
                <div className='w-6 h-6 bg-white rounded-md rotate-45' />
              </div>
              <Title level={2} style={{ color: 'white', margin: 0, letterSpacing: '-0.02em' }}>
                INVENTORY 360
              </Title>
            </div>

            <h1 className='text-5xl lg:text-6xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-linear-to-r from-white to-blue-200'>
              The Intelligence <br /> Behind Your Business
            </h1>
            <p className='text-xl text-blue-100/80 max-w-lg mb-12 font-light leading-relaxed'>
              Seamlessly manage your enterprise resources with our next-generation platform.
              Real-time data, intuitive design, and powerful automation.
            </p>

            <div className='grid grid-cols-2 gap-8 pt-8 border-t border-white/10'>
              <div>
                <h4 className='text-3xl font-bold text-white'>99.9%</h4>
                <p className='text-blue-200/60 text-sm'>System Uptime</p>
              </div>
              <div>
                <h4 className='text-3xl font-bold text-white'>2k+</h4>
                <p className='text-blue-200/60 text-sm'>Active Users</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side: Login Form */}
      <div className='flex-1 flex flex-col justify-center items-center p-6 md:p-12 bg-slate-50 dark:bg-slate-900'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='w-full max-w-[420px]'
        >
          <div className='mb-10'>
            <div className='md:hidden flex items-center gap-3 mb-8'>
              <div className='w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center'>
                <div className='w-5 h-5 bg-white rounded-sm rotate-45' />
              </div>
              <Title level={3} style={{ margin: 0 }}>
                INVENTORY 360
              </Title>
            </div>
            <Title level={2} className='font-extrabold! mb-2!'>
              Sign In
            </Title>
            <Text type='secondary' className='text-base'>
              {show2FA
                ? 'Please enter the 6-digit verification code'
                : 'Welcome back! Please enter your details.'}
            </Text>
          </div>

          <Form
            layout='vertical'
            onFinish={onFinish}
            requiredMark={false}
            className='space-y-4'
            key={show2FA ? '2fa' : 'login'}
          >
            {!show2FA ? (
              <>
                <Form.Item
                  label={
                    <span className='font-medium text-slate-700 dark:text-slate-300'>
                      Email Address
                    </span>
                  }
                  name='user_or_email'
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email' },
                  ]}
                >
                  <Input
                    prefix={<Mail size={18} className='text-slate-400 mr-2' />}
                    className='h-12 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800'
                    placeholder='admin@example.com'
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className='font-medium text-slate-700 dark:text-slate-300'>Password</span>
                  }
                  name='password'
                  rules={[{ required: true, message: 'Please enter your password' }]}
                >
                  <Input.Password
                    prefix={<Lock size={18} className='text-slate-400 mr-2' />}
                    className='h-12 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800'
                    placeholder='••••••••'
                  />
                </Form.Item>

                <div className='flex items-center justify-between mb-6'>
                  <Form.Item name='remember' valuePropName='checked' noStyle>
                    <Checkbox className='text-slate-600 dark:text-slate-400'>
                      Remember for 30 days
                    </Checkbox>
                  </Form.Item>
                  <a
                    onClick={() => navigate('/forgot-password')}
                    className='text-indigo-600 font-semibold text-sm hover:text-indigo-500 transition-colors cursor-pointer'
                  >
                    Forgot password?
                  </a>
                </div>
              </>
            ) : (
              <div className='space-y-6'>
                <Form.Item
                  label={
                    <span className='font-medium text-slate-700 dark:text-slate-300'>
                      Verification Code
                    </span>
                  }
                  name='otp'
                  rules={[
                    { required: true, message: 'Please enter the code' },
                    { len: 6, message: 'Code must be 6 digits' },
                  ]}
                >
                  <Input
                    prefix={<ShieldCheck size={18} className='text-slate-400 mr-2' />}
                    className='h-12 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-center tracking-widest text-2xl'
                    placeholder='000000'
                    maxLength={6}
                  />
                </Form.Item>

                <button
                  type='button'
                  onClick={() => setShow2FA(false)}
                  className='flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium'
                >
                  <ArrowLeft size={16} /> Back to login
                </button>
              </div>
            )}

            <Button
              type='primary'
              htmlType='submit'
              size='large'
              block
              loading={isLoading || isLoading2FA}
              className='h-12 text-base font-bold rounded-lg shadow-lg shadow-indigo-200 dark:shadow-none bg-indigo-600 border-none hover:bg-indigo-500 transition-all flex items-center justify-center gap-2'
            >
              {show2FA ? 'Verify & Login' : 'Log in'} <ArrowRight size={18} />
            </Button>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
