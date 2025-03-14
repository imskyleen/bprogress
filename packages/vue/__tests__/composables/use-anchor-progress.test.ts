import { defineComponent, nextTick, computed } from 'vue';
import { render, fireEvent } from '@testing-library/vue';
import { useAnchorProgress } from '../../src/composables/use-anchor-progress';
import { progressSymbol } from '../../src/composables/use-progress';

// Use fake timers to control setTimeout behavior
jest.useFakeTimers();

// Mocks utils functions
jest.mock('@bprogress/core', () => ({
  isSameURL: jest.fn(() => false),
  isSameURLWithoutSearch: jest.fn(() => false),
  getAnchorProperty: (element: HTMLElement, prop: string) => {
    return element.getAttribute(prop) || '';
  },
}));

// Define start and stop mocks that will be used by the provider
const startMock = jest.fn();
const stopMock = jest.fn();
const isAutoStopDisabledMock = jest.fn(() => ({
  value: false,
}));

// Test component that uses the hook
const TestComponent = defineComponent({
  props: {
    options: {
      type: Object,
      required: true,
    },
    deps: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    // Make the dependencies reactive using a computed property.
    const reactiveDeps = computed(() => props.deps);
    useAnchorProgress(props.options, [reactiveDeps]);
    return {};
  },
  template: '<div>Test Component</div>',
});

// Global configuration to provide the ProgressProvider context
const globalConfig = {
  provide: {
    [progressSymbol]: {
      start: startMock,
      stop: stopMock,
      isAutoStopDisabled: isAutoStopDisabledMock,
    },
  },
};

describe('useAnchorProgress hook', () => {
  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('calls start on mount when startOnLoad is true', async () => {
    render(TestComponent, {
      global: globalConfig,
      props: {
        options: { startOnLoad: true, startPosition: 10, delay: 100 },
        deps: [],
      },
    });
    await nextTick();
    expect(startMock).toHaveBeenCalledWith(10, 100);
  });

  it('schedules a stop call on dependency change after stopDelay', async () => {
    // Render the component with initial props
    const { rerender } = render(TestComponent, {
      global: globalConfig,
      props: {
        options: { stopDelay: 200 },
        deps: [1],
      },
    });

    // Update props to simulate dependency change
    rerender({ options: { stopDelay: 200 }, deps: [2] });
    await nextTick();
    jest.advanceTimersByTime(200);
    expect(stopMock).toHaveBeenCalled();
  });

  it('attaches a click event listener on a valid anchor and calls start on click', async () => {
    // Create a valid anchor element and append it to the document.
    const anchor = document.createElement('a');
    anchor.setAttribute('href', 'http://example.com');
    document.body.appendChild(anchor);

    render(TestComponent, {
      global: globalConfig,
      props: {
        options: { startPosition: 5, delay: 50 },
        deps: [],
      },
    });
    // Force a DOM mutation to trigger the MutationObserver callback.
    const dummy = document.createElement('div');
    document.body.appendChild(dummy);
    document.body.removeChild(dummy);
    await nextTick();

    // Dispatch a click event on the anchor.
    await fireEvent.click(anchor);
    expect(startMock).toHaveBeenCalledWith(5, 50);
  });

  it('does not call start if data-prevent-progress is true on the anchor', async () => {
    const anchor = document.createElement('a');
    anchor.setAttribute('href', 'http://example.com');
    anchor.setAttribute('data-prevent-progress', 'true');
    document.body.appendChild(anchor);

    render(TestComponent, {
      global: globalConfig,
      props: {
        options: { startPosition: 5, delay: 50 },
        deps: [],
      },
    });
    // Force a mutation for the MutationObserver to execute.
    const dummy = document.createElement('div');
    document.body.appendChild(dummy);
    document.body.removeChild(dummy);
    await nextTick();

    await fireEvent.click(anchor);
    expect(startMock).not.toHaveBeenCalled();
  });

  it('skips the anchor click if the anchor target is _blank', async () => {
    const anchor = document.createElement('a');
    anchor.setAttribute('href', 'http://example.com');
    anchor.setAttribute('target', '_blank');
    document.body.appendChild(anchor);

    render(TestComponent, {
      global: globalConfig,
      props: {
        options: { startPosition: 5, delay: 50 },
        deps: [],
      },
    });
    const dummy = document.createElement('div');
    document.body.appendChild(dummy);
    document.body.removeChild(dummy);
    await nextTick();

    await fireEvent.click(anchor);
    expect(startMock).not.toHaveBeenCalled();
  });

  it('skips the anchor click if a meta key is pressed', async () => {
    const anchor = document.createElement('a');
    anchor.setAttribute('href', 'http://example.com');
    document.body.appendChild(anchor);

    render(TestComponent, {
      global: globalConfig,
      props: {
        options: { startPosition: 5, delay: 50 },
        deps: [],
      },
    });
    const dummy = document.createElement('div');
    document.body.appendChild(dummy);
    document.body.removeChild(dummy);
    await nextTick();

    await fireEvent.click(anchor, { metaKey: true });
    expect(startMock).not.toHaveBeenCalled();
  });

  it('calls stop when window.history.pushState is invoked', async () => {
    const originalPushState = window.history.pushState;
    render(TestComponent, {
      global: globalConfig,
      props: {
        options: { stopDelay: 300, forcedStopDelay: 100 },
        deps: [],
      },
    });
    await nextTick();

    // Simulate pushState which should trigger stop.
    window.history.pushState({}, '', '/new-url');
    jest.advanceTimersByTime(300);
    expect(stopMock).toHaveBeenCalled();

    // Restore the original pushState.
    window.history.pushState = originalPushState;
  });

  it('cleans up event listeners and timers on unmount', async () => {
    const anchor = document.createElement('a');
    anchor.setAttribute('href', 'http://example.com');
    document.body.appendChild(anchor);
    const removeSpy = jest.spyOn(anchor, 'removeEventListener');

    const { unmount } = render(TestComponent, {
      global: globalConfig,
      props: {
        options: { startPosition: 5, delay: 50 },
        deps: [],
      },
    });
    const dummy = document.createElement('div');
    document.body.appendChild(dummy);
    document.body.removeChild(dummy);
    await nextTick();

    // Unmount the component to trigger the hook's cleanup.
    unmount();
    await nextTick();
    jest.runOnlyPendingTimers();

    // Verify that removeEventListener was called on the anchor.
    expect(removeSpy).toHaveBeenCalled();
    // And that no stop call is made on unmount.
    expect(stopMock).not.toHaveBeenCalled();

    removeSpy.mockRestore();
  });
});
