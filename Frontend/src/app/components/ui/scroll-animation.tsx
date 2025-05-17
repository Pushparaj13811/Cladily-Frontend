import React from 'react';
import { motion, Variants } from 'framer-motion';

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  animationType?: 'fade' | 'slideUp' | 'slideRight' | 'slideLeft' | 'scale';
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
  // Animation variants
  const animations: Record<string, Variants> = {
    fade: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { 
          duration,
          delay 
        }
      }
    },
    slideUp: {
      hidden: { opacity: 0, y: 30 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
          duration,
          delay,
          ease: "easeOut" 
        }
      }
    },
    slideRight: {
      hidden: { opacity: 0, x: -30 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { 
          duration,
          delay,
          ease: "easeOut" 
        }
      }
    },
    slideLeft: {
      hidden: { opacity: 0, x: 30 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { 
          duration,
          delay,
          ease: "easeOut" 
        }
      }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: { 
          duration,
          delay,
          ease: "easeOut" 
        }
      }
    }
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={animations[animationType]}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimation; 