import type {
  AnchorProgressProps,
  AnchorProgressProviderProps,
} from '@bprogress/react';
import type { NavigateFunction, Path } from '@remix-run/react';

export interface RemixProgressProps extends AnchorProgressProps {}
export interface RemixProgressProviderProps
  extends AnchorProgressProviderProps {}

/**
 * @param showProgress Show the progress bar. @default true
 * @param startPosition The position of the progress bar at the start of the page load - @default 0
 * @param disableSameURL Disable triggering progress bar on the same URL - @default true
 */
export interface NavigateActionsProgressOptions {
  showProgress?: boolean;
  startPosition?: number;
  disableSameURL?: boolean;
}

/**
 * @param customNavigate Custom navigate - @default undefined
 */
export interface NavigateProgressOptions
  extends NavigateActionsProgressOptions {
  customNavigate?: () => NavigateFunction;
}

// We need to copy the NavigateOptions type from Remix's source code
// because it's not exported in the package's public API.
type NavigateOptions = {
  replace?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state?: any;
  preventScrollReset?: boolean;
  relative?: 'route' | 'path';
  flushSync?: boolean;
  viewTransition?: boolean;
};

type To = string | Partial<Path>;

// Enhanced NavigateFunction that supports progress options.
export interface ProgressNavigateFunction {
  (
    to: To,
    options?: NavigateOptions,
    progressOptions?: NavigateActionsProgressOptions,
  ): void;
  (delta: number, progressOptions?: NavigateActionsProgressOptions): void;
}
