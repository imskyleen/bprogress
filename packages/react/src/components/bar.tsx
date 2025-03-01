import React from 'react';
import type { ProgressComponentProps } from '../types';
import { classNames } from '../utils/classnames';

export type BarProps<T extends React.ElementType = 'div'> =
  ProgressComponentProps<T>;

function BarInner<T extends React.ElementType = 'div'>(
  { as, children, className, classSelector = 'bar', ...rest }: BarProps<T>,
  ref: React.ForwardedRef<React.ComponentRef<T>>,
) {
  const Component = as ?? ('div' as T);
  return React.createElement(
    Component,
    {
      ref,
      className: classNames(classSelector, className),
      ...(rest as React.ComponentPropsWithoutRef<T>),
    },
    children,
  );
}

export const Bar = React.forwardRef(BarInner) as <
  T extends React.ElementType = 'div',
>(
  props: BarProps<T> & { ref?: React.ForwardedRef<React.ComponentRef<T>> },
) => ReturnType<typeof BarInner>;
