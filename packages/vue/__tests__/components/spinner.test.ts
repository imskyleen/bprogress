import { render } from '@testing-library/vue';
import { ref } from 'vue';
import Spinner from '../../src/components/spinner.vue';

describe('Spinner Component', () => {
  it('renders without crashing and defaults to a <div>', () => {
    const { container } = render(Spinner);
    const spinnerElement = container.firstElementChild as HTMLElement;
    expect(spinnerElement).toBeInTheDocument();
    expect(spinnerElement.tagName).toBe('DIV');
  });

  it('renders children properly', () => {
    const customContent = 'Loading...';
    const { getByText } = render(Spinner, {
      slots: { default: customContent },
    });
    expect(getByText(customContent)).toBeInTheDocument();
  });

  it('applies the default class "spinner"', () => {
    const { container } = render(Spinner);
    const spinnerElement = container.firstElementChild as HTMLElement;
    expect(spinnerElement.classList).toContain('spinner');
  });

  it('renders as a different element when the "as" prop is provided', () => {
    const { container } = render(Spinner, {
      props: { is: 'span' },
      slots: { default: 'Content' },
    });
    const spinnerElement = container.firstElementChild as HTMLElement;
    expect(spinnerElement.tagName).toBe('SPAN');
  });

  it('applies custom class names', () => {
    const { container } = render(Spinner, {
      props: { class: 'custom-class' },
    });
    const spinnerElement = container.firstElementChild as HTMLElement;
    expect(spinnerElement.classList).toContain('spinner');
    expect(spinnerElement.classList).toContain('custom-class');
  });

  it('passes additional attributes to the rendered element', () => {
    const { container } = render(Spinner, {
      attrs: {
        id: 'test-id',
        'data-testid': 'spinner-element',
      },
      slots: { default: 'Test' },
    });
    const spinnerElement = container.firstElementChild as HTMLElement;
    expect(spinnerElement.getAttribute('id')).toBe('test-id');
    expect(spinnerElement.getAttribute('data-testid')).toBe('spinner-element');
  });

  it('forwards the ref correctly to the DOM element', async () => {
    const myRef = ref<any>(null);
    const Wrapper = {
      components: { Spinner },
      setup() {
        return { myRef };
      },
      template: `<Spinner ref="myRef">Ref Test</Spinner>`,
    } as any;
    render(Wrapper);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(myRef.value).not.toBeNull();
    expect(myRef.value.$el.tagName).toBe('DIV');
  });
});
