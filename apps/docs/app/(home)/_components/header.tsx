import React from 'react';
import { useTheme } from 'next-themes';
import ThemeSwitcher from '@workspace/ui/components/ui/theme-switcher';
import { Button } from '@workspace/ui/components/ui/button';
import { GrNpm } from 'react-icons/gr';
import { FaGithub } from 'react-icons/fa6';
import Link from 'next/link';
import { Logo } from '@/components/logo';

export const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed lg:top-14 top-10 left-0 z-40 w-full">
      <div className="flex items-center justify-between max-w-[1400px] w-full mx-auto px-6">
        <Logo className="lg:h-6 h-4" />

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              className="bg-[#1B1F23] hover:bg-[#1B1F23]/90 rounded-full"
              size="icon"
              asChild
            >
              <Link
                href="https://github.com/Skyleen77/bprogress"
                target="_blank"
                rel="noreferrer"
              >
                <FaGithub className="!size-6 text-white npm-button" />
              </Link>
            </Button>
            <Button
              className="bg-[#CB3837] hover:bg-[#CB3837]/90 rounded-full"
              size="icon"
              asChild
            >
              <Link
                href="https://www.npmjs.com/package/@bprogress/core"
                target="_blank"
                rel="noreferrer"
              >
                <GrNpm className="!size-6 text-white npm-button" />
              </Link>
            </Button>
          </div>

          <ThemeSwitcher
            checked={theme === 'dark'}
            onCheckedChange={(checked) => {
              setTheme(checked ? 'dark' : 'light');
            }}
          />
        </div>
      </div>
    </div>
  );
};
