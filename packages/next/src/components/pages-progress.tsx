import { useEffect } from 'react';
import { isSameURL, isSameURLWithoutSearch } from '@bprogress/core';
import { RouterProgressProps, useProgress, withMemo } from '@bprogress/react';
import Router from 'next/router';

const PagesProgressComponent = ({
  shallowRouting = false,
  disableSameURL = true,
  startPosition = 0,
  delay = 0,
  stopDelay = 0,
}: RouterProgressProps) => {
  const { start, stop } = useProgress();

  useEffect(() => {
    const handleRouteStart = (url: string) => {
      const targetUrl = new URL(url, location.href);
      const currentUrl = new URL(location.href);

      if (
        shallowRouting &&
        isSameURLWithoutSearch(targetUrl, currentUrl) &&
        disableSameURL
      )
        return;

      // If the URL is the same, we don't want to start the progress bar
      if (isSameURL(targetUrl, currentUrl) && disableSameURL) return;

      start(startPosition, delay);
    };

    const handleRouteDone = () => stop(stopDelay);

    Router.events.on('routeChangeStart', handleRouteStart);
    Router.events.on('routeChangeComplete', handleRouteDone);
    Router.events.on('routeChangeError', handleRouteDone);

    return () => {
      // Make sure to remove the event handler on unmount!
      Router.events.off('routeChangeStart', handleRouteStart);
      Router.events.off('routeChangeComplete', handleRouteDone);
      Router.events.off('routeChangeError', handleRouteDone);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export const PagesProgress = withMemo(PagesProgressComponent);

PagesProgress.displayName = 'PagesProgress';
