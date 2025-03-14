import { useAnchorProgress } from '@bprogress/react';

export const ProgressRouter = () => {
  useAnchorProgress(
    {
      forcedStopDelay: 500,
    },
    [],
  );

  return null;
};
