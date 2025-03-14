import { useProgress } from '@bprogress/react';

function App() {
  const { start, stop, pause, resume } = useProgress();

  return (
    <div className="App">
      <h1>React BProgress</h1>

      <button onClick={() => start()}>Start</button>
      <button onClick={() => stop()}>Stop</button>
      <button onClick={pause}>Pause</button>
      <button onClick={resume}>Resume</button>
      <button
        onClick={() => {
          start(0, 0, true);
          window.history.pushState(null, '', '/?test=1');
        }}
      >
        push url in param (disable auto stop)
      </button>
      <button
        onClick={() => {
          start(0, 0, false);
          window.history.pushState(null, '', '/?test=1');
        }}
      >
        push url in param (enable auto stop)
      </button>
    </div>
  );
}

export default App;
