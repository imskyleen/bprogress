import { render } from '@testing-library/vue';
import { ref } from 'vue';
import Bar from '../../src/components/bar.vue';

describe('Bar Component', () => {
  it('renders without crashing and defaults to a <div>', () => {
    const { container } = render(Bar);
    const barElement = container.firstElementChild as HTMLElement;
    expect(barElement).toBeInTheDocument();
    expect(barElement.tagName).toBe('DIV');
  });

  it('renders children properly', () => {
    const customContent = 'Test content';
    const { getByText } = render(Bar, {
      slots: { default: customContent },
    });
    expect(getByText(customContent)).toBeInTheDocument();
  });

  it('applies the default class "bar"', () => {
    const { container } = render(Bar);
    const barElement = container.firstElementChild as HTMLElement;
    expect(barElement.classList).toContain('bar');
  });

  it('renders as a different element when the "as" prop is provided', () => {
    const { container } = render(Bar, {
      props: { is: 'span' },
      slots: { default: 'Content' },
    });
    const barElement = container.firstElementChild as HTMLElement;
    expect(barElement.tagName).toBe('SPAN');
  });

  it('applies custom class names', () => {
    const { container } = render(Bar, {
      props: { class: 'custom-class' },
    });
    const barElement = container.firstElementChild as HTMLElement;
    expect(barElement.classList).toContain('bar');
    expect(barElement.classList).toContain('custom-class');
  });

  it('passes additional attributes to the rendered element', () => {
    const { container } = render(Bar, {
      attrs: {
        id: 'test-id',
        'data-testid': 'bar-element',
      },
      slots: { default: 'Test' },
    });
    const barElement = container.firstElementChild as HTMLElement;
    expect(barElement.getAttribute('id')).toBe('test-id');
    expect(barElement.getAttribute('data-testid')).toBe('bar-element');
  });

  it('forwards the ref correctly to the DOM element', async () => {
    const myRef = ref<any>(null);
    const Wrapper = {
      components: { Bar },
      setup() {
        return { myRef };
      },
      template: `<Bar ref="myRef">Ref Test</Bar>`,
    } as any;
    render(Wrapper);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(myRef.value).not.toBeNull();
    expect(myRef.value.$el.tagName).toBe('DIV');
  });
});
