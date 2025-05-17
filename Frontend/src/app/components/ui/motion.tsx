import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// Fade in animation
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// Slide up animation
export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    y: 10,
    transition: { duration: 0.2 }
  }
};

// Scale animation
export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.4,
      ease: "easeOut" 
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

// Staggered children animation
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Motion components with default variants
export const MotionDiv = motion.div;

export const FadeIn: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = "", delay = 0 }) => (
  <motion.div
    variants={fadeVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className={className}
    transition={{ delay }}
  >
    {children}
  </motion.div>
);

export const SlideUp: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = "", delay = 0 }) => (
  <motion.div
    variants={slideUpVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className={className}
    transition={{ delay }}
  >
    {children}
  </motion.div>
);

export const Scale: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = "", delay = 0 }) => (
  <motion.div
    variants={scaleVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className={className}
    transition={{ delay }}
  >
    {children}
  </motion.div>
);

export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <motion.div
    variants={staggerContainerVariants}
    initial="hidden"
    animate="visible"
    className={className}
  >
    {children}
  </motion.div>
);

// AnimatePresence wrapper for routes
export const PageTransition: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <AnimatePresence mode="wait">
    {children}
  </AnimatePresence>
); 