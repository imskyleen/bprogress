import React from 'react';
import { render } from '@testing-library/react';
import { shallowCompareProps, withMemo } from '../../src/utils/with-memo';

// Global render counter to track the number of renders of the Dummy component
let renderCount = 0;

// Dummy component that increments renderCount each time it renders
const Dummy: React.FC<{
  text: string;
  memo?: boolean;
  shouldCompareComplexProps?: boolean;
  extra?: string;
}> = ({ text }) => {
  renderCount++;
  return <div>{text}</div>;
};

// Create a memoized component using the withMemo HOC
const WrappedDummy = withMemo(Dummy);

describe('shallowCompareProps', () => {
  test('returns true for identical props', () => {
    const props1 = { a: 1, b: 'test' };
    const props2 = { a: 1, b: 'test' };
    expect(shallowCompareProps(props1, props2)).toBe(true);
  });

  test('returns false if a prop value differs', () => {
    const props1 = { a: 1, b: 'test' };
    const props2 = { a: 2, b: 'test' };
    expect(shallowCompareProps(props1, props2)).toBe(false);
  });

  test('ignores specified keys', () => {
    const props1 = { a: 1, b: 'test', ignoreMe: 'foo' };
    const props2 = { a: 1, b: 'test', ignoreMe: 'bar' };
    expect(shallowCompareProps(props1, props2, ['ignoreMe'])).toBe(true);
  });

  test('returns false if number of keys (excluding ignored keys) differs', () => {
    const props1 = { a: 1, b: 'test' };
    const props2 = { a: 1, b: 'test', c: true };
    expect(shallowCompareProps(props1, props2)).toBe(false);
  });
});

describe('withMemo', () => {
  beforeEach(() => {
    // Reset render count before each test
    renderCount = 0;
  });

  test('renders the component initially', () => {
    render(<WrappedDummy text="hello" shouldCompareComplexProps={true} />);
    // The Dummy component should render at least once on mount
    expect(renderCount).toBe(1);
  });

  test('does not re-render if props are identical and shouldCompareComplexProps is true', () => {
    const { rerender } = render(
      <WrappedDummy text="hello" shouldCompareComplexProps={true} />,
    );
    expect(renderCount).toBe(1);
    // Re-render with the same props
    rerender(<WrappedDummy text="hello" shouldCompareComplexProps={true} />);
    expect(renderCount).toBe(1);
  });

  test('re-renders if a prop changes when shouldCompareComplexProps is true', () => {
    const { rerender } = render(
      <WrappedDummy text="hello" shouldCompareComplexProps={true} />,
    );
    expect(renderCount).toBe(1);
    // Update the prop 'text' which should trigger a re-render
    rerender(<WrappedDummy text="world" shouldCompareComplexProps={true} />);
    expect(renderCount).toBe(2);
  });

  test('never re-renders if shouldCompareComplexProps is false', () => {
    const { rerender } = render(
      <WrappedDummy text="hello" shouldCompareComplexProps={false} />,
    );
    expect(renderCount).toBe(1);
    // Even if props change, no re-render should occur
    rerender(<WrappedDummy text="world" shouldCompareComplexProps={false} />);
    expect(renderCount).toBe(1);
  });

  test('forces re-render if the prop memo is explicitly false', () => {
    const { rerender } = render(
      <WrappedDummy text="hello" shouldCompareComplexProps={true} />,
    );
    expect(renderCount).toBe(1);
    // Explicitly setting memo to false forces a re-render
    rerender(
      <WrappedDummy
        text="hello"
        shouldCompareComplexProps={true}
        memo={false}
      />,
    );
    expect(renderCount).toBe(2);
  });

  test('ignores default keys (memo and shouldCompareComplexProps) changes', () => {
    const { rerender } = render(
      <WrappedDummy
        text="hello"
        shouldCompareComplexProps={true}
        memo={true}
      />,
    );
    expect(renderCount).toBe(1);
    // Changing memo from true to true should be ignored by the HOC
    rerender(
      <WrappedDummy
        text="hello"
        shouldCompareComplexProps={true}
        memo={true}
      />,
    );
    expect(renderCount).toBe(1);
  });

  test('ignores changes in a custom key specified via ignoreKeys', () => {
    // Create a memoized component with custom ignoreKeys including "extra"
    const WrappedDummyWithIgnoreExtra = withMemo(Dummy, [
      'memo',
      'shouldCompareComplexProps',
      'extra',
    ]);
    const { rerender } = render(
      <WrappedDummyWithIgnoreExtra
        text="hello"
        shouldCompareComplexProps={true}
        extra="foo"
      />,
    );
    expect(renderCount).toBe(1);
    // Updating only the "extra" prop (which is ignored) should not cause a re-render
    rerender(
      <WrappedDummyWithIgnoreExtra
        text="hello"
        shouldCompareComplexProps={true}
        extra="bar"
      />,
    );
    expect(renderCount).toBe(1);
  });

  test('re-renders if a non-ignored prop changes with default ignoreKeys', () => {
    const { rerender } = render(
      <WrappedDummy
        text="hello"
        shouldCompareComplexProps={true}
        extra="foo"
      />,
    );
    expect(renderCount).toBe(1);
    // Updating "extra" which is not ignored by default should trigger a re-render
    rerender(
      <WrappedDummy
        text="hello"
        shouldCompareComplexProps={true}
        extra="bar"
      />,
    );
    expect(renderCount).toBe(2);
  });
});
