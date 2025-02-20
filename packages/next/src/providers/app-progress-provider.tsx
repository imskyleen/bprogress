import React from 'react';
import type { AppProgressProps, AppProgressProviderProps } from '../types';
import { AppProgress } from '../components/app-progress';
import { withSuspense } from '@bprogress/react';
import { NextProgressProvider } from './next-progress-provider';

const SuspendedAppProgress = withSuspense<AppProgressProps>(AppProgress);

export const AppProgressProvider = ({
  children,
  ...props
}: AppProgressProviderProps) => {
  return (
    <NextProgressProvider ProgressComponent={SuspendedAppProgress} {...props}>
      {children}
    </NextProgressProvider>
  );
};
