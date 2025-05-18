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

interface AnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
}

const FadeIn: React.FC<AnimationProps> = ({ 
  children, 
  className = "", 
  delay = 0,
  duration = 0.4,
  ease = "easeOut"
}) => (
  <motion.div
    variants={fadeVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className={className}
    transition={{ delay, duration, ease }}
  >
    {children}
  </motion.div>
);

const SlideUp: React.FC<AnimationProps> = ({ 
  children, 
  className = "", 
  delay = 0,
  duration = 0.4,
  ease = "easeOut"
}) => (
  <motion.div
    variants={slideUpVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className={className}
    transition={{ delay, duration, ease }}
  >
    {children}
  </motion.div>
);

const Scale: React.FC<AnimationProps> = ({ 
  children, 
  className = "", 
  delay = 0,
  duration = 0.4,
  ease = "easeOut"
}) => (
  <motion.div
    variants={scaleVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className={className}
    transition={{ delay, duration, ease }}
  >
    {children}
  </motion.div>
);

const StaggerContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}> = ({ 
  children, 
  className = "",
  staggerDelay = 0.1
}) => (
  <motion.div
    variants={{
      ...staggerContainerVariants,
      visible: { 
        opacity: 1,
        transition: { 
          staggerChildren: staggerDelay,
          delayChildren: staggerDelay
        }
      }
    }}
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