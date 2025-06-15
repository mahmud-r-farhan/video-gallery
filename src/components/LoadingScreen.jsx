import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      <div className="flex flex-col items-center space-y-4">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-16 h-16"
        >
          <Loader2 className="w-full h-full text-primary" />
        </motion.div>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5], y: [0, -8, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="text-primary font-medium text-lg"
        >
          Loading Your Experience...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;