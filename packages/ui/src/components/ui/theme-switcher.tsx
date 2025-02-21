'use client';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const MotionSwitch = motion.create(SwitchPrimitives.Root);
const MotionThumb = motion.create(SwitchPrimitives.Thumb);

const ThemeSwitcher = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> &
    HTMLMotionProps<'button'> & {
      checked?: boolean;
      onCheckedChange?: (checked: boolean) => void;
    }
>(({ checked: controlledChecked, onCheckedChange, ...props }, ref) => {
  const [internalChecked, setInternalChecked] = useState(
    props.defaultChecked || false,
  );

  const isControlled = controlledChecked !== undefined;
  const checkedState = isControlled ? controlledChecked : internalChecked;

  const handleCheckedChange = (newChecked: boolean) => {
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    onCheckedChange?.(newChecked);
  };

  const thumbVariants = {
    tap: {
      width: '32px',
      translateX: checkedState ? '28px' : '4px',
      transition: {
        duration: 0.1,
      },
    },
    checked: {
      translateX: '32px',
      transition: { ease: 'circInOut' },
    },
    unchecked: {
      translateX: '4px',
      transition: { ease: 'circInOut' },
    },
  };

  const Icon = React.useMemo(() => (checkedState ? Moon : Sun), [checkedState]);

  return (
    <MotionSwitch
      checked={checkedState}
      onCheckedChange={handleCheckedChange}
      className="inline-flex items-center w-16 h-9 shrink-0 cursor-pointer bg-gray-300 rounded-full relative data-[state=checked]:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
      whileTap="tap"
      animate={checkedState ? 'checked' : 'unchecked'}
      {...props}
      ref={ref}
    >
      {checkedState ? (
        <Sun className="size-[17px] absolute top-1/2 -translate-y-1/2 left-2.5" />
      ) : (
        <Moon className="size-[17px] absolute top-1/2 -translate-y-1/2 right-2.5" />
      )}

      <MotionThumb
        initial={{ translateX: '2px' }}
        className="w-7 h-7 bg-white dark:bg-neutral-950 rounded-full shadow-sm flex items-center justify-center"
        variants={thumbVariants}
      >
        <Icon className="size-[17px]" />
      </MotionThumb>
    </MotionSwitch>
  );
});
ThemeSwitcher.displayName = SwitchPrimitives.Root.displayName;

export default ThemeSwitcher;
