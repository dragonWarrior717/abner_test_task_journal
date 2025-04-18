'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnimationContext = React.createContext({
  pageTransitions: true,
  microAnimations: true,
  togglePageTransitions: () => {},
  toggleMicroAnimations: () => {},
});

export function AnimationProvider({ children }) {
  const [pageTransitions, setPageTransitions] = React.useState(true);
  const [microAnimations, setMicroAnimations] = React.useState(true);

  const value = {
    pageTransitions,
    microAnimations,
    togglePageTransitions: () => setPageTransitions(prev => !prev),
    toggleMicroAnimations: () => setMicroAnimations(prev => !prev),
  };

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation() {
  return React.useContext(AnimationContext);
}

export function withPageTransition(Component) {
  return function WithPageTransition(props) {
    const { pageTransitions } = useAnimation();

    if (!pageTransitions) {
      return <Component {...props} />;
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Component {...props} />
      </motion.div>
    );
  };
} 