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
    </div>
  );
}

export default App;
