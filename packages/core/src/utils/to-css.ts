export function toCss(
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
