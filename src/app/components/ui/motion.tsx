import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  fadeVariants, 
  slideUpVariants, 
  scaleVariants, 
  staggerContainerVariants 
} from './motionVariants';

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
    MotionDiv,
    FadeIn,
    SlideUp,
    Scale,
    StaggerContainer,
    PageTransition
}