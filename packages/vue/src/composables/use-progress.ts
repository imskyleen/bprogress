import { inject } from 'vue';
import type { ProgressContextValue } from '../types';

const progressSymbol = Symbol('ProgressContext');

export function useProgress(): ProgressContextValue {
  const context = inject<ProgressContextValue>(progressSymbol);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}

export { progressSymbol };
