import { render } from '@testing-library/vue';
import { ref } from 'vue';
import SpinnerIcon from '../../src/components/spinner-icon.vue';

describe('SpinnerIcon Component', () => {
  it('renders without crashing and defaults to a <div>', () => {
    const { container } = render(SpinnerIcon);
    const spinnerIconElement = container.firstElementChild as HTMLElement;
    expect(spinnerIconElement).toBeInTheDocument();
    expect(spinnerIconElement.tagName).toBe('DIV');
  });

  it('renders children properly', () => {
    const customContent = 'Loading icon';
    const { getByText } = render(SpinnerIcon, {
      slots: { default: customContent },
    });
    expect(getByText(customContent)).toBeInTheDocument();
  });

  it('renders as a different element when the "as" prop is provided', () => {
    const { container } = render(SpinnerIcon, {
      props: { is: 'span' },
      slots: { default: 'Content' },
    });
    const spinnerIconElement = container.firstElementChild as HTMLElement;
    expect(spinnerIconElement.tagName).toBe('SPAN');
  });

  it('applies custom class names', () => {
    const { container } = render(SpinnerIcon, {
      props: { class: 'custom-class' },
    });
    const spinnerIconElement = container.firstElementChild as HTMLElement;
    expect(spinnerIconElement.classList).toContain('spinner-icon');
    expect(spinnerIconElement.classList).toContain('custom-class');
  });

  it('passes additional attributes to the rendered element', () => {
    const { container } = render(SpinnerIcon, {
      attrs: {
        id: 'test-id',
        'data-testid': 'spinner-icon-element',
      },
      slots: { default: 'Test' },
    });
    const spinnerIconElement = container.firstElementChild as HTMLElement;
    expect(spinnerIconElement.getAttribute('id')).toBe('test-id');
    expect(spinnerIconElement.getAttribute('data-testid')).toBe(
      'spinner-icon-element',
    );
  });

  it('forwards the ref correctly to the DOM element', async () => {
    const myRef = ref<any>(null);
    const Wrapper = {
      components: { SpinnerIcon },
      setup() {
        return { myRef };
      },
      template: `<SpinnerIcon ref="myRef">Ref Test</SpinnerIcon>`,
    } as any;
    render(Wrapper);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(myRef.value).not.toBeNull();
    expect(myRef.value.$el.tagName).toBe('DIV');
  });
});
