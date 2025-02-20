import { useProgress, useNavigate } from '@bprogress/remix';
import type { MetaFunction } from '@remix-run/node';
import {
  Link,
  // useNavigate
} from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export default function Index() {
  const { start, stop, pause, resume, getOptions, setOptions } = useProgress();

  const navigate = useNavigate();

  return (
    <main>
      <div className="flex flex-col max-w-3xl mx-auto p-6">
        <header className="flex flex-col items-center gap-9">
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            Welcome to <span className="sr-only">Remix</span>
          </h1>
          <div className="h-[144px] w-[434px]">
            <img
              src="/logo-light.png"
              alt="Remix"
              className="block w-full dark:hidden"
            />
            <img
              src="/logo-dark.png"
              alt="Remix"
              className="hidden w-full dark:block"
            />
          </div>
        </header>

        <button
          className="default"
          onClick={() => console.log('getOptions', getOptions())}
        >
          getOptions
        </button>
        <button
          className="default"
          onClick={() =>
            setOptions((prev) => ({ ...prev, showSpinner: !prev.showSpinner }))
          }
        >
          toggle showSpinner
        </button>

        <button className="default" onClick={() => start()}>
          Start progress
        </button>
        <button className="default" onClick={() => stop()}>
          Stop progress
        </button>
        <button className="default" onClick={pause}>
          Pause progress
        </button>
        <button className="default" onClick={resume}>
          Resume progress
        </button>

        <Link to="/">Same route</Link>
        <Link to="/?test=param">Sallow</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link
          to="/dashboard"
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span>Dashboard</span>

          <span
            style={{
              marginTop: 15,
            }}
            onClick={(e) => e.preventDefault()}
            data-prevent-progress={true}
          >
            e.preventDefault()
          </span>
        </Link>
        <Link to="#test">Link with to</Link>
        <Link to="/dashboard" data-disable-progress={true}>
          Link with bprogress disabled
        </Link>

        <button onClick={() => navigate('/')}>Navigate same url</button>
        <button onClick={() => navigate('/dashboard')}>
          Navigate Dashboard
        </button>
        <button onClick={() => navigate(-1)}>Navigate -1</button>

        <Link
          className="a"
          to="https://www.npmjs.com/package/@bprogress/next"
          target="_blank"
          rel="noopener noreferrer"
        >
          Link with target=`&quot;`_blank`&quot;` not affected
        </Link>
        <Link
          className="a"
          to="mailto:john.doe@exemple.com"
          rel="noopener noreferrer"
        >
          Link with mailto not affected
        </Link>
        <Link className="a" to="tel:0000000000" rel="noopener noreferrer">
          Link with tel not affected
        </Link>
        <a
          className="a"
          href="blob:http://localhost:3000/123456789"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          Link with blob not affected
        </a>
        <a className="a">Link without to won&apos;t throw error</a>

        <p
          style={{
            marginTop: 10,
            marginBottom: 5,
          }}
        >
          In a svg element :
        </p>
        <svg>
          <Link to="/dashboard">
            <circle fill="white" cx={30} cy={30} r={30} />
          </Link>
        </svg>
      </div>
    </main>
  );
}
