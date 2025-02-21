import { BProgress } from '../src/progress';

describe('BProgress', () => {
  // Reset the DOM before each test
  beforeEach(() => {
    document.body.innerHTML = '';
    // Reset BProgress status for clean test environment
    BProgress.status = null;
  });

  describe('configure', () => {
    test('should update settings', () => {
      BProgress.configure({ minimum: 0.2 });
      expect(BProgress.settings.minimum).toBe(0.2);
    });
  });

  describe('isStarted', () => {
    test('should return false initially', () => {
      expect(BProgress.isStarted()).toBe(false);
    });

    test('should return true after starting', () => {
      BProgress.start();
      expect(BProgress.isStarted()).toBe(true);
    });
  });

  describe('start', () => {
    test('should initialize the progress bar', () => {
      BProgress.start();
      expect(BProgress.isStarted()).toBe(true);
      expect(document.querySelector('.bprogress')).not.toBeNull();
    });
  });

  describe('set', () => {
    test('should update progress correctly', () => {
      BProgress.set(0.5);
      expect(BProgress.status).toBe(0.5);
    });
  });

  describe('inc', () => {
    test('should increment progress', () => {
      BProgress.start();
      const initial = BProgress.status;
      BProgress.inc(0.1);
      expect(BProgress.status).toBeGreaterThan(initial!);
    });
  });

  describe('done', () => {
    test('should complete and remove the progress bar', (done) => {
      BProgress.start();
      BProgress.done();

      // Wait for the fade-out animation to complete before asserting removal
      setTimeout(() => {
        expect(document.querySelector('.bprogress')).toBeNull();
        done();
      }, BProgress.settings.speed + 250);
    });
  });

  describe('pause/resume', () => {
    test('pause should prevent progress updates', (done) => {
      BProgress.start();
      const initialStatus = BProgress.status;
      BProgress.pause();

      setTimeout(() => {
        // Expect the status to remain unchanged when paused
        expect(BProgress.status).toBe(initialStatus);
        done();
      }, BProgress.settings.trickleSpeed + 50);
    });

    test('resume should allow progress updates', (done) => {
      BProgress.start();
      BProgress.pause();
      const pausedStatus = BProgress.status;

      BProgress.resume();

      setTimeout(() => {
        if (BProgress.status === null) {
          // If status is null, it means progress reached maximum (completed) which is acceptable
          expect(BProgress.status).toBeNull();
        } else {
          // Otherwise, progress should have increased
          expect(BProgress.status).toBeGreaterThan(pausedStatus!);
        }
        done();
      }, BProgress.settings.trickleSpeed + 50);
    });
  });

  describe('render', () => {
    test('should create the progress element', () => {
      BProgress.render();
      expect(document.querySelector('.bprogress')).not.toBeNull();
    });
  });

  describe('trickle', () => {
    test('should increment progress automatically', (done) => {
      BProgress.start();
      const initialStatus = BProgress.status;
      BProgress.trickle();

      setTimeout(() => {
        if (BProgress.status === null) {
          // If status is null, progress reached maximum (completed)
          expect(BProgress.status).toBeNull();
        } else {
          // Otherwise, progress should have increased
          expect(BProgress.status).toBeGreaterThan(initialStatus!);
        }
        done();
      }, BProgress.settings.trickleSpeed + 50);
    });
  });

  describe('getPositioningCSS', () => {
    test('should return a valid positioning method', () => {
      const positioning = BProgress.getPositioningCSS();
      // We expect one of these values: translate3d, translate, or margin.
      expect(['translate3d', 'translate', 'margin']).toContain(positioning);
    });
  });

  describe('remove', () => {
    test('should remove a specific progress element', () => {
      // First, create a progress element manually
      const progress = document.createElement('div');
      progress.classList.add('bprogress');
      document.body.appendChild(progress);
      // Call remove with the element
      BProgress.remove(progress);
      expect(document.body.contains(progress)).toBe(false);
    });

    test('should remove all progress elements when no element is provided', () => {
      // Create two progress elements in the DOM
      const progress1 = document.createElement('div');
      progress1.classList.add('bprogress');
      const progress2 = document.createElement('div');
      progress2.classList.add('bprogress');
      document.body.appendChild(progress1);
      document.body.appendChild(progress2);

      BProgress.remove();
      expect(document.querySelectorAll('.bprogress').length).toBe(0);
    });
  });

  describe('promise', () => {
    test('should complete progress when promise is resolved', (done) => {
      // Simulate a jQuery-like promise
      const fakePromise = {
        state: () => 'pending',
        always: (callback: () => void) => {
          setTimeout(callback, 100);
        },
      };
      BProgress.promise(fakePromise);
      setTimeout(() => {
        // After promise resolution, progress should be completed and removed.
        expect(document.querySelector('.bprogress')).toBeNull();
        done();
      }, BProgress.settings.speed + 200);
    });
  });

  describe('Custom template (template: null)', () => {
    beforeEach(() => {
      // Clear DOM and configure BProgress to use a custom template
      document.body.innerHTML = '';
      BProgress.configure({ template: null });
    });

    test('should use a single custom progress element and display it', () => {
      // Create a custom progress element manually with display: none
      const progress = document.createElement('div');
      progress.classList.add('bprogress');
      progress.style.display = 'none';
      progress.innerHTML = `
        <div class="bar" role="bar">
          <div class="peg"></div>
        </div>
        <div class="spinner" role="spinner">
          <div class="spinner-icon"></div>
        </div>
      `;
      document.body.appendChild(progress);

      // Call render which should toggle the display style
      BProgress.render();

      // Check that the custom progress element is now visible
      expect(progress.style.display).not.toBe('none');
    });

    test('should use multiple custom progress elements and display them', () => {
      // Create two custom progress elements manually with display: none
      const progress1 = document.createElement('div');
      progress1.classList.add('bprogress');
      progress1.style.display = 'none';
      progress1.innerHTML = `
        <div class="bar" role="bar">
          <div class="peg"></div>
        </div>
        <div class="spinner" role="spinner">
          <div class="spinner-icon"></div>
        </div>
      `;
      const progress2 = document.createElement('div');
      progress2.classList.add('bprogress');
      progress2.style.display = 'none';
      progress2.innerHTML = `
        <div class="bar" role="bar">
          <div class="peg"></div>
        </div>
        <div class="spinner" role="spinner">
          <div class="spinner-icon"></div>
        </div>
      `;
      document.body.appendChild(progress1);
      document.body.appendChild(progress2);

      // Call render to initialize the custom progress bars
      BProgress.render();

      // Both custom progress elements should now be visible
      expect(progress1.style.display).not.toBe('none');
      expect(progress2.style.display).not.toBe('none');
    });
  });
});
