import { useLocation } from '@remix-run/react';
import { useAnchorProgress, withMemo } from '@bprogress/react';
import type { RemixProgressProps } from '../types';

const RemixProgressComponent = (props: RemixProgressProps) => {
  const routerLocation = useLocation();

  useAnchorProgress(
    {
      ...props,
      forcedStopDelay: 500,
    },
    [routerLocation],
  );

  return null;
};

export const RemixProgress = withMemo(RemixProgressComponent);

RemixProgress.displayName = 'RemixProgress';
