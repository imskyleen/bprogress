import { motion } from 'framer-motion';

import { Highlight } from '@workspace/ui/components/ui/hero-highlight';
import { Button } from '@workspace/ui/components/ui/button';
import {
  ArrowRightIcon,
  Check,
  Copy,
  PlayCircle,
  StopCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useProgress } from '@bprogress/next';
import config from 'site.config';

export const Hero = () => {
  const [copy, setCopy] = useState(false);
  const CopyIcon = useMemo(() => (copy ? Check : Copy), [copy]);

  const { start, stop } = useProgress();

  return (
    <div className="relative z-20 mx-auto max-w-7xl px-6 lg:pt-20 pt-32 w-full flex items-center justify-center">
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="lg:max-w-[60%] max-w-[700px] lg:space-y-8 space-y-6 flex flex-col items-center justify-center"
      >
        <span className="bprogress-logo fade" />

        <h1 className="text-3xl md:text-4xl lg:text-[46px] font-semibold text-neutral-800 dark:text-white !leading-relaxed lg:!leading-snug text-center">
          Improve page transitions with a smooth{' '}
          <Highlight>progress bar</Highlight>
        </h1>

        <p className="lg:text-lg text-base text-neutral-500 dark:text-neutral-400 max-w-2xl text-center">
          <strong>BProgress</strong> is an upgraded version of{' '}
          <strong>NProgress</strong>, offering a more modern design and enhanced
          features for a smoother experience.
        </p>

        <div className="flex lg:flex-row flex-col lg:gap-5 gap-3 items-center">
          <Button
            size="lg"
            className="w-fit rounded-full pr-5 bg-blue-500 hover:bg-blue-500/90 text-white"
            asChild
          >
            <Link href="/docs">
              Get Started <ArrowRightIcon className="!size-5" />
            </Link>
          </Button>

          <div className="bg-neutral-200 w-fit dark:bg-neutral-900 px-5 h-12 rounded-full flex gap-x-3 font-mono text-[15px] items-center justify-center">
            <span className="select-none">$</span>
            <span>{config.packages.main}</span>
            <button
              className="ml-1 transition hover:opacity-50"
              onClick={() => {
                navigator.clipboard.writeText(config.packages.main);
                setCopy(true);
                setTimeout(() => setCopy(false), 2000);
              }}
            >
              <CopyIcon className="!size-[19px]" />
            </button>
          </div>
        </div>

        <div className="lg:!mt-16 !mt-10 flex flex-col items-center justify-center space-y-4">
          <h2 className="text-2xl font-semibold">Try it now !</h2>
          <div className="flex flex-row gap-x-3">
            <Button size="icon-lg" onClick={() => start()}>
              <PlayCircle className="!size-7" />
            </Button>

            <Button size="icon-lg" onClick={() => stop()}>
              <StopCircle className="!size-7" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
