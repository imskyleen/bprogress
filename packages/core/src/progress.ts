import { BProgressOptions } from './types';
import {
  clamp,
  toBarPerc,
  toCss,
  addClass,
  removeClass,
  removeElement,
} from './utils';

export class BProgress {
  static settings: Required<BProgressOptions> = {
    minimum: 0.08,
    maximum: 1,
    // If template is null, the user can insert their own template in the DOM.
    template: `<div class="bar"><div class="peg"></div></div>
               <div class="spinner"><div class="spinner-icon"></div></div>`,
    easing: 'linear',
    positionUsing: '',
    speed: 200,
    trickle: true,
    trickleSpeed: 200,
    showSpinner: true,
    barSelector: '.bar',
    spinnerSelector: '.spinner',
    parent: 'body',
    direction: 'ltr',
  };
  static status: number | null = null;

  // Queue for animation functions
  private static pending: Array<(next: () => void) => void> = [];
  private static isPaused: boolean = false;

  // Configure BProgress with new options
  static configure(options: Partial<BProgressOptions>): typeof BProgress {
    Object.assign(this.settings, options);
    return this;
  }

  // Check if BProgress has started
  static isStarted(): boolean {
    return typeof this.status === 'number';
  }

  /**
   * Set the progress status.
   * This method updates the progress status for every progress element present in the DOM.
   * If a template is provided, it will create a new progress element if one does not already exist.
   * If the template is null, it relies on user-inserted elements.
   */
  static set(n: number): typeof BProgress {
    if (this.isPaused) return this;

    const started = this.isStarted();
    // Clamp n between minimum and maximum
    n = clamp(n, this.settings.minimum, this.settings.maximum);
    // Reset status if maximum is reached
    this.status = n === this.settings.maximum ? null : n;

    const progressElements = this.render(!started);
    const speed = this.settings.speed;
    const ease = this.settings.easing;

    // Force repaint on each element
    progressElements.forEach((progress) => progress.offsetWidth);

    // Queue the animation function
    this.queue((next: () => void) => {
      // Animate the bar on all progress elements
      progressElements.forEach((progress) => {
        const bar = progress.querySelector(
          this.settings.barSelector,
        ) as HTMLElement;
        toCss(bar, this.barPositionCSS({ n, speed, ease }));
      });

      if (n === this.settings.maximum) {
        // When the bar reaches maximum, make it semi-transparent to indicate completion
        progressElements.forEach((progress) => {
          toCss(progress, { transition: 'none', opacity: '1' });
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          progress.offsetWidth; // Repaint
        });
        setTimeout(() => {
          progressElements.forEach((progress) => {
            toCss(progress, {
              transition: `all ${speed}ms ${ease}`,
              opacity: '0',
            });
          });
          setTimeout(() => {
            // Remove each progress element from the DOM
            progressElements.forEach((progress) => {
              this.remove(progress);
              if (this.settings.template === null) {
                toCss(progress, { transition: 'none', opacity: '1' });
              }
            });

            next();
          }, speed);
        }, speed);
      } else {
        setTimeout(next, speed);
      }
    });

    return this;
  }

  // Start the progress bar
  static start(): typeof BProgress {
    if (!this.status) this.set(0);

    const work = () => {
      if (this.isPaused) return;
      setTimeout(() => {
        if (!this.status) return;
        this.trickle();
        work();
      }, this.settings.trickleSpeed);
    };

    if (this.settings.trickle) work();

    return this;
  }

  // Complete the progress
  static done(force?: boolean): typeof BProgress {
    if (!force && !this.status) return this;
    return this.inc(0.3 + 0.5 * Math.random()).set(1);
  }

  // Increment the progress
  static inc(amount?: number): typeof BProgress {
    if (this.isPaused) return this;

    let n = this.status;

    if (!n) {
      return this.start();
    } else if (n > 1) {
      return this;
    } else {
      if (typeof amount !== 'number') {
        if (n >= 0 && n < 0.2) {
          amount = 0.1;
        } else if (n >= 0.2 && n < 0.5) {
          amount = 0.04;
        } else if (n >= 0.5 && n < 0.8) {
          amount = 0.02;
        } else if (n >= 0.8 && n < 0.99) {
          amount = 0.005;
        } else {
          amount = 0;
        }
      }
      n = clamp(n + amount, 0, 0.994);
      return this.set(n);
    }
  }

