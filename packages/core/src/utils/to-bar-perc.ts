import type { BProgressDirection } from '../types';

export function toBarPerc(n: number, direction: BProgressDirection): number {
  if (direction === 'rtl') return (1 - n) * 100;
  return (-1 + n) * 100;
}
