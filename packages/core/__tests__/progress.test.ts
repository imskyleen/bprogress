import { BProgress } from '../src/progress';

describe('BProgress', () => {
  // Reset the DOM before each test
  beforeEach(() => {
    document.body.innerHTML = '';
    // Reset BProgress status and settings for clean test environment
    BProgress.status = null;
    BProgress.configure({
      minimum: 0.08,
      maximum: 1,
      template: `<div class="bar" role="bar"><div class="peg"></div></div>
                 <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>`,
      easing: 'linear',
      positionUsing: '',
      speed: 200,
      trickle: true,
      trickleSpeed: 200,
      showSpinner: true,
      barSelector: '[role="bar"]',
      spinnerSelector: '[role="spinner"]',
      parent: 'body',
      direction: 'ltr',
    });
  });

  describe('configure', () => {
    test('should update settings (single option)', () => {
      BProgress.configure({ minimum: 0.2 });
      expect(BProgress.settings.minimum).toBe(0.2);
    });

    test('should update multiple settings correctly', () => {
      BProgress.configure({ minimum: 0.1, speed: 300, trickle: false });
      expect(BProgress.settings.minimum).toBe(0.1);
      expect(BProgress.settings.speed).toBe(300);
      expect(BProgress.settings.trickle).toBe(false);
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

    test('should return false after completion (done)', (done) => {
      BProgress.start();
      BProgress.done();
      setTimeout(() => {
        expect(BProgress.isStarted()).toBe(false);
        done();
      }, BProgress.settings.speed + 250);
    });
  });

  describe('start', () => {
    test('should initialize the progress bar', () => {
      BProgress.start();
      expect(BProgress.isStarted()).toBe(true);
      expect(document.querySelector('.bprogress')).not.toBeNull();
    });

    test('should not create duplicate progress elements when called multiple times', () => {
      BProgress.start();
      const count1 = document.querySelectorAll('.bprogress').length;
      BProgress.start();
      const count2 = document.querySelectorAll('.bprogress').length;
      expect(count2).toBe(count1);
    });

    test('should attach progress element to a custom parent if specified', () => {
      const customParent = document.createElement('div');
      customParent.id = 'custom-parent';
      document.body.appendChild(customParent);
      BProgress.configure({ parent: '#custom-parent' });
      BProgress.start();
      expect(customParent.querySelector('.bprogress')).not.toBeNull();
    });
  });

  describe('set', () => {
    test('should update progress correctly', () => {
      BProgress.set(0.5);
      expect(BProgress.status).toBe(0.5);
    });

    test('should clamp the value to minimum if lower than minimum', () => {
      BProgress.set(0.01);
      expect(BProgress.status).toBe(BProgress.settings.minimum);
    });

    test('should clamp the value to maximum if greater than maximum', () => {
      BProgress.set(1.5);
      // If the value equals maximum, status is set to null
      expect(BProgress.status).toBeNull();
    });

    test('should not update progress when paused', () => {
      BProgress.start();
      BProgress.pause();
      BProgress.status = 0.3; // simulate an ongoing progress
      BProgress.set(0.5);
      expect(BProgress.status).toBe(0.3);

      // Resume and done to complete the progress
      BProgress.resume();
      BProgress.done();
    });
  });

  describe('inc', () => {
    test('should start progress if not already started and then increment', () => {
      BProgress.status = null;
      BProgress.inc(0.1);
      expect(BProgress.isStarted()).toBe(true);
    });

    test('should increment progress using provided amount', () => {
      BProgress.start();
      const initial = BProgress.status;
      BProgress.inc(0.1);
      expect(BProgress.status).toBeGreaterThan(initial!);
    });

    test('should use default increment value when amount is undefined', () => {
      BProgress.status = 0.1;
      const prevStatus = BProgress.status;
      BProgress.inc();
      if (BProgress.status !== null) {
        expect(BProgress.status).toBeGreaterThan(prevStatus);
      }
    });
  });

  describe('done', () => {
    test('should complete and remove the progress bar', (done) => {
      BProgress.start();
      BProgress.done();

      // Wait for the fade-out animation to complete
      setTimeout(() => {
        expect(document.querySelector('.bprogress')).toBeNull();
        done();
      }, BProgress.settings.speed + 250);
    });

    test('should force complete progress when force parameter is true', (done) => {
      BProgress.start();
      BProgress.done(true);
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
          // If status is null, it means progress reached maximum (completed)
          expect(BProgress.status).toBeNull();
        } else {
          // Otherwise, progress should have increased
          expect(BProgress.status).toBeGreaterThan(pausedStatus!);
        }
        done();
      }, BProgress.settings.trickleSpeed + 50);
    });

    test('should have no effect when resume is called without a started progress', () => {
      BProgress.resume();
      expect(BProgress.status).toBeNull();
    });

    test('should handle multiple pause calls gracefully', (done) => {
      BProgress.start();
      BProgress.pause();
      BProgress.pause();
      const statusAfterPause = BProgress.status;
      setTimeout(() => {
        expect(BProgress.status).toBe(statusAfterPause);
        done();
      }, BProgress.settings.trickleSpeed + 50);
    });
  });

  describe('render', () => {
    test('should create the progress element if none exists', () => {
      BProgress.render();
      expect(document.querySelector('.bprogress')).not.toBeNull();
    });

    test('should not create duplicate elements if one already exists', () => {
      // Create an existing progress element manually with proper inner structure
      const existing = document.createElement('div');
      existing.classList.add('bprogress');
      existing.innerHTML = `
        <div class="bar" role="bar">
          <div class="peg"></div>
        </div>
        <div class="spinner" role="spinner">
          <div class="spinner-icon"></div>
        </div>
      `;
      document.body.appendChild(existing);
      const countBefore = document.querySelectorAll('.bprogress').length;
      BProgress.render();
      const countAfter = document.querySelectorAll('.bprogress').length;
      expect(countAfter).toBe(countBefore);
    });
  });

  describe('trickle', () => {
    test('should increment progress automatically', (done) => {
      BProgress.start();
      const initialStatus = BProgress.status;
      BProgress.trickle();

      setTimeout(() => {
        if (BProgress.status === null) {
          expect(BProgress.status).toBeNull();
        } else {
          expect(BProgress.status).toBeGreaterThan(initialStatus!);
        }
        done();
      }, BProgress.settings.trickleSpeed + 50);
    });

    test('should not update progress when paused', (done) => {
      BProgress.start();
      BProgress.pause();
      const statusBefore = BProgress.status;
      BProgress.trickle();
      setTimeout(() => {
        expect(BProgress.status).toBe(statusBefore);
        done();
      }, BProgress.settings.trickleSpeed + 50);
    });
  });

  describe('getPositioningCSS', () => {
    test('should return a valid positioning method', () => {
      const positioning = BProgress.getPositioningCSS();
      expect(['translate3d', 'translate', 'margin']).toContain(positioning);
    });

    test('should return a valid CSS method even when body style is modified', () => {
      // Simulate modification of body style
      document.body.style.webkitTransform = 'translate3d';
      const positioning = BProgress.getPositioningCSS();
      expect(['translate3d', 'translate', 'margin']).toContain(positioning);
    });
  });

  describe('remove', () => {
    test('should remove a specific progress element', () => {
      const progress = document.createElement('div');
      progress.classList.add('bprogress');
      document.body.appendChild(progress);
      BProgress.remove(progress);
      expect(document.body.contains(progress)).toBe(false);
    });

    test('should remove all progress elements when no element is provided', () => {
      const progress1 = document.createElement('div');
      progress1.classList.add('bprogress');
      const progress2 = document.createElement('div');
      progress2.classList.add('bprogress');
      document.body.appendChild(progress1);
      document.body.appendChild(progress2);
      BProgress.remove();
      expect(document.querySelectorAll('.bprogress').length).toBe(0);
    });

    test('should hide the element instead of removing it when template is null', () => {
      BProgress.configure({ template: null });
      const progress = document.createElement('div');
      progress.classList.add('bprogress');
      progress.style.display = 'block';
      document.body.appendChild(progress);
      BProgress.remove(progress);
      expect(progress.style.display).toBe('none');
    });
  });

  describe('promise', () => {
    test('should complete progress when promise is resolved (async)', (done) => {
      const fakePromise = {
        state: () => 'pending',
        always: (callback: () => void) => {
          setTimeout(callback, 100);
        },
      };
      BProgress.promise(fakePromise);
      setTimeout(() => {
        expect(document.querySelector('.bprogress')).toBeNull();
        done();
      }, BProgress.settings.speed + 200);
    });

    test('should immediately complete if promise is already resolved', () => {
      const resolvedPromise = {
        state: () => 'resolved',
        always: (callback: () => void) => callback(),
      };
      BProgress.promise(resolvedPromise);
      expect(document.querySelector('.bprogress')).toBeNull();
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
