'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

// FadeIn
export const FadeIn: React.FC<{ children: React.ReactNode; duration?: number; delay?: number }> = ({
  children,
  duration = 0.3,
  delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration, delay, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

// SlideUp
export const SlideUp: React.FC<{ children: React.ReactNode; y?: number; duration?: number; delay?: number }> = ({
  children,
  y = 15,
  duration = 0.4,
  delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration, delay, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

// HoverLift
export const HoverLift: React.FC<{ children: React.ReactNode; lift?: number }> = ({ children, lift = -6 }) => (
  <motion.div
    whileHover={{ y: lift }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
  >
    {children}
  </motion.div>
);

// PageTransition
export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.35, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);
