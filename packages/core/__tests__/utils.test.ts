import {
  clamp,
  toBarPerc,
  toCss,
  addClass,
  removeClass,
  removeElement,
} from '../src/utils';

describe('Utils functions', () => {
  describe('clamp', () => {
    test('should return the number itself if it is within the range', () => {
      expect(clamp(5, 1, 10)).toBe(5);
    });

    test('should return min if the number is lower than min', () => {
      expect(clamp(0, 1, 10)).toBe(1);
    });

    test('should return max if the number is greater than max', () => {
      expect(clamp(15, 1, 10)).toBe(10);
    });
  });

  describe('toBarPerc', () => {
    test('should calculate percentage correctly for ltr direction', () => {
      expect(toBarPerc(0, 'ltr')).toBe(-100);
      expect(toBarPerc(0.5, 'ltr')).toBe(-50);
      expect(toBarPerc(1, 'ltr')).toBe(0);
    });

    test('should calculate percentage correctly for rtl direction', () => {
      expect(toBarPerc(0, 'rtl')).toBe(100);
      expect(toBarPerc(0.5, 'rtl')).toBe(50);
      expect(toBarPerc(1, 'rtl')).toBe(0);
    });
  });

  describe('css', () => {
    test('should apply multiple styles correctly', () => {
      const div = document.createElement('div');
      toCss(div, { color: 'red', backgroundColor: 'blue' });
      expect(div.style.color).toBe('red');
      expect(div.style.backgroundColor).toBe('blue');
    });

    test('should apply a single style property correctly', () => {
      const div = document.createElement('div');
      toCss(div, 'color', 'green');
      expect(div.style.color).toBe('green');
    });

    test('should not apply undefined values', () => {
      const div = document.createElement('div');
      toCss(div, { color: undefined });
      expect(div.style.color).toBe('');
    });
  });

  describe('addClass', () => {
    test('should add a class to an element', () => {
      const div = document.createElement('div');
      addClass(div, 'test-class');
      expect(div.classList.contains('test-class')).toBe(true);
    });

    test('should not duplicate an existing class', () => {
      const div = document.createElement('div');
      div.classList.add('existing-class');
      addClass(div, 'existing-class');
      expect(div.classList.length).toBe(1);
    });
  });

  describe('removeClass', () => {
    test('should remove a class from an element', () => {
      const div = document.createElement('div');
      div.classList.add('test-class');
      removeClass(div, 'test-class');
      expect(div.classList.contains('test-class')).toBe(false);
    });

    test('should do nothing if the class does not exist', () => {
      const div = document.createElement('div');
      removeClass(div, 'non-existent-class');
      expect(div.classList.length).toBe(0);
    });
  });

  describe('removeElement', () => {
    test('should remove an element from the DOM', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      removeElement(div);
      expect(document.body.contains(div)).toBe(false);
    });

    test('should do nothing if the element has no parent', () => {
      const div = document.createElement('div');
      removeElement(div); // No error should be thrown
      expect(div.parentNode).toBeNull();
    });
  });
});
