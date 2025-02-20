import React, { ComponentType, Suspense } from 'react';

export function withSuspense<P extends object>(Component: ComponentType<P>) {
  return function WithSuspenseComponent(props: P) {
    return (
      <Suspense>
        <Component {...props} />
      </Suspense>
    );
  };
}
