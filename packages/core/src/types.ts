export type BProgressDirection = 'ltr' | 'rtl';
export type BProgressPositionUsing =
  | 'translate3d'
  | 'translate'
  | 'margin'
  | 'width'
  | '';

export interface BProgressOptions {
  minimum?: number;
  maximum?: number;
  template?: string | null;
  easing?: string;
  speed?: number;
  trickle?: boolean;
  trickleSpeed?: number;
  showSpinner?: boolean;
  parent?: HTMLElement | string;
  positionUsing?: BProgressPositionUsing;
  barSelector?: string;
  spinnerSelector?: string;
  direction?: BProgressDirection;
}

export type SpinnerPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';
