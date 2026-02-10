# BProgress for TanStack Router

BProgress integration for TanStack Router and TanStack Start applications.

## Installation

To install BProgress, run the following command:

```bash
npm install @bprogress/tanstack-router
```

## Import

Import into your root route file (e.g., `/src/routes/__root.tsx`).

```tsx
import { ProgressProvider } from '@bprogress/tanstack-router';
```

## Usage

### Basic Usage

Wrap your app with the `ProgressProvider`:

```tsx
<ProgressProvider>...</ProgressProvider>
```

### Example

```tsx title="src/routes/__root.tsx"
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { ProgressProvider } from '@bprogress/tanstack-router';

export const Route = createRootRoute({
  component: () => (
    <ProgressProvider>
      <Outlet />
    </ProgressProvider>
  ),
});
```

### Programmatic Navigation

Use the enhanced `useNavigate` hook for programmatic navigation with progress bar support:

```tsx
import { useNavigate } from '@bprogress/tanstack-router';

function MyComponent() {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate with progress bar
    navigate({ to: '/about' });
    
    // Navigate with custom progress options
    navigate(
      { to: '/posts', search: { page: 2 } },
      { startPosition: 0.3, delay: 100 }
    );
    
    // Navigate without progress bar
    navigate(
      { to: '/profile' },
      { showProgress: false }
    );
  };

  return <button onClick={handleClick}>Go to About</button>;
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

### useNavigate Options

The `useNavigate` hook accepts optional default progress options:

```tsx
const navigate = useNavigate({
  startPosition: 0.3,
  delay: 100,
  disableSameURL: true,
});
```

### navigate Function Progress Options

When calling `navigate()`, you can pass progress options as the second parameter:

- `showProgress` - Show the progress bar (default: `true`)
- `startPosition` - Starting position override
- `delay` - Delay override
- `stopDelay` - Stop delay override
- `disableSameURL` - Disable same URL check override

## TanStack Start Support

This package works with TanStack Start as it uses TanStack Router under the hood. The progress bar will automatically work with both client-side and server-side navigation.

## More information on documentation

Go to the [documentation](https://bprogress.vercel.app/docs/tanstack-router/installation) to learn more about BProgress.

## Issues

If you encounter any problems, do not hesitate to [open an issue](https://github.com/imskyleen/bprogress/issues) or make a PR [here](https://github.com/imskyleen/bprogress).

## LICENSE

MIT
