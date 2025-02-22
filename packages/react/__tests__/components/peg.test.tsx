import React, { createRef } from 'react';
import { render } from '@testing-library/react';
import { Peg } from '../../src/components/peg';

describe('Peg Component', () => {
  it('renders without crashing and defaults to a <div>', () => {
    const { container } = render(<Peg />);
    const pegElement = container.firstChild as HTMLElement;
    expect(pegElement).toBeInTheDocument();
    // The default element should be a <div>
    expect(pegElement.nodeName).toBe('DIV');
  });

  it('renders children properly', () => {
    const text = 'Test content';
    const { getByText } = render(<Peg>{text}</Peg>);
    expect(getByText(text)).toBeInTheDocument();
  });

  it('renders as a different element when the "as" prop is provided', () => {
    const { container } = render(<Peg as="span">Content</Peg>);
    const pegElement = container.firstChild as HTMLElement;
    // When "as" is set to "span", the element should be a <span>
    expect(pegElement.nodeName).toBe('SPAN');
  });

  it('applies custom class names', () => {
    // Assuming classNames function appends the default "classSelector" and the custom class
    const { container } = render(<Peg className="custom-class" />);
    const pegElement = container.firstChild as HTMLElement;
    // The default class (classSelector) should be present
    expect(pegElement).toHaveClass('peg');
    // The custom class should also be present
    expect(pegElement).toHaveClass('custom-class');
  });

  it('passes additional props to the rendered element', () => {
    const { container } = render(
      <Peg id="test-id" data-testid="peg-element">
        Test
      </Peg>,
    );
    const pegElement = container.firstChild as HTMLElement;
    expect(pegElement).toHaveAttribute('id', 'test-id');
    expect(pegElement).toHaveAttribute('data-testid', 'peg-element');
  });

  it('forwards the ref correctly to the DOM element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Peg ref={ref}>Test ref</Peg>);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.nodeName).toBe('DIV');
  });
});
