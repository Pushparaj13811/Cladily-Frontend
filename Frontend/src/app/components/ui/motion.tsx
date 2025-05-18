import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// Fade in animation
const fadeVariants: Variants = {
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
const slideUpVariants: Variants = {
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
const scaleVariants: Variants = {
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
const staggerContainerVariants: Variants = {
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
const MotionDiv = motion.div;

const FadeIn: React.FC<{
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

const SlideUp: React.FC<{
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

const Scale: React.FC<{
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

const StaggerContainer: React.FC<{
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
const PageTransition: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <AnimatePresence mode="wait">
    {children}
  </AnimatePresence>
); 

export {
    fadeVariants,
    slideUpVariants,
    scaleVariants,
    staggerContainerVariants,
    MotionDiv,
    FadeIn,
    SlideUp,
    Scale,
    StaggerContainer,
    PageTransition
}