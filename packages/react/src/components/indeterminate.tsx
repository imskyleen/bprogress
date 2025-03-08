import React from 'react';
import type { ProgressComponentProps } from '../types';
import { classNames } from '../utils/classnames';

export type IndeterminateProps<T extends React.ElementType = 'div'> =
  ProgressComponentProps<T>;

function IndeterminateInner<T extends React.ElementType = 'div'>(
  {
    as,
    className,
    classSelector = 'indeterminate',
    ...rest
  }: IndeterminateProps<T>,
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
    React.createElement('div', { className: 'inc' }),
    React.createElement('div', { className: 'dec' }),
  );
}

export const Indeterminate = React.forwardRef(IndeterminateInner) as <
  T extends React.ElementType = 'div',
>(
  props: IndeterminateProps<T> & {
    ref?: React.ForwardedRef<React.ComponentRef<T>>;
  },
) => ReturnType<typeof IndeterminateInner>;
