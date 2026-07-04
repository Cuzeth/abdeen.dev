'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInWrapperProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export default function FadeInWrapper({ children, delay = 0, direction = 'up' }: FadeInWrapperProps) {
  // Framer Motion drives these styles from JS, so the global CSS
  // prefers-reduced-motion rules never apply — gate here instead. The
  // element must stay a motion.div (server HTML carries the hidden styles;
  // a plain div would never clear them), so reduced motion becomes an
  // instant, zero-duration reveal on mount.
  const reduceMotion = useReducedMotion();
  const distance = 28;

  const variants = reduceMotion
    ? {
        hidden: { opacity: 0, y: 0, x: 0, filter: 'blur(0px)' },
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          filter: 'blur(0px)',
          transition: { duration: 0 },
        },
      }
    : {
        hidden: {
          opacity: 0,
          y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
          x: direction === 'left' ? distance : direction === 'right' ? -distance : 0,
          filter: 'blur(10px)',
        },
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          filter: 'blur(0px)',
          transition: {
            duration: 0.65,
            delay,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          },
        },
      };

  return (
    <motion.div
      initial="hidden"
      animate={reduceMotion ? 'visible' : undefined}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={{ once: true, amount: 'some' }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
