# BProgress for TanStack Router

BProgress integration for TanStack Router and TanStack Start applications.

## Installation

To install BProgress, run the following command:

```bash
npm install @bprogress/tanstack-router
```

## Import

### TanStack Router (SPA)

Import in your main entry file where you create the router.

```tsx
import { ProgressProvider } from '@bprogress/tanstack-router';
```

### TanStack Start (SSR)

Import in your `routes/__root.tsx` file.

```tsx
import { ProgressProvider } from '@bprogress/tanstack-router';
```

## Usage

```tsx
<ProgressProvider>...</ProgressProvider>
```

## Example

### TanStack Router (SPA)

Put `ProgressProvider` in your root route component so it runs inside `RouterProvider`.

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

// ... add child routes to routeTree

const router = createRouter({ routeTree })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
```

### TanStack Start (SSR)

In TanStack Start, wrap your body content with `ProgressProvider` in `routes/__root.tsx`.

```tsx title="routes/__root.tsx"
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { ProgressProvider } from '@bprogress/tanstack-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
  }),
  component: RootComponent,
})

function RootComponent({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ProgressProvider>{children}</ProgressProvider>
        <Scripts />
      </body>
    </html>
  )
}
```

## More information on documentation

Go to the [documentation](https://bprogress.vercel.app/docs/tanstack-router/installation) to learn more about BProgress.

## Issues

If you encounter any problems, do not hesitate to [open an issue](https://github.com/imskyleen/bprogress/issues) or make a PR [here](https://github.com/imskyleen/bprogress).

## LICENSE

MIT
