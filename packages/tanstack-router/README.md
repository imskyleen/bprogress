# BProgress for TanStack Router

BProgress integration for TanStack Router and TanStack Start applications.

## Installation

To install BProgress, run the following command:

```bash
npm install @bprogress/tanstack-router
```

## Import

Import into your root route file.

```tsx
import { ProgressProvider } from '@bprogress/tanstack-router';
```

## Usage

`ProgressProvider` must be **inside** the router (e.g. in your root route component), not wrapping `<RouterProvider>`. Wrap your root route content (e.g. `<Outlet />`) with it.

### Example: TanStack Router (SPA)

Put `ProgressProvider` in your root route component so it runs inside `RouterProvider`:

```tsx title="src/main.tsx"
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRouter,
} from '@tanstack/react-router'
import { ProgressProvider } from '@bprogress/tanstack-router'

const rootRoute = createRootRoute({
  component: () => (
    <ProgressProvider>
      <Outlet />
    </ProgressProvider>
  ),
})

// ... add child routes, then create router

const router = createRouter({ routeTree })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
```

### Example: TanStack Start (SSR)

In TanStack Start, use `routes/__root.tsx`. Wrap your body content with `ProgressProvider` (you're already under the router).

```tsx title="routes/__root.tsx"
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { ProgressProvider } from '@bprogress/tanstack-router'

export const Route = createRootRoute({
  head: () => ({ meta: [...], links: [...] }),
  component: RootComponent,
})

function RootComponent({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ProgressProvider>
          {children}
        </ProgressProvider>
        <Scripts />
      </body>
    </html>
  )
}
```

> **Note:** The provider uses `<ClientOnly>` from `@tanstack/react-router` internally in SSR, so the same usage works in both SPA and TanStack Start.

### Manual Control

For advanced use cases, you can manually control the progress bar:

```tsx
import { useProgress } from '@bprogress/tanstack-router';

function MyComponent() {
  const { start, stop, pause, resume } = useProgress();

  const handleAction = async () => {
    start();
    // ... perform some async action
    stop();
  };

  return <button onClick={handleAction}>Perform Action</button>;
}
```

## How It Works

The implementation leverages TanStack Router's event system:

- **`onBeforeLoad`** - Triggered when navigation starts (equivalent to Next.js `routeChangeStart`)
- **`onResolved`** - Triggered when navigation completes (equivalent to Next.js `routeChangeComplete`)
- **`event.hrefChanged`** - Used to detect if the URL actually changed (respects `disableSameURL` prop)

## API

### ProgressProvider Props

The `ProgressProvider` component accepts all standard BProgress props:

- `color` - Color of the progress bar (default: `#29d`)
- `height` - Height of the progress bar (default: `2px`)
- `startPosition` - Starting position of the progress bar (default: `0`)
- `delay` - Delay before showing the progress bar in ms (default: `0`)
- `stopDelay` - Delay before hiding the progress bar in ms (default: `0`)
- `disableSameURL` - Disable progress bar for same URL navigation (default: `true`)
- `options` - Additional BProgress options

### useProgress Hook

The `useProgress` hook provides manual control over the progress bar:

```tsx
const { start, stop, pause, resume, getOptions, setOptions } = useProgress();
```

Available methods:
- `start(position?, delay?)` - Start the progress bar
- `stop(stopDelay?)` - Stop and hide the progress bar
- `pause()` - Pause the progress bar animation
- `resume()` - Resume the progress bar animation
- `getOptions()` - Get current progress bar options
- `setOptions(options)` - Update progress bar options

## TanStack Start Support

This package works with TanStack Start as it uses TanStack Router under the hood. The progress bar will automatically work with both client-side and server-side navigation.

## More information on documentation

Go to the [documentation](https://bprogress.vercel.app/docs/tanstack-router/installation) to learn more about BProgress.

## Issues

If you encounter any problems, do not hesitate to [open an issue](https://github.com/imskyleen/bprogress/issues) or make a PR [here](https://github.com/imskyleen/bprogress).

## LICENSE

MIT
