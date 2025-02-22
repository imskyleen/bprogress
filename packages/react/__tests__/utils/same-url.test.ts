import { isSameURL, isSameURLWithoutSearch } from '../../src/utils/same-url';

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
