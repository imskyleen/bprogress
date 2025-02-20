import type {
  AnchorProgressProps,
  AnchorProgressProviderProps,
  RouterProgressProps,
  RouterProgressProviderProps,
} from '@bprogress/react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export interface PagesProgressProps extends RouterProgressProps {}
export interface PagesProgressProviderProps
  extends RouterProgressProviderProps {}

export interface AppProgressProps extends AnchorProgressProps {}
export interface AppProgressProviderProps extends AnchorProgressProviderProps {}

/**
 * @param showProgress Show the progress bar. @default true
 * @param startPosition The position of the progress bar at the start of the page load - @default 0
 * @param disableSameURL Disable triggering progress bar on the same URL - @default true
 * @param basePath Base path for the progress bar - @default ''
 */
export interface RouterActionsProgressOptions {
  showProgress?: boolean;
  startPosition?: number;
  disableSameURL?: boolean;
  basePath?: string;
}

/**
 * @param customRouter Custom router - @default undefined
 */
export interface RouterProgressOptions extends RouterActionsProgressOptions {
  customRouter?: () => AppRouterInstance;
}
