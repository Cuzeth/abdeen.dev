'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInWrapperProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  /** Render immediately for above-the-fold content instead of waiting for an
   * IntersectionObserver to initialize after hydration. */
  eager?: boolean;
}

export default function FadeInWrapper({ children, delay = 0, direction = 'up', eager = false }: FadeInWrapperProps) {
  // Framer Motion drives these styles from JS, so the global CSS
  // prefers-reduced-motion rules never apply — gate here instead. The
  // element must stay a motion.div (server HTML carries the hidden styles;
  // a plain div would never clear them), so reduced motion becomes an
  // instant, zero-duration reveal on mount.
  const reduceMotion = useReducedMotion();
  // Keep the reveal crisp. The first redesign used a longer travel and a
  // 10px blur, which made above-the-fold content look briefly out of focus on
  // navigation. This smaller transition still gives the page rhythm without
  // delaying comprehension or interaction.
  const distance = 18;

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
          filter: 'blur(4px)',
        },
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          filter: 'blur(0px)',
          transition: {
            duration: 0.48,
            delay,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          },
        },
      };

  // `eager` is known at render time, so a plain wrapper keeps server and
  // client markup identical and guarantees that primary content is usable
  // before motion code hydrates.
  if (eager) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate={reduceMotion ? 'visible' : undefined}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.08 }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
