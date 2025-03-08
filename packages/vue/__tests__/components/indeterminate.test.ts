import { render } from '@testing-library/vue';
import { ref } from 'vue';
import Indeterminate from '../../src/components/indeterminate.vue';

describe('Indeterminate Component', () => {
  it('renders without crashing and defaults to a <div>', () => {
    const { container } = render(Indeterminate);
    const indeterminateElement = container.firstElementChild as HTMLElement;
    expect(indeterminateElement).toBeInTheDocument();
    expect(indeterminateElement.tagName).toBe('DIV');
  });

  it('renders fixed children with classes "inc" and "dec"', () => {
    const { container } = render(Indeterminate);
    const indeterminateElement = container.firstElementChild as HTMLElement;
    const incElement = indeterminateElement.querySelector('.inc');
    const decElement = indeterminateElement.querySelector('.dec');
    expect(incElement).toBeInTheDocument();
    expect(decElement).toBeInTheDocument();
  });

  it('applies the default class "indeterminate"', () => {
    const { container } = render(Indeterminate);
    const indeterminateElement = container.firstElementChild as HTMLElement;
    expect(indeterminateElement.classList).toContain('indeterminate');
  });

  it('renders as a different element when the "is" prop is provided', () => {
    const { container } = render(Indeterminate, {
      props: { is: 'span' },
    });
    const indeterminateElement = container.firstElementChild as HTMLElement;
    expect(indeterminateElement.tagName).toBe('SPAN');
  });

  it('applies custom class names', () => {
    const { container } = render(Indeterminate, {
      props: { class: 'custom-class' },
    });
    const indeterminateElement = container.firstElementChild as HTMLElement;
    expect(indeterminateElement.classList).toContain('indeterminate');
    expect(indeterminateElement.classList).toContain('custom-class');
  });

  it('passes additional attributes to the rendered element', () => {
    const { container } = render(Indeterminate, {
      attrs: {
        id: 'test-id',
        'data-testid': 'indeterminate-element',
      },
    });
    const indeterminateElement = container.firstElementChild as HTMLElement;
    expect(indeterminateElement.getAttribute('id')).toBe('test-id');
    expect(indeterminateElement.getAttribute('data-testid')).toBe(
      'indeterminate-element',
    );
  });

  it('forwards the ref correctly to the DOM element', async () => {
    const myRef = ref<any>(null);
    const Wrapper = {
      components: { Indeterminate },
      setup() {
        return { myRef };
      },
      template: `<Indeterminate ref="myRef" />`,
    };
    render(Wrapper);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(myRef.value).not.toBeNull();
    expect(myRef.value.$el.tagName).toBe('DIV');
  });
});