  // Advance the progress (trickle)
  static trickle(): typeof BProgress {
    if (this.isPaused) return this;
    return this.inc();
  }

  // Handle jQuery promises (for compatibility)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static promise($promise: any): typeof BProgress {
    if (!$promise || $promise.state() === 'resolved') {
      return this;
    }

    let initial = 0,
      current = 0;

    if (current === 0) {
      this.start();
    }

    initial++;
    current++;

    $promise.always(() => {
      current--;
      if (current === 0) {
        initial = 0;
        this.done();
      } else {
        this.set((initial - current) / initial);
      }
    });

    return this;
  }

  /**
   * Renders the BProgress component.
   * If a template is provided, it will create a progress element if none exists in the parent.
   * If the template is null, it relies on the user to insert their own elements marked with the "bprogress" class.
   */
  static render(fromStart: boolean = false): HTMLElement[] {
    const parent =
      typeof this.settings.parent === 'string'
        ? document.querySelector(this.settings.parent)
        : this.settings.parent;
    const progressElements: HTMLElement[] = parent
      ? Array.from((parent as HTMLElement).querySelectorAll('.bprogress'))
      : [];

    // If a template is provided and no progress element exists, create one.
    if (this.settings.template !== null && progressElements.length === 0) {
      addClass(document.documentElement, 'bprogress-busy');

      const progress = document.createElement('div');
      // Use a class instead of an id to allow multiple progress elements
      addClass(progress, 'bprogress');
      progress.innerHTML = this.settings.template;

      if (parent !== document.body) {
        addClass(parent as HTMLElement, 'bprogress-custom-parent');
      }

      (parent as HTMLElement).appendChild(progress);
      progressElements.push(progress);
    }

    // Common initialization logic for all progress elements
    progressElements.forEach((progress) => {
      // If using user-provided templates (template === null), ensure the element is visible
      if (this.settings.template === null) {
        progress.style.display = '';
      }
      addClass(document.documentElement, 'bprogress-busy');
      if (parent !== document.body) {
        addClass(parent as HTMLElement, 'bprogress-custom-parent');
      }
      const bar = progress.querySelector(
        this.settings.barSelector,
      ) as HTMLElement;
      const perc = fromStart
        ? toBarPerc(0, this.settings.direction)
        : toBarPerc(this.status || 0, this.settings.direction);
      toCss(
        bar,
        this.barPositionCSS({
          n: this.status || 0,
          speed: this.settings.speed,
          ease: this.settings.easing,
          perc,
        }),
      );

      if (this.settings.template === null) {
        // For user-provided templates, toggle the spinner's visibility
        const spinner = progress.querySelector(
          this.settings.spinnerSelector,
        ) as HTMLElement;
        if (spinner) {
          spinner.style.display = this.settings.showSpinner ? 'block' : 'none';
        }
      } else {
        // For internally provided templates, remove the spinner if showSpinner is false
        if (!this.settings.showSpinner) {
          const spinner = progress.querySelector(
            this.settings.spinnerSelector,
          ) as HTMLElement;
          if (spinner) removeElement(spinner);
        }
      }
    });

    return progressElements;
  }

  /**
   * Remove the progress element from the DOM.
   * If a progress element is provided, only that element is removed;
   * otherwise, all progress elements and associated classes are removed.
   * For user-provided templates (when settings.template === null), the element
   * is hidden instead of being removed.
   */
  static remove(progressElement?: HTMLElement): void {
    if (progressElement) {
      if (this.settings.template === null) {
        // For user-provided templates, hide the element instead of removing it.
        progressElement.style.display = 'none';
      } else {
        removeElement(progressElement);
      }
    } else {
      removeClass(document.documentElement, 'bprogress-busy');
      const parent =
        typeof this.settings.parent === 'string'
          ? document.querySelectorAll(this.settings.parent)
          : [this.settings.parent];
      parent.forEach((p: Element) => {
        removeClass(p as HTMLElement, 'bprogress-custom-parent');
      });
      const progresses = document.querySelectorAll('.bprogress');
      progresses.forEach((progress) => {
        const elem = progress as HTMLElement;
        if (this.settings.template === null) {
          // Hide the element instead of removing it.
          elem.style.display = 'none';
        } else {
          removeElement(elem);
        }
      });
    }
  }

  // Pause the progress
  static pause(): typeof BProgress {
    if (!this.isStarted()) return this;
    this.isPaused = true;
    return this;
  }

  // Resume the progress
  static resume(): typeof BProgress {
    // Return early if progress was never started
    if (!this.isStarted()) return this;

    // Set isPaused to false to allow progress updates
    this.isPaused = false;

    // If trickle is enabled, restart the trickle loop only once
    if (this.settings.trickle) {
      // Avoid starting multiple loops by checking if one is already running could be implemented here.
      const work = () => {
        if (this.isPaused) return;
        setTimeout(() => {
          // Ensure that progress is still active before trickling
          if (!this.status) return;
          this.trickle();
          work();
        }, this.settings.trickleSpeed);
      };
      work();
    }

    return this;
  }

  // Check if BProgress is rendered in the DOM
  static isRendered(): boolean {
    return document.querySelectorAll('.bprogress').length > 0;
  }

  // Determine the CSS positioning method to use
  static getPositioningCSS() {
    const bodyStyle = document.body.style;
    const vendorPrefix =
      'WebkitTransform' in bodyStyle
        ? 'Webkit'
        : 'MozTransform' in bodyStyle
          ? 'Moz'
          : 'msTransform' in bodyStyle
            ? 'ms'
            : 'OTransform' in bodyStyle
              ? 'O'
              : '';

    if (`${vendorPrefix}Perspective` in bodyStyle) {
      return 'translate3d';
    } else if (`${vendorPrefix}Transform` in bodyStyle) {
      return 'translate';
    } else {
      return 'margin';
    }
  }

  // Queue function for animations
  private static queue(fn: (next: () => void) => void): void {
    this.pending.push(fn);
    if (this.pending.length === 1) this.next();
  }

  private static next(): void {
    const fn = this.pending.shift();
    if (fn) fn(this.next.bind(this));
  }

  private static initPositionUsing(): void {
    if (this.settings.positionUsing === '') {
      this.settings.positionUsing = this.getPositioningCSS();
    }
  }

  // Compute the CSS for positioning the bar
  private static barPositionCSS({
    n,
    speed,
    ease,
    perc,
  }: {
    n: number;
    speed: number;
    ease: string;
    perc?: number;
  }): { [key: string]: string } {
    this.initPositionUsing();

    let barCSS: { [key: string]: string } = {};

    const computedPerc = perc ?? toBarPerc(n, this.settings.direction);

    if (this.settings.positionUsing === 'translate3d') {
      barCSS = {
        transform: `translate3d(${computedPerc}%,0,0)`,
      };
    } else if (this.settings.positionUsing === 'translate') {
      barCSS = {
        transform: `translate(${computedPerc}%,0)`,
      };
    } else if (this.settings.positionUsing === 'width') {
      barCSS = {
        width: `${
          this.settings.direction === 'rtl'
            ? 100 - computedPerc
            : computedPerc + 100
        }%`,
        ...(this.settings.direction === 'rtl'
          ? { right: '0', left: 'auto' }
          : {}),
      };
    } else if (this.settings.positionUsing === 'margin') {
      barCSS =
        this.settings.direction === 'rtl'
          ? { 'margin-left': `${-computedPerc}%` }
          : { 'margin-right': `${-computedPerc}%` };
    }

    barCSS.transition = `all ${speed}ms ${ease}`;

    return barCSS;
  }
}
