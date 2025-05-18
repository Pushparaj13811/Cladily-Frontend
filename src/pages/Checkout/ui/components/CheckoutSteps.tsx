import React from 'react';
import { CheckoutStep } from '@shared/types';
import { CheckCircle } from 'lucide-react';
import { cn } from '@app/lib/utils';
import { motion } from 'framer-motion';

interface CheckoutStepsProps {
  currentStep: CheckoutStep;
}

const steps = [
  { id: CheckoutStep.Shipping, label: 'Shipping' },
  { id: CheckoutStep.Payment, label: 'Payment' },
  { id: CheckoutStep.Review, label: 'Review' },
];

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ currentStep }) => {
  // Find the index of the current step
  const currentIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="mb-8">
      <div className="relative flex justify-between">
        {/* Line connecting steps */}
        <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-muted">
          <motion.div 
            className="h-full bg-primary origin-left"
            initial={{ scaleX: 0 }}
            animate={{ 
              scaleX: currentIndex / (steps.length - 1) 
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
        
        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          
          return (
            <motion.div 
              key={step.id} 
              className="relative flex flex-col items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1 
              }}
            >
              {/* Step circle */}
              <motion.div 
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background z-10",
                  isCompleted ? "border-primary" : "border-muted",
                  isActive ? "border-primary" : "",
                )}
                whileHover={{ scale: 1.05 }}
                animate={isActive ? { 
                  scale: [1, 1.1, 1],
                  transition: { 
                    duration: 0.5,
                    repeat: 0,
                    repeatType: "mirror" as const
                  }
                } : {}}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </motion.div>
                ) : (
                  <span className={cn(
                    "text-sm font-medium",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>
                    {index + 1}
                  </span>
                )}
              </motion.div>
              
              {/* Step label */}
              <motion.span 
                className={cn(
                  "mt-2 text-sm font-medium", 
                  isActive ? "text-primary" : "",
                  isCompleted ? "text-primary" : "",
                  !isActive && !isCompleted ? "text-muted-foreground" : ""
                )}
                animate={isActive ? {
                  scale: [1, 1.05, 1],
                  transition: {
                    duration: 0.5,
                    delay: 0.2,
                    repeat: 0
                  }
                } : {}}
              >
                {step.label}
              </motion.span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutSteps; 