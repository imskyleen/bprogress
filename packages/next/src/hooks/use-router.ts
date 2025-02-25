import { useCallback, useMemo } from 'react';
import { BProgress, isSameURL } from '@bprogress/core';
import { useRouter as useNextRouter } from 'next/navigation';
import type { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type {
  RouterActionsProgressOptions,
  RouterProgressOptions,
} from '../types';

/**
 * Custom hook that extends the Next.js router with progress bar functionality.
 *
 * @param options - Router progress options including default settings and a custom router function.
 * @returns An enhanced router with additional methods (push, replace, back, refresh) that trigger the progress bar.
 */
export function useRouter(options?: RouterProgressOptions) {
  const { customRouter, ...defaultProgressOptions } = options || {};

  // Select the router: use the custom router if provided, otherwise use Next.js router.
  const useSelectedRouter = useCallback(() => {
    if (customRouter) return customRouter();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useNextRouter();
  }, [customRouter]);

  const router = useSelectedRouter();

  const startProgress = useCallback((startPosition?: number) => {
    if (startPosition && startPosition > 0) BProgress.set(startPosition);
    BProgress.start();
  }, []);

  const stopProgress = useCallback(() => {
    if (!BProgress.isStarted()) return;
    BProgress.done();
  }, []);

  const progress = useCallback(
    (
      href: string,
      method: 'push' | 'replace',
      optionsNav?: NavigateOptions,
      progressOptions?: RouterActionsProgressOptions,
    ) => {
      // Merge default progress options with the ones provided at the call.
      const mergedOptions = { ...defaultProgressOptions, ...progressOptions };

      // If progress is disabled, navigate directly.
      if (mergedOptions.showProgress === false) {
        return router[method](href, optionsNav);
      }

      const currentUrl = new URL(location.href);
      const targetUrl = new URL(href, location.href);

      // If a basePath is provided, prepend it to the target pathname.
      if (mergedOptions.basePath) {
        targetUrl.pathname =
          mergedOptions.basePath +
          (targetUrl.pathname !== '/' ? targetUrl.pathname : '');
      }

      const sameURL = isSameURL(targetUrl, currentUrl);

      // If the URL is the same and disableSameURL is enabled, navigate directly.
      if (sameURL && mergedOptions.disableSameURL !== false) {
        return router[method](href, optionsNav);
      }

      startProgress(mergedOptions.startPosition);

      // If navigating to the same URL, stop the progress bar immediately.
      if (sameURL) stopProgress();

      return router[method](href, optionsNav);
    },
    [router, defaultProgressOptions, startProgress, stopProgress],
  );

  const push = useCallback(
    (
      href: string,
      optionsNav?: NavigateOptions,
      progressOptions?: RouterActionsProgressOptions,
    ) => {
      progress(href, 'push', optionsNav, progressOptions);
    },
    [progress],
  );

  const replace = useCallback(
    (
      href: string,
      optionsNav?: NavigateOptions,
      progressOptions?: RouterActionsProgressOptions,
    ) => {
      progress(href, 'replace', optionsNav, progressOptions);
    },
    [progress],
  );

  const back = useCallback(
    (progressOptions?: RouterActionsProgressOptions) => {
      const mergedOptions = { ...defaultProgressOptions, ...progressOptions };
      if (mergedOptions.showProgress === false) return router.back();
      startProgress(mergedOptions.startPosition);
      return router.back();
    },
    [router, defaultProgressOptions, startProgress],
  );

  const refresh = useCallback(
    (progressOptions?: RouterActionsProgressOptions) => {
      const mergedOptions = { ...defaultProgressOptions, ...progressOptions };
      if (mergedOptions.showProgress === false) return router.refresh();
      startProgress(mergedOptions.startPosition);
      stopProgress();
      return router.refresh();
    },
    [router, defaultProgressOptions, startProgress, stopProgress],
  );

  // Merge the original router with the enhanced methods.
  const enhancedRouter = useMemo(() => {
    return { ...router, push, replace, back, refresh };
  }, [router, push, replace, back, refresh]);

  return enhancedRouter;
}
