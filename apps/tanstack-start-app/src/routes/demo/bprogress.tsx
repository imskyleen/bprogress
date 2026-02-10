import { createFileRoute, Link } from '@tanstack/react-router'
import { useProgress } from '@bprogress/tanstack-router'
import './start.css'

export const Route = createFileRoute('/demo/bprogress')({
  component: BProgressDemo,
})

function BProgressDemo() {
  const { start, stop, pause, resume, getOptions, setOptions } = useProgress()

  return (
    <div className="api-page">
      <div className="content">
        <h1>BProgress Demo</h1>
        <p style={{ marginBottom: '2rem' }}>
          This demonstrates <code>@bprogress/tanstack-router</code> with
          TanStack Start (SSR).
        </p>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            Navigation Links (Automatic Progress)
          </h2>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>
              <Link to="/">← Home</Link>
            </li>
            <li>
              <Link to="/demo/bprogress">Reload This Page</Link>
            </li>
            <li>
              <Link to="/demo/start/ssr">SSR Demos →</Link>
            </li>
            <li>
              <Link to="/demo/start/server-funcs">Server Functions →</Link>
            </li>
            <li>
              <Link to="/demo/start/api-request">API Request →</Link>
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            Progress Controls
          </h2>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <button onClick={() => console.log('Options:', getOptions())}>
              Log Options to Console
            </button>
            <button
              onClick={() =>
                setOptions((prev) => ({
                  ...prev,
                  showSpinner: !prev.showSpinner,
                }))
              }
            >
              Toggle Spinner
            </button>
            <button onClick={() => start()}>Start Progress Manually</button>
            <button onClick={() => stop()}>Stop Progress Manually</button>
            <button onClick={pause}>Pause Progress</button>
            <button onClick={resume}>Resume Progress</button>
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            Key Features
          </h2>
          <ul>
            <li>
              <span>✅ Server-Side Rendering (SSR)</span>
            </li>
            <li>
              <span>✅ Client-side navigation with progress bar</span>
            </li>
            <li>
              <span>✅ Automatic progress on all navigation</span>
            </li>
            <li>
              <span>✅ Manual progress control via useProgress hook</span>
            </li>
            <li>
              <span>✅ Works with TanStack Start and standalone TanStack Router</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
