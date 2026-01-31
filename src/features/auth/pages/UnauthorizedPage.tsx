import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { useAppSelector } from '../../../hooks/hooks';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { primaryColor } = useAppSelector((state) => state.theme);

  return (
    <div className='flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-8'>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className='max-w-md w-full'
      >
        <div className='mb-8 flex justify-center'>
          <div 
            className='p-6 rounded-full bg-red-500/10 animate-pulse'
            style={{ color: '#ef4444' }}
          >
            <ShieldAlert size={80} strokeWidth={1.5} />
          </div>
        </div>

        <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
          Unauthorized Access
        </h1>

        <p className='text-lg text-gray-500 dark:text-gray-400 mb-8'>
          Sorry, you don't have the necessary permissions to access this page. 
          Please contact your administrator if you believe this is an error.
        </p>

        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Button
            type='primary'
            size='large'
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/dashboard')}
            className='h-12 px-8 rounded-xl font-medium border-none shadow-lg'
            style={{ backgroundColor: primaryColor }}
          >
            Back to Dashboard
          </Button>
          
          <Button
            size='large'
            onClick={() => navigate(-1)}
            className='h-12 px-8 rounded-xl font-medium border-gray-200 dark:border-gray-700 dark:text-gray-300'
          >
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default UnauthorizedPage;
