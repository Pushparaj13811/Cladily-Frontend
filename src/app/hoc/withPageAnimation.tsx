import React from 'react';
import AnimatedPage from '@app/components/ui/animated-page';

/**
 * withPageAnimation - A Higher Order Component (HOC) that wraps a page component with animated transitions
 * 
 * @param Component - The page component to be wrapped
 * @param animationType - The type of animation to apply (fade, slide, or scale)
 * @returns A new component with animation capabilities
 */
const withPageAnimation = <P extends object>(
  Component: React.ComponentType<P>,
  animationType: 'fade' | 'slide' | 'scale' = 'fade'
) => {
  const WithPageAnimation: React.FC<P> = (props) => {
    return (
      <AnimatedPage animationType={animationType}>
        <Component {...props} />
      </AnimatedPage>
    );
  };

  // Set displayName for better debugging
  const displayName = Component.displayName || Component.name || 'Component';
  WithPageAnimation.displayName = `withPageAnimation(${displayName})`;

  return WithPageAnimation;
};

export default withPageAnimation; 