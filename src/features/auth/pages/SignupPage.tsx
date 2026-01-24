import { Button, Form, Input, Checkbox, Typography, Divider } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, User, ArrowRight, Github, Chrome } from 'lucide-react';

const { Title, Text } = Typography;

export default function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    console.log('Signup values:', values);
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/login');
    }, 1000);
  };

  return (
    <div className='min-h-screen flex flex-col md:flex-row bg-white dark:bg-slate-950 overflow-hidden'>
      {/* Left Side: Illustration and Brand */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className='hidden md:flex flex-1 relative flex-col justify-center p-12 bg-linear-to-br from-indigo-700 via-blue-800 to-slate-900 text-white overflow-hidden'
      >
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
        </div>

        <div className='relative z-10'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className='flex items-center gap-3 mb-8'>
              <div
                className='w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 cursor-pointer'
                onClick={() => navigate('/')}
              >
                <div className='w-6 h-6 bg-white rounded-md rotate-45' />
              </div>
              <Title level={2} style={{ color: 'white', margin: 0, letterSpacing: '-0.02em' }}>
                INVENTORY 360ICT
              </Title>
            </div>

            <h1 className='text-5xl lg:text-6xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-linear-to-r from-white to-blue-200'>
              Join the Future <br /> of  Management
            </h1>
            <p className='text-xl text-blue-100/80 max-w-lg mb-12 font-light leading-relaxed'>
              Create your account and start optimizing your business workflows with our intelligent
              360-degree management platform.
            </p>

            <div className='flex gap-12 pt-8 border-t border-white/10'>
              <div>
                <h4 className='text-3xl font-bold text-white'>Free</h4>
                <p className='text-blue-200/60 text-sm'>14-Day Trial</p>
              </div>
              <div>
                <h4 className='text-3xl font-bold text-white'>24/7</h4>
                <p className='text-blue-200/60 text-sm'>Expert Support</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side: Signup Form */}
      <div className='flex-1 flex flex-col justify-center items-center p-6 md:p-12 bg-slate-50 dark:bg-slate-900'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='w-full max-w-[420px]'
        >
          <div className='mb-8'>
            <div className='md:hidden flex items-center gap-3 mb-8'>
              <div className='w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center'>
                <div className='w-5 h-5 bg-white rounded-sm rotate-45' />
              </div>
              <Title level={3} style={{ margin: 0 }}>
                INVENTORY 360ICT
              </Title>
            </div>
            <Title level={2} className='font-extrabold! mb-1!'>
              Create Account
            </Title>
            <Text type='secondary' className='text-base'>
              Get started with your free trial today.
            </Text>
          </div>

          <Form layout='vertical' onFinish={onFinish} requiredMark={false} className='space-y-3'>
            <Form.Item
              label={
                <span className='font-medium text-slate-700 dark:text-slate-300'>Full Name</span>
              }
              name='fullName'
              rules={[{ required: true, message: 'Please enter your full name' }]}
            >
              <Input
                prefix={<User size={18} className='text-slate-400 mr-2' />}
                className='h-11 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800'
                placeholder='John Doe'
              />
            </Form.Item>

            <Form.Item
              label={
                <span className='font-medium text-slate-700 dark:text-slate-300'>
                  Email Address
                </span>
              }
              name='email'
              rules={[{ required: true, message: 'Please enter your email' }, { type: 'email' }]}
            >
              <Input
                prefix={<Mail size={18} className='text-slate-400 mr-2' />}
                className='h-11 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800'
                placeholder='john@example.com'
              />
            </Form.Item>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <Form.Item
                label={
                  <span className='font-medium text-slate-700 dark:text-slate-300'>Password</span>
                }
                name='password'
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input.Password
                  prefix={<Lock size={18} className='text-slate-400 mr-2' />}
                  className='h-11 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800'
                  placeholder='••••••••'
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className='font-medium text-slate-700 dark:text-slate-300'>Confirm</span>
                }
                name='confirm'
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Required' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords mismatch!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<Lock size={18} className='text-slate-400 mr-2' />}
                  className='h-11 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800'
                  placeholder='••••••••'
                />
              </Form.Item>
            </div>

            <Form.Item
              name='terms'
              valuePropName='checked'
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('Accept T&C')),
                },
              ]}
            >
              <Checkbox className='text-slate-600 dark:text-slate-400 text-xs!'>
                I agree to the{' '}
                <a href='#' className='text-indigo-600 font-medium'>
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href='#' className='text-indigo-600 font-medium'>
                  Privacy Policy
                </a>
              </Checkbox>
            </Form.Item>

            <Button
              type='primary'
              htmlType='submit'
              size='large'
              block
              loading={loading}
              className='h-11 text-base font-bold rounded-lg shadow-lg shadow-indigo-200 dark:shadow-none bg-indigo-600 border-none hover:bg-indigo-500 transition-all flex items-center justify-center gap-2'
            >
              Start Free Trial <ArrowRight size={18} />
            </Button>
          </Form>

          <div className='mt-6'>
            <Divider plain className='text-slate-400! text-[10px]! font-medium!'>
              OR REGISTER WITH
            </Divider>
            <div className='grid grid-cols-2 gap-3 mt-4'>
              <Button
                block
                icon={<Chrome size={16} />}
                className='h-10 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 flex items-center justify-center gap-2 text-sm'
              >
                Google
              </Button>
              <Button
                block
                icon={<Github size={16} />}
                className='h-10 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 flex items-center justify-center gap-2 text-sm'
              >
                GitHub
              </Button>
            </div>
          </div>

          <p className='text-center mt-6 text-slate-500 dark:text-slate-400 text-sm!'>
            Already have an account?{' '}
            <a
              onClick={() => navigate('/login')}
              className='text-indigo-600 font-bold hover:underline cursor-pointer'
            >
              Sign In
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
