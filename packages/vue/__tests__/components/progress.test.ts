import { render } from '@testing-library/vue';
import { ref } from 'vue';
import Progress from '../../src/components/progress.vue';

describe('Progress Component', () => {
  it('renders without crashing and defaults to a <div>', () => {
    const { container } = render(Progress);
    const progressElement = container.firstElementChild as HTMLElement;
    expect(progressElement).toBeInTheDocument();
    expect(progressElement.tagName).toBe('DIV');
  });

  it('renders children properly', () => {
    const customContent = 'Custom Progress Content';
    const { getByText } = render(Progress, {
      slots: { default: customContent },
    });
    expect(getByText(customContent)).toBeInTheDocument();
  });

  it('renders as a different element when the "as" prop is provided', () => {
    const { container } = render(Progress, {
      props: { is: 'section' },
      slots: { default: 'Content' },
    });
    const progressElement = container.firstElementChild as HTMLElement;
    expect(progressElement.tagName).toBe('SECTION');
  });

  it('applies custom class names', () => {
    const { container } = render(Progress, {
      props: { class: 'custom-class' },
    });
    const progressElement = container.firstElementChild as HTMLElement;
    expect(progressElement.classList).toContain('bprogress');
    expect(progressElement.classList).toContain('custom-class');
  });

  it('applies inline styles and defaults display to none (string style)', () => {
    const { container } = render(Progress, {
      props: { style: 'color: red' },
    });
    const progressElement = container.firstElementChild as HTMLElement;
    expect(progressElement.getAttribute('style')).toContain('color: red');
    expect(progressElement.getAttribute('style')).toContain('display: none');
  });

  it('applies inline styles and defaults display to none (object style)', () => {
    const { container } = render(Progress, {
      props: { style: { color: 'blue' } },
    });
    const progressElement = container.firstElementChild as HTMLElement;
    expect(progressElement.style.color).toBe('blue');
    expect(progressElement.style.display).toBe('none');
  });

  it('renders default child components (Bar, Peg, Spinner, SpinnerIcon) if no children are provided', () => {
    const { container } = render(Progress);
    const barEl = container.querySelector('.bar');
    const pegEl = container.querySelector('.peg');
    const spinnerEl = container.querySelector('.spinner');
    const spinnerIconEl = container.querySelector('.spinner-icon');
    expect(barEl).toBeInTheDocument();
    expect(pegEl).toBeInTheDocument();
    expect(spinnerEl).toBeInTheDocument();
    expect(spinnerIconEl).toBeInTheDocument();
  });

  it('does not render default children if custom children are provided', () => {
    const { container } = render(Progress, {
      slots: { default: '<span>Custom Content</span>' },
    });
    expect(container.querySelector('.bar')).not.toBeInTheDocument();
    expect(container.querySelector('.peg')).not.toBeInTheDocument();
    expect(container.querySelector('.spinner')).not.toBeInTheDocument();
    expect(container.querySelector('.spinner-icon')).not.toBeInTheDocument();
    expect(container.querySelector('span')).toHaveTextContent('Custom Content');
  });

  it('passes additional attributes to the rendered element', () => {
    const { container } = render(Progress, {
      attrs: {
        id: 'test-id',
        'data-testid': 'progress-element',
      },
    });
    const progressElement = container.firstElementChild as HTMLElement;
    expect(progressElement.getAttribute('id')).toBe('test-id');
    expect(progressElement.getAttribute('data-testid')).toBe(
      'progress-element',
    );
  });

  it('forwards the ref correctly to the DOM element', async () => {
    const myRef = ref<any>(null);
    const Wrapper = {
      components: { Progress },
      setup() {
        return { myRef };
      },
      template: `<Progress ref="myRef">Ref Test</Progress>`,
    } as any;
    render(Wrapper);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(myRef.value).not.toBeNull();
    expect(myRef.value.$el.tagName).toBe('DIV');
  });
});
