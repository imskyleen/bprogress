import type {
  AnchorProgressProps,
  AnchorProgressProviderProps,
  RouterProgressProps,
  RouterProgressProviderProps,
} from '@bprogress/react';
import type {
  NavigateOptions,
  PrefetchOptions,
} from 'next/dist/shared/lib/app-router-context.shared-runtime';

export interface PagesProgressProps extends RouterProgressProps {}
export interface PagesProgressProviderProps
  extends RouterProgressProviderProps {}

export interface AppProgressProps extends AnchorProgressProps {}
export interface AppProgressProviderProps extends AnchorProgressProviderProps {}

/**
 * Helper type to infer router-specific options from the push method signature.
 */
export type InferRouterOptions<T extends AppRouterInstance> = T extends {
  push(href: string, options?: infer O): void;
}
  ? O
  : NavigateOptions;

/**
 * Helper type to infer prefetch-specific options from the push method signature.
 */
export type InferPrefetchOptions<T extends AppRouterInstance> = T extends {
  prefetch(href: string, options?: infer O): void;
}
  ? O
  : PrefetchOptions;

/**
 * Options for the progress bar.
 *
 * @param showProgress Show the progress bar. Default is true.
 * @param startPosition Starting position of the progress bar during page load. Default is 0.
 * @param disableSameURL Disable triggering progress bar when navigating to the same URL. Default is true.
 * @param basePath Base path for the progress bar. Default is ''.
 */
export interface RouterActionsProgressOptions {
  showProgress?: boolean;
  startPosition?: number;
  disableSameURL?: boolean;
  basePath?: string;
  i18nPath?: boolean;
}

/**
 * Base router interface.
 * Here we assume that the imported AppRouterInstance is not generic.
 */
export interface AppRouterInstance {
  push(href: string, options?: unknown): void;
  replace(href: string, options?: unknown): void;
  prefetch(href: string, options?: unknown): void;
  back(options?: unknown): void;
  refresh(options?: unknown): void;
  forward(options?: unknown): void;
}

/**
 * Options for router progress.
 *
 * @param customRouter Custom router function. Default is undefined.
 */
export interface RouterProgressOptions extends RouterActionsProgressOptions {
  customRouter?: () => AppRouterInstance;
}

/**
 * Combined options type merging router-specific options with progress options.
 */
export type CombinedRouterOptions<ROpts> = ROpts & RouterActionsProgressOptions;

/**
 * Extended router interface to include progress bar functionality.
 * The push/replace methods now take two parameters: href and combined options.
 */
export interface AppRouterProgressInstance<
  ROpts = NavigateOptions,
  POtps = PrefetchOptions,
> {
  push(href: string, options?: CombinedRouterOptions<ROpts>): void;
  replace(href: string, options?: CombinedRouterOptions<ROpts>): void;
  prefetch(href: string, options?: POtps): void;
  back(options?: CombinedRouterOptions<ROpts>): void;
  refresh(options?: CombinedRouterOptions<ROpts>): void;
  forward(options?: CombinedRouterOptions<ROpts>): void;
}
