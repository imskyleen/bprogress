import React, { createRef } from 'react';
import { render } from '@testing-library/react';
import { SpinnerIcon } from '../../src/components/spinner-icon';

describe('SpinnerIcon Component', () => {
  it('renders without crashing and defaults to a <div>', () => {
    const { container } = render(<SpinnerIcon />);
    const spinnerIconElement = container.firstChild as HTMLElement;
    expect(spinnerIconElement).toBeInTheDocument();
    // The default element should be a <div>
    expect(spinnerIconElement.nodeName).toBe('DIV');
  });

  it('renders children properly', () => {
    const text = 'Loading icon';
    const { getByText } = render(<SpinnerIcon>{text}</SpinnerIcon>);
    expect(getByText(text)).toBeInTheDocument();
  });

  it('renders as a different element when the "as" prop is provided', () => {
    const { container } = render(<SpinnerIcon as="span">Content</SpinnerIcon>);
    const spinnerIconElement = container.firstChild as HTMLElement;
    // When "as" is set to "span", the element should be a <span>
    expect(spinnerIconElement.nodeName).toBe('SPAN');
  });

  it('applies custom class names', () => {
    // Assuming classNames function appends the default "classSelector" and the custom class
    const { container } = render(<SpinnerIcon className="custom-class" />);
    const spinnerIconElement = container.firstChild as HTMLElement;
    // The default class (classSelector) should be present
    expect(spinnerIconElement).toHaveClass('spinner-icon');
    // The custom class should also be present
    expect(spinnerIconElement).toHaveClass('custom-class');
  });

  it('passes additional props to the rendered element', () => {
    const { container } = render(
      <SpinnerIcon id="test-id" data-testid="spinner-icon-element">
        Test
      </SpinnerIcon>,
    );
    const spinnerIconElement = container.firstChild as HTMLElement;
    expect(spinnerIconElement).toHaveAttribute('id', 'test-id');
    expect(spinnerIconElement).toHaveAttribute(
      'data-testid',
      'spinner-icon-element',
    );
  });

  it('forwards the ref correctly to the DOM element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<SpinnerIcon ref={ref}>Test ref</SpinnerIcon>);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.nodeName).toBe('DIV');
  });
});
