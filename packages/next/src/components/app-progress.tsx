import {
  useAnchorProgress,
  withMemo,
  type AnchorProgressProps,
} from '@bprogress/react';
import { usePathname, useSearchParams } from 'next/navigation';

const AppProgressComponent = (props: AnchorProgressProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useAnchorProgress(props, [pathname, searchParams]);

  return null;
};

export const AppProgress = withMemo(AppProgressComponent);

AppProgress.displayName = 'AppProgress';
