import React from 'react';
import { motion } from 'framer-motion';
import { fadeVariants, slideUpVariants, scaleVariants } from './motionVariants';

type AnimationType = 'fade' | 'slideUp' | 'slideRight' | 'slideLeft' | 'scale';

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  animationType?: AnimationType;
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
}

/**
 * ScrollAnimation - Component to animate elements as they enter the viewport
 * Perfect for sections, cards, or any element that should animate on scroll
 */
const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  className = "",
  animationType = 'fade',
  delay = 0,
  duration = 0.5,
  once = true,
  threshold = 0.1
}) => {
  // Get the base animation variant
  const getBaseVariant = () => {
    switch(animationType) {
      case 'fade':
        return fadeVariants;
      case 'slideUp':
        return slideUpVariants;
      case 'scale':
        return scaleVariants;
      case 'slideRight':
        return {
          hidden: { opacity: 0, x: -30 },
          visible: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -15 }
        };
      case 'slideLeft':
        return {
          hidden: { opacity: 0, x: 30 },
          visible: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 15 }
        };
      default:
        return fadeVariants;
    }
  };

  const variant = getBaseVariant();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={variant}
      transition={{ 
        duration, 
        delay,
        ease: "easeOut" 
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimation; 