import React, { createRef } from 'react';
import { render } from '@testing-library/react';
import { Bar } from '../../src/components/bar';

describe('Bar Component', () => {
  it('renders without crashing and defaults to a <div>', () => {
    const { container } = render(<Bar />);
    const barElement = container.firstChild as HTMLElement;
    expect(barElement).toBeInTheDocument();
    // The default element should be a <div>
    expect(barElement.nodeName).toBe('DIV');
  });

  it('renders children properly', () => {
    const text = 'Test content';
    const { getByText } = render(<Bar>{text}</Bar>);
    expect(getByText(text)).toBeInTheDocument();
  });

  it('applies the default role "bar"', () => {
    const { container } = render(<Bar />);
    const barElement = container.firstChild as HTMLElement;
    expect(barElement).toHaveAttribute('role', 'bar');
  });

  it('renders as a different element when the "as" prop is provided', () => {
    const { container } = render(<Bar as="span">Content</Bar>);
    const barElement = container.firstChild as HTMLElement;
    // When "as" is set to "span", the element should be a <span>
    expect(barElement.nodeName).toBe('SPAN');
  });

  it('applies custom class names', () => {
    // Assuming classNames function appends the default "classSelector" and the custom class
    const { container } = render(<Bar className="custom-class" />);
    const barElement = container.firstChild as HTMLElement;
    // The default class (classSelector) should be present
    expect(barElement).toHaveClass('bar');
    // The custom class should also be present
    expect(barElement).toHaveClass('custom-class');
  });

  it('passes additional props to the rendered element', () => {
    const { container } = render(
      <Bar id="test-id" data-testid="bar-element">
        Test
      </Bar>,
    );
    const barElement = container.firstChild as HTMLElement;
    expect(barElement).toHaveAttribute('id', 'test-id');
    expect(barElement).toHaveAttribute('data-testid', 'bar-element');
  });

  it('forwards the ref correctly to the DOM element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Bar ref={ref}>Test ref</Bar>);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.nodeName).toBe('DIV');
  });
});
