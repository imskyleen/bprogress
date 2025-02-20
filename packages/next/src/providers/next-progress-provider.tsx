import React from 'react';
import {
  AnchorProgressProps,
  ProgressProvider,
  ProgressProviderProps,
  RouterProgressProps,
} from '@bprogress/react';

export interface NextProgressProviderComponentProps
  extends ProgressProviderProps {
  ProgressComponent: React.ComponentType<
    RouterProgressProps | AnchorProgressProps
  >;
}

export const NextProgressProvider = ({
  children,
  ProgressComponent,
  color,
  height,
  options,
  spinnerPosition,
  style,
  disableStyle,
  nonce,
  ...props
}: NextProgressProviderComponentProps) => {
  return (
    <ProgressProvider
      color={color}
      height={height}
      options={options}
      spinnerPosition={spinnerPosition}
      style={style}
      disableStyle={disableStyle}
      nonce={nonce}
    >
      <ProgressComponent {...props} />
      {children}
    </ProgressProvider>
  );
};
