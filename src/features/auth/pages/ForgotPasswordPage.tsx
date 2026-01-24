import { Button, Form, Input, Space, Typography } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useMatchOptVerificationMutation,
  useResetPasswordMutation,
  useSendEmailVerificationMutation,
} from '../api/authApi';

const { Title, Text } = Typography;

type Step = 'email' | 'otp' | 'reset' | 'success';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  const [sendEmailVerification] = useSendEmailVerificationMutation();
  const [matchOTP] = useMatchOptVerificationMutation();
  const [resetPassword] = useResetPasswordMutation();

  const handleEmailSubmit = (values: { email: string }) => {
    setLoading(true);
    setEmail(values.email);

    sendEmailVerification({ email: values.email, type: 'reset_admin' })
      .unwrap()
      .then(() => {
        setStep('otp');
        setLoading(false);
      })
      .finally(() => setLoading(false));
  };

  const handleOtpSubmit = (values: { otp: string }) => {
    setLoading(true);

    matchOTP({ email: email, otp: values.otp, type: 'reset_admin' })
      .unwrap()
      .then((data) => {
        setToken(data?.token);
        setStep('reset');
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleResetSubmit = (values: any) => {
    setLoading(true);
    resetPassword({ token: token, password: values.password })
      .unwrap()
      .then(() => {
        setStep('success');
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className='min-h-screen flex flex-col md:flex-row bg-white dark:bg-slate-950 overflow-hidden'>
      {/* Left Side: Brand Identity (Reuse style) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className='hidden md:flex flex-1 relative flex-col justify-center p-12 bg-linear-to-br from-slate-800 via-slate-900 to-black text-white overflow-hidden'
      >
        <div className='absolute inset-0 z-0 opacity-30'>
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className='absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500 rounded-full blur-[120px]'
          />
        </div>

        <div className='relative z-10'>
          <div className='flex items-center gap-3 mb-10'>
            <div className='w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20'>
              <div className='w-6 h-6 bg-white rounded-md rotate-45' />
            </div>
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              INVENTORY 360ICT
            </Title>
          </div>

          <h1 className='text-5xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400'>
            Security & <br /> Data Privacy
          </h1>
          <p className='text-xl text-slate-300 max-w-md mb-12 font-light'>
            Your account security is our top priority. Follow the steps to safely reset your
            password.
          </p>

          <Space direction='vertical' size='large' className='w-full'>
            {[
              { icon: <Mail size={20} />, text: 'Verified Email Identity' },
              { icon: <ShieldCheck size={20} />, text: 'Multi-factor Authentication' },
              { icon: <Lock size={20} />, text: 'End-to-End Encryption' },
            ].map((item, i) => (
              <div key={i} className='flex items-center gap-4 text-slate-400'>
                <div className='w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white'>
                  {item.icon}
                </div>
                <span className='text-lg'>{item.text}</span>
              </div>
            ))}
          </Space>
        </div>
      </motion.div>

      {/* Right Side: Form Logic */}
      <div className='flex-1 flex flex-col justify-center items-center p-6 md:p-12 bg-slate-50 dark:bg-slate-900'>
        <AnimatePresence mode='wait'>
          {step === 'email' && (
            <motion.div
              key='email'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className='w-full max-w-[400px]'
            >
              <Title level={2} className='font-extrabold! mb-2'>
                Forgot Password?
              </Title>
              <Text type='secondary' className='text-base block mb-8'>
                No worries, we'll send you reset instructions.
              </Text>

              <Form layout='vertical' onFinish={handleEmailSubmit} requiredMark={false}>
                <Form.Item
                  label='Email Address'
                  name='email'
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email' },
                  ]}
                >
                  <Input
                    prefix={<Mail size={18} className='text-slate-400 mr-2' />}
                    className='h-12 rounded-lg'
                    placeholder='Enter your email'
                  />
                </Form.Item>

                <Button
                  type='primary'
                  htmlType='submit'
                  size='large'
                  block
                  loading={loading}
                  className='h-12 font-bold rounded-lg mb-6'
                >
                  Reset Password
                </Button>

                <Button
                  type='link'
                  block
                  icon={<ArrowLeft size={16} />}
                  onClick={() => navigate('/login')}
                  className='flex items-center justify-center gap-2 text-slate-500 hover:text-indigo-600'
                >
                  Back to Log in
                </Button>
              </Form>
            </motion.div>
          )}

          {step === 'otp' && (
            <motion.div
              key='otp'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className='w-full max-w-[400px]'
            >
              <div className='w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 mx-auto'>
                <ShieldCheck size={32} />
              </div>
              <Title level={2} className='text-center font-extrabold! mb-2'>
                Check your email
              </Title>
              <Text type='secondary' className='text-center block mb-8'>
                We sent a 6-digit code to{' '}
                <span className='text-slate-900 dark:text-white font-semibold'>{email}</span>
              </Text>

              <Form onFinish={(values) => handleOtpSubmit(values)} className='text-center'>
                <Form.Item name='otp' rules={[{ required: true, message: 'Enter the code' }]}>
                  <Input.OTP size='large' length={6} className='mb-8' />
                </Form.Item>

                <Button
                  type='primary'
                  htmlType='submit'
                  size='large'
                  block
                  loading={loading}
                  className='h-12 font-bold rounded-lg mb-6'
                >
                  Verify Code
                </Button>

                <div className='text-center text-slate-500'>
                  Didn't receive the email?{' '}
                  <button
                    onClick={() => setStep('email')}
                    className='text-indigo-600 font-bold hover:underline bg-transparent border-none cursor-pointer'
                  >
                    Click to resend
                  </button>
                </div>
              </Form>
            </motion.div>
          )}

          {step === 'reset' && (
            <motion.div
              key='reset'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className='w-full max-w-[400px]'
            >
              <Title level={2} className='font-extrabold! mb-2'>
                Set new password
              </Title>
              <Text type='secondary' className='text-base block mb-8'>
                Must be at least 8 characters long.
              </Text>

              <Form layout='vertical' onFinish={handleResetSubmit} requiredMark={false}>
                <Form.Item
                  label='New Password'
                  name='password'
                  rules={[{ required: true, message: 'Please enter new password' }, { min: 8 }]}
                >
                  <Input.Password
                    prefix={<Lock size={18} className='text-slate-400 mr-2' />}
                    className='h-12 rounded-lg'
                    placeholder='••••••••'
                  />
                </Form.Item>

                <Form.Item
                  label='Confirm Password'
                  name='confirm'
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Please confirm password' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) return Promise.resolve();
                        return Promise.reject(new Error('Passwords do not match!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<Lock size={18} className='text-slate-400 mr-2' />}
                    className='h-12 rounded-lg'
                    placeholder='••••••••'
                  />
                </Form.Item>

                <Button
                  type='primary'
                  htmlType='submit'
                  size='large'
                  block
                  loading={loading}
                  className='h-12 font-bold rounded-lg'
                >
                  Reset Password
                </Button>
              </Form>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key='success'
              initial={{ opacity: 1, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className='w-full max-w-[400px] text-center'
            >
              <div className='w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 mb-8 mx-auto'>
                <CheckCircle2 size={40} />
              </div>
              <Title level={2} className='font-extrabold! mb-2'>
                Password Reset
              </Title>
              <Text type='secondary' className='text-base block mb-10'>
                Your password has been successfully reset. <br /> You can now log in with your new
                password.
              </Text>

              <Button
                type='primary'
                size='large'
                block
                onClick={() => navigate('/login')}
                className='h-12 font-bold rounded-lg shadow-lg shadow-indigo-200'
              >
                Continue to Login
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
