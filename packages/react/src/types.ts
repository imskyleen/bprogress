import type { BProgressOptions, SpinnerPosition } from '@bprogress/core';

/**
 * @param start Start the progress bar
 * @param done Stop the progress bar
 * @param inc Increase the progress Bar
 * @param dec Decrease the progress bar
 * @param set Set the progress bar to a specific value
 * @param pause Pause the progress bar
 * @param resume Resume the progress bar
 * @param setOptions Set the BProgress options
 * @param getOptions Get the BProgress options
 */
export interface ProgressContextValue {
  start: (startPosition?: number, delay?: number) => void;
  stop: (stopDelay?: number, forcedStopDelay?: number) => void;
  inc: (amount?: number) => void;
  dec: (amount?: number) => void;
  set: (n: number) => void;
  pause: () => void;
  resume: () => void;
  setOptions: (
    options:
      | Partial<BProgressOptions>
      | ((prevOptions: BProgressOptions) => Partial<BProgressOptions>),
  ) => void;
  getOptions: () => BProgressOptions;
}

/**
 * @param as Custom component - @default div
 * @param children Children - @default undefined
 * @param className Custom class - @default undefined
 * @param classSelector Custom class selector - @default undefined
 */
export type ProgressComponentProps<T extends React.ElementType = 'div'> = {
  as?: T;
  children?: React.ReactNode;
  classSelector?: string;
} & React.ComponentPropsWithoutRef<T>;

/**
 * @param children Children - @default undefined
 * @param color Color of the progress bar. @default #0A2FFF
 * @param height Height of the progress bar. @default 2px
 * @param options BProgress options. @default undefined
 * @param spinnerPosition Position of the spinner. @default top-right
 * @param style Custom css - @default undefined
 * @param disableStyle Disable default css - @default false
 * @param nonce Custom nonce for Content-Security-Policy directives - @default undefined
 */
export interface ProgressProviderProps {
  children?: React.ReactNode;
  color?: string;
  height?: string;
  options?: Partial<BProgressOptions>;
  spinnerPosition?: SpinnerPosition;
  style?: string;
  disableStyle?: boolean;
  nonce?: string;
}

/**
 * @param shallowRouting If the progress bar is not displayed when you use shallow routing - @default false
 * @param startPosition The position of the progress bar at the start of the page load - @default 0
 * @param delay When the page loads faster than the progress bar, it does not display - @default 0
 * @param stopDelay Delay to stop the progress bar - @default 0
 * @param shouldCompareComplexProps If you want to compare props in the React.memo return - @default false
 * @param disableSameURL Disable triggering progress bar on the same URL - @default true
 */
export interface RouterProgressProps {
  shallowRouting?: boolean;
  disableSameURL?: boolean;
  startPosition?: number;
  delay?: number;
  stopDelay?: number;
  memo?: boolean;
  shouldCompareComplexProps?: boolean;
}

/**
 * @param targetPreprocessor If you want to process the target URL - @default undefined
 * @param disableAnchorClick Disable triggering progress bar on anchor clicks - @default false
 * @param startOnLoad Start the progress bar on page load - @default false
 */
export interface AnchorProgressProps extends RouterProgressProps {
  targetPreprocessor?: (url: URL) => URL;
  disableAnchorClick?: boolean;
  startOnLoad?: boolean;
}

export interface RouterProgressProviderProps
  extends RouterProgressProps,
    ProgressProviderProps {}

export interface AnchorProgressProviderProps
  extends AnchorProgressProps,
    ProgressProviderProps {}

/**
 * @params forcedStopDelay - Delay to stop the progress bar that does not take the timer into account
 */
export type UseAnchorProgressOptions = Omit<
  AnchorProgressProps,
  'memo' | 'shouldCompareComplexProps'
> & {
  forcedStopDelay?: number;
};
