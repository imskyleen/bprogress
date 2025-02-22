import React from 'react';
import { render, act } from '@testing-library/react';
import {
  ProgressProvider,
  useProgress,
} from '../../src/providers/progress-provider';
import { BProgress, type BProgressOptions } from '@bprogress/core';

// Mock BProgress to spy on function calls
jest.mock('@bprogress/core', () => ({
  BProgress: {
    start: jest.fn(),
    done: jest.fn(),
    inc: jest.fn(),
    set: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    configure: jest.fn(),
    isStarted: jest.fn(() => true),
    settings: {
      minimum: 0.08,
      maximum: 1,
      easing: 'linear',
      speed: 200,
      trickle: true,
      trickleSpeed: 300,
      showSpinner: true,
      positionUsing: 'translate3d',
      direction: 'ltr',
    } as Required<BProgressOptions>,
  },
}));

describe('ProgressProvider', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  const TestComponent = () => {
    const { start, stop, inc, set, pause, resume, setOptions, getOptions } =
      useProgress();

    return (
      <div>
        <button onClick={() => start(50, 100)}>Start</button>
        <button onClick={() => stop(200, 100)}>Stop</button>
        <button onClick={() => inc(0.1)}>Inc</button>
        <button onClick={() => set(0.5)}>Set</button>
        <button onClick={pause}>Pause</button>
        <button onClick={resume}>Resume</button>
        <button onClick={() => setOptions({ speed: 500 })}>SetOptions</button>
        <button onClick={() => getOptions()}>GetOptions</button>
      </div>
    );
  };

  it('provides the context and renders children', () => {
    const { getByText } = render(
      <ProgressProvider>
        <div>Child Component</div>
      </ProgressProvider>,
    );

    expect(getByText('Child Component')).toBeInTheDocument();
  });

  it('throws an error when useProgress is used outside of ProgressProvider', () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      'useProgress must be used within a ProgressProvider',
    );

    consoleErrorSpy.mockRestore();
  });

  it('calls BProgress.start when start is invoked', async () => {
    const { getByText } = render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>,
    );

    await act(async () => {
      getByText('Start').click();
      jest.advanceTimersByTime(100);
    });

    expect(BProgress.set).toHaveBeenCalledWith(50);
    expect(BProgress.start).toHaveBeenCalled();
  });

  it('calls BProgress.done when stop is invoked', () => {
    jest.useFakeTimers();

    const { getByText } = render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>,
    );

    act(() => {
      getByText('Stop').click();
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(BProgress.done).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('calls BProgress.inc when inc is invoked', () => {
    const { getByText } = render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>,
    );

    act(() => {
      getByText('Inc').click();
    });

    expect(BProgress.inc).toHaveBeenCalledWith(0.1);
  });

  it('calls BProgress.set when set is invoked', () => {
    const { getByText } = render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>,
    );

    act(() => {
      getByText('Set').click();
    });

    expect(BProgress.set).toHaveBeenCalledWith(0.5);
  });

  it('calls BProgress.pause when pause is invoked', () => {
    const { getByText } = render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>,
    );

    act(() => {
      getByText('Pause').click();
    });

    expect(BProgress.pause).toHaveBeenCalled();
  });

  it('calls BProgress.resume when resume is invoked', () => {
    const { getByText } = render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>,
    );

    act(() => {
      getByText('Resume').click();
    });

    expect(BProgress.resume).toHaveBeenCalled();
  });

  it('calls BProgress.configure when setOptions is invoked', () => {
    const { getByText } = render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>,
    );

    act(() => {
      getByText('SetOptions').click();
    });

    expect(BProgress.configure).toHaveBeenCalledWith({
      minimum: 0.08,
      maximum: 1,
      easing: 'linear',
      speed: 500,
      trickle: true,
      trickleSpeed: 300,
      showSpinner: true,
      positionUsing: 'translate3d',
      direction: 'ltr',
    });
  });

  it('returns BProgress.settings when getOptions is invoked', () => {
    const { getByText } = render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>,
    );

    act(() => {
      getByText('GetOptions').click();
    });

    expect(BProgress.settings).toEqual({
      minimum: 0.08,
      maximum: 1,
      easing: 'linear',
      speed: 200,
      trickle: true,
      trickleSpeed: 300,
      showSpinner: true,
      positionUsing: 'translate3d',
      direction: 'ltr',
    });
  });

  it('renders custom styles when style is provided', () => {
    const { container } = render(
      <ProgressProvider style=".custom { color: red; }">
        <div>Styled</div>
      </ProgressProvider>,
    );

    expect(container.querySelector('style')).toHaveTextContent(
      '.custom { color: red; }',
    );
  });

  it('applies default styles if disableStyle is false', () => {
    const { container } = render(
      <ProgressProvider>
        <div>Styled</div>
      </ProgressProvider>,
    );

    expect(container.querySelector('style')).toBeInTheDocument();
  });

  it('does not render styles when disableStyle is true', () => {
    const { container } = render(
      <ProgressProvider disableStyle>
        <div>No Styles</div>
      </ProgressProvider>,
    );

    expect(container.querySelector('style')).not.toBeInTheDocument();
  });

  it('initializes BProgress with provided options', () => {
    render(
      <ProgressProvider options={{ trickle: false, showSpinner: false }}>
        <div>Configured</div>
      </ProgressProvider>,
    );

    expect(BProgress.configure).toHaveBeenCalledWith(
      expect.objectContaining({
        trickle: false,
        showSpinner: false,
      }),
    );
  });
});
