import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useOutlet } from 'react-router-dom';

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1, ease: 'easeInOut' }}
      className='h-full'
    >
      {children}
    </motion.div>
  );
};

export default function AnimatedOutlet() {
  const location = useLocation();
  const element = useOutlet();

  return (
    <AnimatePresence mode='wait'>
      <PageTransition key={location.pathname}>{element}</PageTransition>
    </AnimatePresence>
  );
}
