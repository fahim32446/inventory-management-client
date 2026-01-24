import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const ComingSoon = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract feature name from path: /sales/create -> Sales Create
  const featureName = location.pathname
    .split('/')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return (
    <div className='flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-8'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className='text-9xl mb-8 animate-bounce'>🚀</div>

        <h1 className='text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-600 mb-4'>
          Coming Soon
        </h1>

        <p className='text-lg text-gray-400 mb-8 max-w-md mx-auto'>
          We are working hard to bring you the{' '}
          <span className='text-green-600 font-semibold'>{featureName}</span> feature. Stay tuned
          for updates!
        </p>

        <Button
          type='primary'
          size='large'
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          className='bg-blue-600 hover:bg-blue-500 border-none h-12 px-8 rounded-xl font-medium'
        >
          Back to Dashboard
        </Button>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
