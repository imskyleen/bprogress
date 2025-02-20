import React from 'react';
import type { ProgressComponentProps } from '../types';
import { classNames } from '../utils/classnames';
import { Bar } from './bar';
import { Peg } from './peg';
import { Spinner } from './spinner';
import { SpinnerIcon } from './spinner-icon';

export type ProgressProps<T extends React.ElementType = 'div'> = Omit<
  ProgressComponentProps<T>,
  'role' | 'classSelector'
>;

function ProgressInner<T extends React.ElementType = 'div'>(
  { as, children, className, style, ...rest }: ProgressProps<T>,
  ref: React.ForwardedRef<React.ComponentRef<T>>,
) {
  const Component = as ?? ('div' as T);
  return React.createElement(
    Component,
    {
      ref,
      className: classNames('bprogress', className),
      style: { ...style, display: 'none' } as React.CSSProperties,
      ...(rest as React.ComponentPropsWithoutRef<T>),
    },
    children || (
      <>
        <Bar>
          <Peg />
        </Bar>
        <Spinner>
          <SpinnerIcon />
        </Spinner>
      </>
    ),
  );
}

export const Progress = React.forwardRef(ProgressInner) as <
  T extends React.ElementType = 'div',
>(
  props: ProgressProps<T> & { ref?: React.ForwardedRef<React.ComponentRef<T>> },
) => ReturnType<typeof ProgressInner>;
