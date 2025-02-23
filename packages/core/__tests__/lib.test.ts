import { css } from '../src/lib/css';
import { isSameURL, isSameURLWithoutSearch } from '../src/lib/same-url';
import type { SpinnerPosition } from '../src/types';

describe('css utility function', () => {
  it('returns the default CSS when no parameters are provided', () => {
    const result = css({});
    // We expect the result to contain the default CSS classes
    expect(result).toContain('.bprogress {');
    expect(result).toContain('.bprogress .bar {');
    expect(result).toContain('.bprogress .spinner {');
  });

  it('includes the provided color in several places', () => {
    const color = '#F00';
    const result = css({ color });

    expect(result).toContain(`background: ${color};`);
    expect(result).toContain(`box-shadow: 0 0 10px ${color}, 0 0 5px ${color}`);
    expect(result).toContain(`border-top-color: ${color}`);
  });

  it('includes the provided height in the .bar selector', () => {
    const height = '5px';
    const result = css({ height });

    expect(result).toContain(`height: ${height};`);
  });

  it('correctly positions the spinner if spinnerPosition is top-right', () => {
    const spinnerPosition: SpinnerPosition = 'top-right';
    const result = css({ spinnerPosition });

    // We expect the spinner to be positioned at the top-right corner
    expect(result).toMatch(/top:\s*15px/);
    expect(result).toMatch(/right:\s*15px/);
    expect(result).toMatch(/bottom:\s*auto/);
    expect(result).toMatch(/left:\s*auto/);
  });

  it('correctly positions the spinner if spinnerPosition is bottom-left', () => {
    const spinnerPosition: SpinnerPosition = 'bottom-left';
    const result = css({ spinnerPosition });

    // We expect the spinner to be positioned at the bottom-left corner
    expect(result).toMatch(/bottom:\s*15px/);
    expect(result).toMatch(/left:\s*15px/);
    expect(result).toMatch(/top:\s*auto/);
    expect(result).toMatch(/right:\s*auto/);
  });
});

describe('isSameURL', () => {
  it('retourne true pour deux URL identiques', () => {
    const url1 = new URL('https://example.com/foo?bar=1');
    const url2 = new URL('https://example.com/foo?bar=1');
    expect(isSameURL(url1, url2)).toBe(true);
  });

  it('retourne false si les query diffèrent', () => {
    const url1 = new URL('https://example.com/foo?bar=1');
    const url2 = new URL('https://example.com/foo?bar=2');
    expect(isSameURL(url1, url2)).toBe(false);
  });

  it('retourne false si les protocoles diffèrent', () => {
    const url1 = new URL('https://example.com/foo?bar=1');
    const url2 = new URL('http://example.com/foo?bar=1');
    expect(isSameURL(url1, url2)).toBe(false);
  });

  it('retourne false si les hosts diffèrent', () => {
    const url1 = new URL('https://example.com/foo?bar=1');
    const url2 = new URL('https://example.org/foo?bar=1');
    expect(isSameURL(url1, url2)).toBe(false);
  });

  it('retourne false si les chemins diffèrent', () => {
    const url1 = new URL('https://example.com/foo?bar=1');
    const url2 = new URL('https://example.com/bar?bar=1');
    expect(isSameURL(url1, url2)).toBe(false);
  });
});

describe('isSameURLWithoutSearch', () => {
  it('retourne true pour deux URL identiques sans prendre en compte les query', () => {
    const url1 = new URL('https://example.com/foo?bar=1');
    const url2 = new URL('https://example.com/foo?bar=2');
    expect(isSameURLWithoutSearch(url1, url2)).toBe(true);
  });

  it('retourne true pour deux URL identiques sans query', () => {
    const url1 = new URL('https://example.com/foo');
    const url2 = new URL('https://example.com/foo');
    expect(isSameURLWithoutSearch(url1, url2)).toBe(true);
  });

  it('retourne false si les chemins diffèrent même en ignorant la query', () => {
    const url1 = new URL('https://example.com/foo');
    const url2 = new URL('https://example.com/bar');
    expect(isSameURLWithoutSearch(url1, url2)).toBe(false);
  });

  it('retourne false si les hosts diffèrent', () => {
    const url1 = new URL('https://example.com/foo');
    const url2 = new URL('https://example.org/foo');
    expect(isSameURLWithoutSearch(url1, url2)).toBe(false);
  });

  it('retourne false si les protocoles diffèrent', () => {
    const url1 = new URL('https://example.com/foo');
    const url2 = new URL('http://example.com/foo');
    expect(isSameURLWithoutSearch(url1, url2)).toBe(false);
  });
});
