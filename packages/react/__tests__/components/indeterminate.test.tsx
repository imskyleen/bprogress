import React, { createRef } from 'react';
import { render } from '@testing-library/react';
import { Indeterminate } from '../../src/components/indeterminate';

describe('Indeterminate Component', () => {
  it('renders without crashing and defaults to a <div>', () => {
    const { container } = render(<Indeterminate />);
    const indeterminateElement = container.firstChild as HTMLElement;
    expect(indeterminateElement).toBeInTheDocument();
    expect(indeterminateElement.nodeName).toBe('DIV');
  });

  it('renders fixed children (inc and dec)', () => {
    const { container } = render(<Indeterminate />);
    const indeterminateElement = container.firstChild as HTMLElement;
    const incElement = indeterminateElement.querySelector('.inc');
    const decElement = indeterminateElement.querySelector('.dec');
    expect(incElement).toBeInTheDocument();
    expect(decElement).toBeInTheDocument();
  });

  it('applies the default class "indeterminate"', () => {
    const { container } = render(<Indeterminate />);
    const indeterminateElement = container.firstChild as HTMLElement;
    expect(indeterminateElement).toHaveClass('indeterminate');
  });

  it('renders as a different element when the "as" prop is provided', () => {
    const { container } = render(<Indeterminate as="span" />);
    const indeterminateElement = container.firstChild as HTMLElement;
    expect(indeterminateElement.nodeName).toBe('SPAN');
  });

  it('applies custom class names', () => {
    const { container } = render(<Indeterminate className="custom-class" />);
    const indeterminateElement = container.firstChild as HTMLElement;
    expect(indeterminateElement).toHaveClass('indeterminate');
    expect(indeterminateElement).toHaveClass('custom-class');
  });

  it('passes additional props to the rendered element', () => {
    const { container } = render(
      <Indeterminate id="test-id" data-testid="indeterminate-element" />,
    );
    const indeterminateElement = container.firstChild as HTMLElement;
    expect(indeterminateElement).toHaveAttribute('id', 'test-id');
    expect(indeterminateElement).toHaveAttribute(
      'data-testid',
      'indeterminate-element',
    );
  });

  it('forwards the ref correctly to the DOM element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Indeterminate ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.nodeName).toBe('DIV');
  });
});
