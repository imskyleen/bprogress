import { createFileRoute, Link } from '@tanstack/react-router'
import '../App.css'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img
          src="/tanstack-circle-logo.png"
          className="App-logo"
          alt="TanStack Logo"
        />
        <h1>TanStack Start + BProgress</h1>
        <p>
          This demo showcases <code>@bprogress/tanstack-router</code> with
          server-side rendering.
        </p>
        <p>Click the navigation links to see the progress bar in action!</p>
        <div
          style={{
            marginTop: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <Link to="/demo/bprogress" className="App-link">
            🎨 BProgress Demo →
          </Link>
          <Link to="/demo/start/server-funcs" className="App-link">
            🔧 Server Functions →
          </Link>
          <Link to="/demo/start/api-request" className="App-link">
            🌐 API Request →
          </Link>
          <Link to="/demo/start/ssr" className="App-link">
            🖥️ SSR Demos →
          </Link>
          <a
            className="App-link"
            href="https://bprogress.vercel.app/docs/tanstack-router/installation"
            target="_blank"
            rel="noopener noreferrer"
          >
            📚 BProgress Documentation
          </a>
          <a
            className="App-link"
            href="https://tanstack.com/start"
            target="_blank"
            rel="noopener noreferrer"
          >
            🚀 Learn TanStack Start
          </a>
        </div>
      </header>
    </div>
  )
}
