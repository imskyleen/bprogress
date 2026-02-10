import type {
  RouterProgressProps,
  RouterProgressProviderProps,
} from '@bprogress/react';
import type { NavigateOptions } from '@tanstack/react-router';

export interface TanStackRouterProgressProps extends RouterProgressProps {}
export interface TanStackRouterProgressProviderProps
  extends RouterProgressProviderProps {}

/**
 * @param showProgress Show the progress bar. @default true
 * @param startPosition The position of the progress bar at the start of the page load - @default 0
 * @param disableSameURL Disable triggering progress bar on the same URL - @default true
 */
export interface NavigateActionsProgressOptions {
  showProgress?: boolean;
  startPosition?: number;
  disableSameURL?: boolean;
  delay?: number;
  stopDelay?: number;
}

/**
 * @param customNavigate Custom navigate - @default undefined
 */
export interface NavigateProgressOptions
  extends NavigateActionsProgressOptions {
  customNavigate?: () => (options: NavigateOptions) => Promise<void>;
}

/**
 * Enhanced navigate function that supports progress options.
 * Note: TanStack Router's navigate function uses NavigateOptions as a single parameter.
 */
export interface ProgressNavigateFunction {
  (options: NavigateOptions, progressOptions?: NavigateActionsProgressOptions): Promise<void>;
}
