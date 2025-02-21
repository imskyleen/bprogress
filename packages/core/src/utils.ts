import type { BProgressDirection } from './types';

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(n, max));
}

export function toBarPerc(n: number, direction: BProgressDirection): number {
  if (direction === 'rtl') return (1 - n) * 100;
  return (-1 + n) * 100;
}

export function css(
  element: HTMLElement,
  properties: { [key: string]: string | undefined } | string,
  value?: string,
): void {
  if (typeof properties === 'string') {
    if (value !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      element.style[properties as any] = value;
    }
  } else {
    for (const prop in properties) {
      if (properties.hasOwnProperty(prop)) {
        const val = properties[prop];
        if (val !== undefined) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          element.style[prop as any] = val;
        }
      }
    }
  }
}

export function addClass(element: HTMLElement, name: string): void {
  element.classList.add(name);
}

export function removeClass(element: HTMLElement, name: string): void {
  element.classList.remove(name);
}

export function removeElement(element: HTMLElement): void {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
}
