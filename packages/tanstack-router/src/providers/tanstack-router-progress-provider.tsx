import React from 'react';
import { ProgressProvider } from '@bprogress/react';
import { TanStackRouterProgress } from '../components/tanstack-router-progress';
import type { TanStackRouterProgressProviderProps } from '../types';

export const TanStackRouterProgressProvider = ({
  children,
  color,
  height,
  options,
  spinnerPosition,
  style,
  disableStyle,
  nonce,
  ...props
}: TanStackRouterProgressProviderProps) => {
  return (
    <ProgressProvider
      color={color}
      height={height}
      options={options}
      spinnerPosition={spinnerPosition}
      style={style}
      disableStyle={disableStyle}
      nonce={nonce}
    >
      <TanStackRouterProgress {...props} />
      {children}
    </ProgressProvider>
  );
};
