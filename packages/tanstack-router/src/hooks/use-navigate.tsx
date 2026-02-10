import { useCallback } from 'react';
import { useNavigate as useTanStackNavigate } from '@tanstack/react-router';
import { isSameURL } from '@bprogress/core';
import { useProgress } from '@bprogress/react';
import type {
  ProgressNavigateFunction,
  NavigateProgressOptions,
} from '../types';

/**
 * Custom hook that extends TanStack Router's useNavigate with progress bar functionality.
 *
 * @param options - Default progress options (e.g., showProgress, startPosition, disableSameURL)
 * @returns An enhanced navigate function with an extra parameter for progress options.
 */
export function useNavigate(
  options?: NavigateProgressOptions,
): ProgressNavigateFunction {
  // Destructure customNavigate (if provided) and default progress options.
  const { customNavigate, ...defaultProgressOptions } = options || {};
  const {
    start,
    stop,
    disableSameURL: providerDisableSameURL,
    startPosition: providerStartPosition,
    delay: providerDelay,
    stopDelay: providerStopDelay,
  } = useProgress();

  // Use a custom navigate function if provided, otherwise use TanStack Router's built-in useNavigate.
  const useSelectedNavigate = useCallback(() => {
    if (customNavigate) return customNavigate();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTanStackNavigate();
  }, [customNavigate]);

  // Retrieve the navigate function.
  const navigate = useSelectedNavigate();

  // Create the enhanced navigate function that supports progress options.
  const enhancedNavigate = useCallback(
    (to, progressOptions) => {
      // Merge default progress options with the ones provided during the call.
      const mergedOptions = { ...defaultProgressOptions, ...progressOptions };

      const localDisableSameURL =
        mergedOptions.disableSameURL !== undefined
          ? mergedOptions.disableSameURL
          : providerDisableSameURL;
      const localStartPosition =
        mergedOptions.startPosition !== undefined
          ? mergedOptions.startPosition
          : providerStartPosition;
      const localDelay =
        mergedOptions.delay !== undefined ? mergedOptions.delay : providerDelay;
      const localStopDelay =
        mergedOptions.stopDelay !== undefined
          ? mergedOptions.stopDelay
          : providerStopDelay;

      // Build the target URL based on the provided value.
      let targetUrl: URL;
      try {
        const targetPath = typeof to === 'string' ? to : to.to || '';
        targetUrl = new URL(targetPath, window.location.href);
      } catch (error) {
        console.error(error);
        // If URL creation fails, fall back to normal navigation.
        return navigate(to);
      }

      const currentUrl = new URL(window.location.href);
      const sameURL = isSameURL(targetUrl, currentUrl);

      // If target URL is the same and disableSameURL is enabled, navigate without progress.
      if (sameURL && localDisableSameURL) {
        return navigate(to);
      }

      // Start the progress bar if enabled.
      if (mergedOptions?.showProgress !== false) {
        start(localStartPosition, localDelay);
      }

      // Execute the navigation using TanStack Router's navigate function.
      const result = navigate(to);

      // If navigating to the same URL, finish the progress bar immediately.
      if (sameURL && mergedOptions?.showProgress !== false) {
        setTimeout(() => {
          stop(localStopDelay);
        }, localDelay || 0);
      }

      return result;
    },
    [
      defaultProgressOptions,
      providerDisableSameURL,
      providerStartPosition,
      providerDelay,
      providerStopDelay,
      navigate,
      start,
      stop,
    ],
  ) as ProgressNavigateFunction;

  return enhancedNavigate;
}
