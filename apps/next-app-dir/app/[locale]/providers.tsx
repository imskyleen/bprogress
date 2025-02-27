'use client';

import {
  Bar,
  Progress,
  AppProgressProvider as ProgressProvider,
  Spinner,
  SpinnerIcon,
} from '@bprogress/next';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProgressProvider
      height="4px"
      color="hsl(var(--primary))"
      options={{
        showSpinner: true,
        template: null,
        positionUsing: 'width',
        direction: 'rtl',
      }}
      spinnerPosition="top-right"
      // stopDelay={1000}
      // delay={1000}
      disableSameURL
      startOnLoad
    >
      <main className="p-6 mt-32">{children}</main>

      <div className="fixed top-4 overflow-hidden inset-x-4 rounded-lg bg-neutral-100 h-10">
        <Progress>
          <Bar className="!absolute z-[9999] !bottom-0 !top-auto"></Bar>
          <Spinner className="!top-16">
            <SpinnerIcon />
          </Spinner>
        </Progress>
      </div>
      <div className="fixed top-20 overflow-hidden inset-x-4 rounded-lg bg-neutral-100 h-10">
        <Progress>
          <Bar className="!absolute z-[9999] !bottom-0 !top-auto"></Bar>
          <Spinner className="!top-16">
            <SpinnerIcon />
          </Spinner>
        </Progress>
      </div>
    </ProgressProvider>
  );
};

export default Providers;
