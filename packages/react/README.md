# BProgress for React

Create your own **progress bar** with **React**

## Import

```tsx
import { ProgressProvider } from '@bprogress/react';
```

The `@bprogress/react` package is a **utility** that lets you easily manage a progress bar, while remaining flexible with regard to the router you're using. **It doesn't automatically start the progress bar when browsing**, so you'll have to manage this logic yourself, unless you're using one of the integrations below.

### React Frameworks Integrations

- [Next.js](https://bprogress.vercel.app/docs/next/installation)
- [Remix](https://bprogress.vercel.app/docs/remix/installation)
- More soon...

## Usage

```tsx
<ProgressProvider>...</ProgressProvider>
```

## Example

```tsx title="src/index.tsx"
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ProgressProvider } from '@bprogress/react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <ProgressProvider>
      <App />
    </ProgressProvider>
  </React.StrictMode>,
);
```

```tsx title="src/App.tsx"
import { useProgress } from '@bprogress/react';

function App() {
  const { start, stop, pause, resume } = useProgress();

  return (
    <div className="App">
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={pause}>Pause</button>
      <button onClick={resume}>Resume</button>
    </div>
  );
}

export default App;
```

## More information on documentation

Go to the [documentation](https://bprogress.vercel.app/docs/react/installation) to learn more about BProgress.

## Issues

If you encounter any problems, do not hesitate to [open an issue](https://github.com/Skyleen77/bprogress/issues) or make a PR [here](https://github.com/Skyleen77/bprogress).

## LICENSE

MIT
