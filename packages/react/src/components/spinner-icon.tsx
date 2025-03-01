import React from 'react';
import type { ProgressComponentProps } from '../types';
import { classNames } from '../utils/classnames';

export type SpinnerIconProps<T extends React.ElementType = 'div'> = Omit<
  ProgressComponentProps<T>,
  'classSelector'
> & {
  classSelector?: string;
};

function SpinnerIconInner<T extends React.ElementType = 'div'>(
  {
    as,
    children,
    className,
    classSelector = 'spinner-icon',
    ...rest
  }: SpinnerIconProps<T>,
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

export const SpinnerIcon = React.forwardRef(SpinnerIconInner) as <
  T extends React.ElementType = 'div',
>(
  props: SpinnerIconProps<T> & {
    ref?: React.ForwardedRef<React.ComponentRef<T>>;
  },
) => ReturnType<typeof SpinnerIconInner>;
