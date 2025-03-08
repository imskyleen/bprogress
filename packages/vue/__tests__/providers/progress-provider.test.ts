import { render, fireEvent } from '@testing-library/vue';
import { defineComponent } from 'vue';
import { ProgressProvider, useProgress } from '../../src';
import { BProgress } from '@bprogress/core';

jest.mock('@bprogress/core', () => ({
  BProgress: {
    start: jest.fn(),
    done: jest.fn(),
    inc: jest.fn(),
    dec: jest.fn(),
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
    },
  },
  css: jest.fn(() => 'mocked-css { color: red; }'),
}));

const TestComponent = defineComponent({
  template: `
    <div>
      <button data-testid="start" @click="start(50, 100)">Start</button>
      <button data-testid="stop" @click="stop(200, 100)">Stop</button>
      <button data-testid="inc" @click="inc(0.1)">Inc</button>
      <button data-testid="dec" @click="dec(0.1)">Dec</button>
      <button data-testid="set" @click="set(0.5)">Set</button>
      <button data-testid="pause" @click="pause()">Pause</button>
      <button data-testid="resume" @click="resume()">Resume</button>
      <button data-testid="setOptions" @click="setOptions({ speed: 500 })">SetOptions</button>
      <button data-testid="getOptions" @click="getOptions()">GetOptions</button>
    </div>
  `,
  setup() {
    const {
      start,
      stop,
      inc,
      dec,
      set,
      pause,
      resume,
      setOptions,
      getOptions,
    } = useProgress();
    return {
      start,
      stop,
      inc,
      dec,
      set,
      pause,
      resume,
      setOptions,
      getOptions,
    };
  },
});

describe('ProgressProvider.vue', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('provides the context and renders children', () => {
    const { getByText } = render(ProgressProvider, {
      slots: {
        default: '<div>Child Component</div>',
      },
    });
    expect(getByText('Child Component')).toBeTruthy();
  });

  test('throws an error when useProgress is used outside of ProgressProvider', () => {
    const TestComponentWithoutProvider = defineComponent({
      template: `<div>Test</div>`,
      setup() {
        useProgress();
      },
    });
    expect(() => render(TestComponentWithoutProvider)).toThrow(
      'useProgress must be used within a ProgressProvider',
    );
  });

  test('calls BProgress.start when start is invoked', async () => {
    const { getByTestId } = render(ProgressProvider, {
      slots: { default: TestComponent },
    });

    const startButton = getByTestId('start');
    await fireEvent.click(startButton);
    jest.advanceTimersByTime(100);
    expect(BProgress.set).toHaveBeenCalledWith(50);
    expect(BProgress.start).toHaveBeenCalled();
  });

  test('calls BProgress.done when stop is invoked', async () => {
    const { getByTestId } = render(ProgressProvider, {
      slots: { default: TestComponent },
    });

    const stopButton = getByTestId('stop');
    await fireEvent.click(stopButton);
    jest.advanceTimersByTime(100);
    jest.advanceTimersByTime(200);
    expect(BProgress.done).toHaveBeenCalled();
  });

  test('calls BProgress.inc when inc is invoked', async () => {
    const { getByTestId } = render(ProgressProvider, {
      slots: { default: TestComponent },
    });

    const incButton = getByTestId('inc');
    await fireEvent.click(incButton);
    expect(BProgress.inc).toHaveBeenCalledWith(0.1);
  });

  test('calls BProgress.dec when dec is invoked', async () => {
    const { getByTestId } = render(ProgressProvider, {
      slots: { default: TestComponent },
    });

    const decButton = getByTestId('dec');
    await fireEvent.click(decButton);
    expect(BProgress.dec).toHaveBeenCalledWith(0.1);
  });

  test('calls BProgress.set when set is invoked', async () => {
    const { getByTestId } = render(ProgressProvider, {
      slots: { default: TestComponent },
    });

    const setButton = getByTestId('set');
    await fireEvent.click(setButton);
    expect(BProgress.set).toHaveBeenCalledWith(0.5);
  });

  test('calls BProgress.pause when pause is invoked', async () => {
    const { getByTestId } = render(ProgressProvider, {
      slots: { default: TestComponent },
    });

    const pauseButton = getByTestId('pause');
    await fireEvent.click(pauseButton);
    expect(BProgress.pause).toHaveBeenCalled();
  });

  test('calls BProgress.resume when resume is invoked', async () => {
    const { getByTestId } = render(ProgressProvider, {
      slots: { default: TestComponent },
    });

    const resumeButton = getByTestId('resume');
    await fireEvent.click(resumeButton);
    expect(BProgress.resume).toHaveBeenCalled();
  });

  test('calls BProgress.configure when setOptions is invoked', async () => {
    const { getByTestId } = render(ProgressProvider, {
      slots: { default: TestComponent },
    });

    const setOptionsButton = getByTestId('setOptions');
    await fireEvent.click(setOptionsButton);
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

  test('returns BProgress.settings when getOptions is invoked', async () => {
    const { getByTestId } = render(ProgressProvider, {
      slots: { default: TestComponent },
    });

    const getOptionsButton = getByTestId('getOptions');
    await fireEvent.click(getOptionsButton);
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

  test('renders custom styles when style is provided', () => {
    const customStyle = '.custom { color: red; }';
    const { container } = render(ProgressProvider, {
      props: { style: customStyle },
      slots: { default: '<div>Styled</div>' },
    });

    const styleTag = container.querySelector('style');
    expect(styleTag).toBeTruthy();
    expect(styleTag?.textContent).toContain(customStyle);
  });

  test('applies default styles if disableStyle is false', () => {
    const { container } = render(ProgressProvider, {
      slots: { default: '<div>Styled</div>' },
    });

    const styleTag = container.querySelector('style');
    expect(styleTag).toBeInTheDocument();
  });

  test('does not render styles when disableStyle is true', () => {
    const { container } = render(ProgressProvider, {
      props: { disableStyle: true },
      slots: { default: '<div>No Styles</div>' },
    });

    const styleTag = container.querySelector('style');
    expect(styleTag).toBeNull();
  });

  test('initializes BProgress with provided options', () => {
    render(ProgressProvider, {
      props: { options: { trickle: false, showSpinner: false } },
      slots: { default: '<div>Configured</div>' },
    });

    expect(BProgress.configure).toHaveBeenCalledWith(
      expect.objectContaining({
        trickle: false,
        showSpinner: false,
      }),
    );
  });
});
