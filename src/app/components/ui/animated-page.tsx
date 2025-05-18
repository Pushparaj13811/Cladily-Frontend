import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedPageProps {
  children: React.ReactNode;
  className?: string;
  animationType?: 'fade' | 'slide' | 'scale';
}

/**
 * AnimatedPage - A wrapper component that adds smooth animations to pages
 * Use this component to wrap page content for consistent animations
 */
const AnimatedPage: React.FC<AnimatedPageProps> = ({ 
  children, 
  className = "", 
  animationType = 'fade' 
}) => {
  // Define animation variants based on the selected animation type
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.5 } },
      exit: { opacity: 0, transition: { duration: 0.3 } }
    },
    slide: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
      exit: { opacity: 0, y: 10, transition: { duration: 0.3 } }
    },
    scale: {
      initial: { opacity: 0, scale: 0.98 },
      animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
      exit: { opacity: 0, scale: 0.98, transition: { duration: 0.3 } }
    }
  };

  // Select the appropriate animation variant
  const selectedVariant = variants[animationType];

  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={selectedVariant}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage; 