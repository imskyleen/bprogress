import { useEffect } from 'react';
import type { ListenerFn, RouterEvents } from '@tanstack/react-router';
import { useRouter } from '@tanstack/react-router';
import { type RouterProgressProps, useProgress, withMemo } from '@bprogress/react';

const TanStackRouterProgressComponent = ({
  delay = 0,
  disableSameURL = true,
  startPosition = 0,
  stopDelay = 0,
}: RouterProgressProps) => {
  const { start, stop } = useProgress();
  const router = useRouter();

  useEffect(() => {
    const handleRouteStart: ListenerFn<RouterEvents['onBeforeLoad']> = (event) => {
      // If the URL is the same, we don't want to start the progress bar
      if (!event.hrefChanged && disableSameURL) {
        return;
      }

      start(startPosition, delay);
    };

    const handleRouteDone = () => stop(stopDelay);

    const unsubscribeStart = router.subscribe('onBeforeLoad', handleRouteStart);
    const unsubscribeStop = router.subscribe('onResolved', handleRouteDone);

    return () => {
      unsubscribeStart();
      unsubscribeStop();
    };
  }, [router, start, stop, disableSameURL, startPosition, delay, stopDelay]);

  return null;
};

export const TanStackRouterProgress = withMemo(TanStackRouterProgressComponent);

TanStackRouterProgress.displayName = 'TanStackRouterProgress';
