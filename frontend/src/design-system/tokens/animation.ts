/**
 * Design System animation tokens.
 */

export const animation = {
  duration: {
    fast: '150ms',
    medium: '250ms',
    slow: '400ms',
  },
  easing: {
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  transition: {
    fast: 'transition-all duration-150 ease-in-out',
    medium: 'transition-all duration-[250ms] ease-in-out',
    slow: 'transition-all duration-[400ms] ease-in-out',
    colors: 'transition-colors duration-150 ease-in-out',
    shadow: 'transition-shadow duration-[250ms] ease-in-out',
    transform: 'transition-transform duration-[250ms] ease-in-out',
  },
} as const;
