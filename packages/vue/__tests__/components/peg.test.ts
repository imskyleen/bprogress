import { render } from '@testing-library/vue';
import { ref } from 'vue';
import Peg from '../../src/components/peg.vue';

describe('Peg Component', () => {
  it('renders without crashing and defaults to a <div>', () => {
    const { container } = render(Peg);
    const pegElement = container.firstElementChild as HTMLElement;
    expect(pegElement).toBeInTheDocument();
    expect(pegElement.tagName).toBe('DIV');
  });

  it('renders children properly', () => {
    const customContent = 'Test content';
    const { getByText } = render(Peg, {
      slots: { default: customContent },
    });
    expect(getByText(customContent)).toBeInTheDocument();
  });

  it('renders as a different element when the "as" prop is provided', () => {
    const { container } = render(Peg, {
      props: { is: 'span' },
      slots: { default: 'Content' },
    });
    const pegElement = container.firstElementChild as HTMLElement;
    expect(pegElement.tagName).toBe('SPAN');
  });

  it('applies custom class names', () => {
    const { container } = render(Peg, {
      props: { class: 'custom-class' },
    });
    const pegElement = container.firstElementChild as HTMLElement;
    expect(pegElement.classList).toContain('peg');
    expect(pegElement.classList).toContain('custom-class');
  });

  it('passes additional attributes to the rendered element', () => {
    const { container } = render(Peg, {
      attrs: {
        id: 'test-id',
        'data-testid': 'peg-element',
      },
      slots: { default: 'Test' },
    });
    const pegElement = container.firstElementChild as HTMLElement;
    expect(pegElement.getAttribute('id')).toBe('test-id');
    expect(pegElement.getAttribute('data-testid')).toBe('peg-element');
  });

  it('forwards the ref correctly to the DOM element', async () => {
    const myRef = ref<any>(null);
    const Wrapper = {
      components: { Peg },
      setup() {
        return { myRef };
      },
      template: `<Peg ref="myRef">Ref Test</Peg>`,
    } as any;
    render(Wrapper);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(myRef.value).not.toBeNull();
    expect(myRef.value.$el.tagName).toBe('DIV');
  });
});
