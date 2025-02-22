import React, { memo } from 'react';

export function shallowCompareProps<T extends object>(
  prevProps: T,
  nextProps: T,
  ignoreKeys: string[] = [],
): boolean {
  const prevKeys = Object.keys(prevProps).filter(
    (key) => !ignoreKeys.includes(key),
  );
  const nextKeys = Object.keys(nextProps).filter(
    (key) => !ignoreKeys.includes(key),
  );

  if (prevKeys.length !== nextKeys.length) {
    return false;
  }

  for (const key of prevKeys) {
    if (prevProps[key as keyof T] !== nextProps[key as keyof T]) {
      return false;
    }
  }
  return true;
}

export function withMemo<
  P extends { memo?: boolean; shouldCompareComplexProps?: boolean },
>(
  Component: React.ComponentType<P>,
  ignoreKeys: string[] = ['memo', 'shouldCompareComplexProps'],
) {
  return memo(Component, (prevProps, nextProps) => {
    if (nextProps.memo === false) return false;
    if (!nextProps.shouldCompareComplexProps) return true;
    return shallowCompareProps(prevProps, nextProps, ignoreKeys);
  });
}
