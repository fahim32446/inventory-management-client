import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <div className='flex justify-center items-center h-full min-h-[400px]'>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className='rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'
      />
    </div>
  );
};

export default Loading;
