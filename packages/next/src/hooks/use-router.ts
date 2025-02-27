/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  AppRouterInstance,
  AppRouterProgressInstance,
  InferPrefetchOptions,
  InferRouterOptions,
  RouterProgressOptions,
} from '../types';
import { useRouter as useNextRouter } from 'next/navigation.js';
import { useRef } from 'react';
import { BProgress, isSameURL } from '@bprogress/core';
import { AppRouterInstance as NextAppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * Helper function that removes the first path segment from a URL.
 * This is used to ignore the locale prefix in i18n configurations.
 */
function removeFirstPathSegment(url: URL): URL {
  const parts = url.pathname.split('/');
  if (parts.length > 1 && parts[1]) {
    parts.splice(1, 1);
    url.pathname = parts.join('/') || '/';
  }
  return url;
}

/**
 * Custom hook that extends the router (Next.js or custom) with progress bar functionality.
 *
 * With this signature, if a custom router is provided, its push method's options are automatically inferred.
 *
 * @param options Progress bar options and/or custom router.
 * @returns An extended router with push, replace, prefetch, back, refresh, and forward methods that manage the progress bar.
 */
export function useRouter<
  Custom extends AppRouterInstance = NextAppRouterInstance,
  ROpts = InferRouterOptions<Custom>,
  POpts = InferPrefetchOptions<Custom>,
>(
  options?: RouterProgressOptions & { customRouter?: () => Custom },
): AppRouterProgressInstance<ROpts, POpts> {
  const { customRouter, ...defaultProgressOptions } = options || {};
  const router: AppRouterInstance = customRouter
    ? customRouter()
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useNextRouter();

  // Using a ref to keep a stable reference of the extended router.
  const extendedRouterRef = useRef<AppRouterProgressInstance<
    ROpts,
    POpts
  > | null>(null);

  /**
   * Generic function to create a handler for methods that require an href (push, replace).
   * It extracts the progress options and passes the rest as router-specific options.
   */
  function createHandler<Fn extends (href: string, opts?: any) => void>(
    fn: Fn,
  ) {
    return (href: string, options?: any): void => {
      const {
        showProgress,
        startPosition,
        disableSameURL,
        basePath,
        i18nPath,
        ...routerOpts
      } = options || {};
      const progressOpts = {
        ...defaultProgressOptions,
        showProgress,
        startPosition,
        disableSameURL,
        basePath,
        i18nPath,
      };

      if (progressOpts.showProgress === false) {
        return fn(href, routerOpts);
      }

      let currentUrl = new URL(location.href);
      const targetUrl = new URL(href, location.href);

      if (progressOpts.i18nPath) {
        currentUrl = removeFirstPathSegment(currentUrl);
      }

      if (progressOpts.basePath) {
        targetUrl.pathname =
          progressOpts.basePath +
          (targetUrl.pathname !== '/' ? targetUrl.pathname : '');
      }

      const sameURL = isSameURL(targetUrl, currentUrl);

      if (sameURL && progressOpts.disableSameURL !== false) {
        return fn(href, routerOpts);
      }

      if (progressOpts.startPosition && progressOpts.startPosition > 0) {
        BProgress.set(progressOpts.startPosition);
      }

      BProgress.start();

      if (sameURL) BProgress.done();

      return fn(href, routerOpts);
    };
  }

  /**
   * Handler for methods that do not require an href (back, refresh, forward).
   */
  function createNoHrefHandler<Fn extends (opts?: any) => void>(fn: Fn) {
    return (options?: any): void => {
      const {
        showProgress,
        startPosition,
        disableSameURL,
        basePath,
        i18nPath,
        ...routerOpts
      } = options || {};
      const progressOpts = {
        ...defaultProgressOptions,
        showProgress,
        startPosition,
        disableSameURL,
        basePath,
        i18nPath,
      };

      if (progressOpts.showProgress === false) {
        return fn(routerOpts);
      }

      if (progressOpts.startPosition && progressOpts.startPosition > 0) {
        BProgress.set(progressOpts.startPosition);
      }

      BProgress.start();

      const result = fn(routerOpts);

      BProgress.done();

      return result;
    };
  }

  /**
   * Handler for the prefetch method.
   */
  function createPrefetchHandler<Fn extends (href: string, opts?: any) => void>(
    fn: Fn,
  ) {
    return (href: string, options?: POpts): void => {
      return fn(href, options);
    };
  }

  if (!extendedRouterRef.current) {
    extendedRouterRef.current = {
      ...router,
      push: createHandler(router.push),
      replace: createHandler(router.replace),
      prefetch: createPrefetchHandler(router.prefetch),
      back: createNoHrefHandler(router.back),
      refresh: createNoHrefHandler(router.refresh),
      forward: createNoHrefHandler(router.forward),
    } as AppRouterProgressInstance<ROpts, POpts>;
  } else {
    extendedRouterRef.current.push = createHandler(router.push);
    extendedRouterRef.current.replace = createHandler(router.replace);
    extendedRouterRef.current.prefetch = createPrefetchHandler(router.prefetch);
    extendedRouterRef.current.back = createNoHrefHandler(router.back);
    extendedRouterRef.current.refresh = createNoHrefHandler(router.refresh);
    extendedRouterRef.current.forward = createNoHrefHandler(router.forward);
  }

  return extendedRouterRef.current;
}
