import React, { createRef } from 'react';
import { render } from '@testing-library/react';
import { Spinner } from '../../src/components/spinner';

describe('Spinner Component', () => {
  it('renders without crashing and defaults to a <div>', () => {
    const { container } = render(<Spinner />);
    const spinnerElement = container.firstChild as HTMLElement;
    expect(spinnerElement).toBeInTheDocument();
    // The default element should be a <div>
    expect(spinnerElement.nodeName).toBe('DIV');
  });

  it('renders children properly', () => {
    const text = 'Loading...';
    const { getByText } = render(<Spinner>{text}</Spinner>);
    expect(getByText(text)).toBeInTheDocument();
  });

  it('applies the default role "spinner"', () => {
    const { container } = render(<Spinner />);
    const spinnerElement = container.firstChild as HTMLElement;
    expect(spinnerElement).toHaveAttribute('role', 'spinner');
  });

  it('renders as a different element when the "as" prop is provided', () => {
    const { container } = render(<Spinner as="span">Content</Spinner>);
    const spinnerElement = container.firstChild as HTMLElement;
    // When "as" is set to "span", the element should be a <span>
    expect(spinnerElement.nodeName).toBe('SPAN');
  });

  it('applies custom class names', () => {
    // Assuming classNames function appends the default "classSelector" and the custom class
    const { container } = render(<Spinner className="custom-class" />);
    const spinnerElement = container.firstChild as HTMLElement;
    // The default class (classSelector) should be present
    expect(spinnerElement).toHaveClass('spinner');
    // The custom class should also be present
    expect(spinnerElement).toHaveClass('custom-class');
  });

  it('passes additional props to the rendered element', () => {
    const { container } = render(
      <Spinner id="test-id" data-testid="spinner-element">
        Test
      </Spinner>,
    );
    const spinnerElement = container.firstChild as HTMLElement;
    expect(spinnerElement).toHaveAttribute('id', 'test-id');
    expect(spinnerElement).toHaveAttribute('data-testid', 'spinner-element');
  });

  it('forwards the ref correctly to the DOM element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Spinner ref={ref}>Test ref</Spinner>);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.nodeName).toBe('DIV');
  });
});
