import React from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from './button';

interface AnimatedButtonProps extends ButtonProps {
  whileHoverScale?: number;
  whileTapScale?: number;
}

/**
 * AnimatedButton - An extension of the Button component with animations
 * Adds subtle scale effects when hovering and clicking
 */
const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  className,
  whileHoverScale = 1.03,
  whileTapScale = 0.97,
  ...props
}) => {
  return (
    <motion.div
      whileHover={{ scale: whileHoverScale }}
      whileTap={{ scale: whileTapScale }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <Button className={className} {...props}>
        {children}
      </Button>
    </motion.div>
  );
};

export default AnimatedButton; 