import { ClassValue } from '../types';

export function classNames(
  ...classes: (ClassValue | undefined | null | false)[]
): string {
  const result: string[] = [];

  const process = (input: ClassValue | undefined | null | false): void => {
    if (!input) return;
    if (typeof input === 'string') {
      if (input.trim()) result.push(input);
    } else if (Array.isArray(input)) {
      input.forEach((item) => process(item));
    } else if (typeof input === 'object') {
      for (const key in input) {
        if (Object.prototype.hasOwnProperty.call(input, key) && input[key]) {
          result.push(key);
        }
      }
    }
  };

  classes.forEach((item) => process(item));
  return result.join(' ');
}
