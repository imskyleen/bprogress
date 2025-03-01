import React from 'react';
import type { ProgressComponentProps } from '../types';
import { classNames } from '../utils/classnames';

export type PegProps<T extends React.ElementType = 'div'> = Omit<
  ProgressComponentProps<T>,
  'classSelector'
> & {
  classSelector?: string;
};

function PegInner<T extends React.ElementType = 'div'>(
  { as, children, className, classSelector = 'peg', ...rest }: PegProps<T>,
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

export const Peg = React.forwardRef(PegInner) as <
  T extends React.ElementType = 'div',
>(
  props: PegProps<T> & { ref?: React.ForwardedRef<React.ComponentRef<T>> },
) => ReturnType<typeof PegInner>;
