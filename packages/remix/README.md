# BProgress for Remix

BProgress integration for Remix applications.

## Installation

To install BProgress, run the following command:

```bash
npm install @bprogress/remix
```

## Import

Import into your `/app/root(.jsx/.tsx)` folder.

```tsx
import { ProgressProvider } from '@bprogress/remix';
```

## Usage

```tsx
<ProgressProvider>...</ProgressProvider>
```

## Example

```tsx title="app/root.tsx"
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';
import { ProgressProvider } from '@bprogress/remix';

import './tailwind.css';

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ProgressProvider startOnLoad>{children}</ProgressProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
```

## More information on documentation

Go to the [documentation](https://bprogress.vercel.app/docs/remix/installation) to learn more about BProgress.

## Issues

If you encounter any problems, do not hesitate to [open an issue](https://github.com/Skyleen77/bprogress/issues) or make a PR [here](https://github.com/Skyleen77/bprogress).

## LICENSE

MIT
