import { renderHook, act } from '@testing-library/react';
import { useAnchorProgress } from '../../src/hooks/use-anchor-progress';

// Use fake timers to control setTimeout behavior
jest.useFakeTimers();

// Mock useProgress so that we can spy on its start and stop methods.
const startMock = jest.fn();
const stopMock = jest.fn();

jest.mock('../../src/providers/progress-provider', () => ({
  useProgress: () => ({
    start: startMock,
    stop: stopMock,
  }),
}));

// Mock URL comparison utilities to always return false (so that start is triggered)
jest.mock('../../src/utils/same-url', () => ({
  isSameURL: jest.fn(() => false),
  isSameURLWithoutSearch: jest.fn(() => false),
}));

// Mock getAnchorProperty to return the element's attribute value
jest.mock('../../src/utils/get-anchor-property', () => ({
  getAnchorProperty: (element: HTMLElement, prop: string) => {
    return element.getAttribute(prop) || '';
  },
}));

describe('useAnchorProgress hook', () => {
  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('calls start on mount when startOnLoad is true', () => {
    renderHook(() =>
      useAnchorProgress(
        { startOnLoad: true, startPosition: 10, delay: 100 },
        [],
      ),
    );
    expect(startMock).toHaveBeenCalledWith(10, 100);
  });

  it('schedules a stop call on dependency change after stopDelay', () => {
    const { rerender } = renderHook(
      (deps) => useAnchorProgress({ stopDelay: 200 }, deps),
      { initialProps: [1] },
    );

    rerender([2]);

    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(stopMock).toHaveBeenCalled();
  });

  it('attaches click event listener to valid anchor and calls start on click', async () => {
    // Create a valid anchor element (without data-prevent-progress) and append it to the document.
    const anchor = document.createElement('a');
    anchor.setAttribute('href', 'http://example.com');
    document.body.appendChild(anchor);

    // Render the hook.
    renderHook(() => useAnchorProgress({ startPosition: 5, delay: 50 }, []));

    // Trigger a DOM mutation to force MutationObserver callback.
    const dummy = document.createElement('div');
    document.body.appendChild(dummy);
    document.body.removeChild(dummy);

    // Wait for the MutationObserver callback to be executed.
    await act(async () => {
      await Promise.resolve();
    });

    // Dispatch a click event on the anchor.
    act(() => {
      anchor.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      );
    });

    expect(startMock).toHaveBeenCalledWith(5, 50);
  });

  it('does not call start on anchor click if data-prevent-progress is true', () => {
    const anchor = document.createElement('a');
    anchor.setAttribute('href', 'http://example.com');
    anchor.setAttribute('data-prevent-progress', 'true');
    document.body.appendChild(anchor);

    renderHook(() => useAnchorProgress({ startPosition: 5, delay: 50 }, []));

    // Forcer une mutation pour attacher les écouteurs.
    const dummy = document.createElement('div');
    document.body.appendChild(dummy);
    document.body.removeChild(dummy);

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    anchor.dispatchEvent(clickEvent);

    expect(startMock).not.toHaveBeenCalled();
  });

  it('skips anchor click if the anchor target is _blank', () => {
    const anchor = document.createElement('a');
    anchor.setAttribute('href', 'http://example.com');
    anchor.setAttribute('target', '_blank');
    document.body.appendChild(anchor);

    renderHook(() => useAnchorProgress({ startPosition: 5, delay: 50 }, []));

    const dummy = document.createElement('div');
    document.body.appendChild(dummy);
    document.body.removeChild(dummy);

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    anchor.dispatchEvent(clickEvent);

    expect(startMock).not.toHaveBeenCalled();
  });

  it('skips anchor click if a meta key is pressed', () => {
    const anchor = document.createElement('a');
    anchor.setAttribute('href', 'http://example.com');
    document.body.appendChild(anchor);

    renderHook(() => useAnchorProgress({ startPosition: 5, delay: 50 }, []));

    const dummy = document.createElement('div');
    document.body.appendChild(dummy);
    document.body.removeChild(dummy);

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      metaKey: true,
    });
    anchor.dispatchEvent(clickEvent);

    expect(startMock).not.toHaveBeenCalled();
  });

  it('calls stop when window.history.pushState is invoked', () => {
    // Save the original pushState.
    const originalPushState = window.history.pushState;
    renderHook(() =>
      useAnchorProgress({ stopDelay: 300, forcedStopDelay: 100 }, []),
    );

    act(() => {
      window.history.pushState({}, '', '/new-url');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(stopMock).toHaveBeenCalled();

    // Restore original pushState.
    window.history.pushState = originalPushState;
  });

  it('cleans up event listeners and timers on unmount', async () => {
    // Create an anchor element and spy on removeEventListener.
    const anchor = document.createElement('a');
    anchor.setAttribute('href', 'http://example.com');
    document.body.appendChild(anchor);
    const removeSpy = jest.spyOn(anchor, 'removeEventListener');

    const { unmount } = renderHook(() =>
      useAnchorProgress({ startPosition: 5, delay: 50 }, []),
    );

    // Force a DOM mutation so that the MutationObserver attaches the listener.
    const dummy = document.createElement('div');
    document.body.appendChild(dummy);
    document.body.removeChild(dummy);

    // Flush microtasks to allow the MutationObserver callback to run.
    await act(async () => {
      await Promise.resolve();
    });

    // Unmount the hook so that cleanup is executed.
    unmount();

    // Flush microtasks again to allow the cleanup effect to run.
    await act(async () => {
      await Promise.resolve();
    });

    // Also run pending timers.
    act(() => {
      jest.runOnlyPendingTimers();
    });

    // Verify that removeEventListener was called on the anchor.
    expect(removeSpy).toHaveBeenCalled();

    expect(stopMock).not.toHaveBeenCalled();

    removeSpy.mockRestore();
  });
});
