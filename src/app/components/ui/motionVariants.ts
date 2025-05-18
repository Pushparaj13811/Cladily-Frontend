import { Variants } from 'framer-motion';

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

export {
    fadeVariants,
    slideUpVariants,
    scaleVariants,
    staggerContainerVariants
}