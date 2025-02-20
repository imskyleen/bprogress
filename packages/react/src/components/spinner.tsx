import React from 'react';
import type { ProgressComponentProps } from '../types';
import { classNames } from '../utils/classnames';

export type SpinnerProps<T extends React.ElementType = 'div'> =
  ProgressComponentProps<T>;

function SpinnerInner<T extends React.ElementType = 'div'>(
  {
    as,
    children,
    className,
    role = 'spinner',
    classSelector = 'spinner',
    ...rest
  }: SpinnerProps<T>,
  ref: React.ForwardedRef<React.ComponentRef<T>>,
) {
  const Component = as ?? ('div' as T);
  return React.createElement(
    Component,
    {
      ref,
      className: classNames(classSelector, className),
      role,
      ...(rest as React.ComponentPropsWithoutRef<T>),
    },
    children,
  );
}

export const Spinner = React.forwardRef(SpinnerInner) as <
  T extends React.ElementType = 'div',
>(
  props: SpinnerProps<T> & { ref?: React.ForwardedRef<React.ComponentRef<T>> },
) => ReturnType<typeof SpinnerInner>;
