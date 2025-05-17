import React from 'react';
import { CheckoutStep } from '@shared/types';
import { CheckCircle } from 'lucide-react';
import { cn } from '@app/lib/utils';

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
        <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-muted" />
        
        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          
          return (
            <div key={step.id} className="relative flex flex-col items-center">
              {/* Step circle */}
              <div 
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background z-10",
                  isCompleted ? "border-primary" : "border-muted",
                  isActive ? "border-primary" : "",
                )}
              >
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5 text-primary" />
                ) : (
                  <span className={cn(
                    "text-sm font-medium",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>
                    {index + 1}
                  </span>
                )}
              </div>
              
              {/* Step label */}
              <span 
                className={cn(
                  "mt-2 text-sm font-medium", 
                  isActive ? "text-primary" : "",
                  isCompleted ? "text-primary" : "",
                  !isActive && !isCompleted ? "text-muted-foreground" : ""
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutSteps; 