import React, { createRef } from 'react';
import { render } from '@testing-library/react';
import { Progress } from '../../src/components/progress';

describe('Progress Component', () => {
  it('renders without crashing and defaults to a <div>', () => {
    const { container } = render(<Progress />);
    const progressElement = container.firstChild as HTMLElement;
    expect(progressElement).toBeInTheDocument();
    // The default element should be a <div>
    expect(progressElement.nodeName).toBe('DIV');
  });

  it('renders children properly', () => {
    const text = 'Custom Progress Content';
    const { getByText } = render(<Progress>{text}</Progress>);
    expect(getByText(text)).toBeInTheDocument();
  });

  it('renders as a different element when the "as" prop is provided', () => {
    const { container } = render(<Progress as="section">Content</Progress>);
    const progressElement = container.firstChild as HTMLElement;
    // When "as" is set to "section", the element should be a <section>
    expect(progressElement.nodeName).toBe('SECTION');
  });

  it('applies custom class names', () => {
    // Assuming classNames function appends the default "bprogress" and the custom class
    const { container } = render(<Progress className="custom-class" />);
    const progressElement = container.firstChild as HTMLElement;
    // The default class should be present
    expect(progressElement).toHaveClass('bprogress');
    // The custom class should also be present
    expect(progressElement).toHaveClass('custom-class');
  });

  it('applies inline styles and defaults display to none', () => {
    const { container } = render(<Progress style={{ color: 'red' }} />);
    const progressElement = container.firstChild as HTMLElement;
    expect(progressElement).toHaveStyle('display: none');
    expect(progressElement).toHaveStyle('color: red');
  });

  it('renders default child components (Bar, Peg, Spinner, SpinnerIcon) if no children are provided', () => {
    const { container } = render(<Progress />);
    expect(container.querySelector('div.bprogress')).toBeInTheDocument();
    expect(container.querySelector('div.bar')).toBeInTheDocument();
    expect(container.querySelector('div.peg')).toBeInTheDocument();
    expect(container.querySelector('div.spinner')).toBeInTheDocument();
    expect(container.querySelector('div.spinner-icon')).toBeInTheDocument();
  });

  it('does not render default children if custom children are provided', () => {
    const { container } = render(<Progress>Custom Content</Progress>);
    expect(container.querySelector('div.bar')).not.toBeInTheDocument();
    expect(container.querySelector('div.peg')).not.toBeInTheDocument();
    expect(container.querySelector('div.spinner')).not.toBeInTheDocument();
    expect(container.querySelector('div.spinner-icon')).not.toBeInTheDocument();
  });

  it('passes additional props to the rendered element', () => {
    const { container } = render(
      <Progress id="test-id" data-testid="progress-element">
        Test
      </Progress>,
    );
    const progressElement = container.firstChild as HTMLElement;
    expect(progressElement).toHaveAttribute('id', 'test-id');
    expect(progressElement).toHaveAttribute('data-testid', 'progress-element');
  });

  it('forwards the ref correctly to the DOM element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Progress ref={ref}>Test ref</Progress>);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.nodeName).toBe('DIV');
  });
});
