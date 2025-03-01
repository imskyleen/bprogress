/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  addPathPrefix,
  getAnchorProperty,
  parsePath,
} from '../src/lib/get-anchor-property';

describe('parsePath', () => {
  it('returns the path with empty query/hash if there is no "?" or "#"', () => {
    const result = parsePath('/foo/bar');
    expect(result).toEqual({
      pathname: '/foo/bar',
      query: '',
      hash: '',
    });
  });

  it('extracts the query string when there is no hash', () => {
    const result = parsePath('/foo/bar?baz=1');
    expect(result).toEqual({
      pathname: '/foo/bar',
      query: '?baz=1',
      hash: '',
    });
  });

  it('extracts the hash when there is no query', () => {
    const result = parsePath('/foo/bar#section1');
    expect(result).toEqual({
      pathname: '/foo/bar',
      query: '',
      hash: '#section1',
    });
  });

  it('extracts both query and hash when both exist', () => {
    const result = parsePath('/foo/bar?baz=1#section1');
    expect(result).toEqual({
      pathname: '/foo/bar',
      query: '?baz=1',
      hash: '#section1',
    });
  });

  it('handles a path that starts with "?" or "#" (edge cases)', () => {
    const queryOnly = parsePath('?something=1#hash');
    expect(queryOnly).toEqual({
      pathname: '',
      query: '?something=1',
      hash: '#hash',
    });

    const hashOnly = parsePath('#only-hash');
    expect(hashOnly).toEqual({
      pathname: '',
      query: '',
      hash: '#only-hash',
    });
  });

  it('handles multiple "?" or "#" - it uses the first occurrences for query/hash', () => {
    // parsePath is based on the first ? and the first #
    const result = parsePath('/foo/bar?baz=1?extra=2#hash1#hash2');
    expect(result).toEqual({
      pathname: '/foo/bar',
      query: '?baz=1?extra=2',
      hash: '#hash1#hash2',
    });
  });
});

describe('addPathPrefix', () => {
  it('returns the path unchanged if it does not start with "/"', () => {
    const result = addPathPrefix('foo/bar', '/prefix');
    expect(result).toBe('foo/bar');
  });

  it('returns the path unchanged if no prefix is provided', () => {
    const result = addPathPrefix('/foo/bar', undefined);
    expect(result).toBe('/foo/bar');
  });

  it('adds the prefix if the path starts with "/"', () => {
    const result = addPathPrefix('/foo/bar', '/prefix');
    expect(result).toBe('/prefix/foo/bar');
  });

  it('handles query and hash in the path', () => {
    const path = '/foo/bar?param=1#hash';
    const result = addPathPrefix(path, '/prefix');
    // Le query et le hash doivent rester inchangés
    expect(result).toBe('/prefix/foo/bar?param=1#hash');
  });
});

describe('getAnchorProperty', () => {
  // To manipulate location.origin, we can mock it
  const originalLocation = window.location;

  beforeAll(() => {
    delete (window as any).location;
    (window as any).location = {
      origin: 'http://localhost:3000',
      href: 'http://localhost:3000/foo/bar',
    };
  });

  afterAll(() => {
    (window as any).location = originalLocation;
  });

  it('gets a normal property (e.g. title) from an HTMLAnchorElement', () => {
    const anchor = document.createElement('a');
    anchor.title = 'My Title';

    const result = getAnchorProperty(anchor, 'title');
    expect(result).toBe('My Title');
  });

  it('returns dataset property if key === "data-disable-progress"', () => {
    const anchor = document.createElement('a');
    anchor.dataset.disableProgress = 'true';

    const result = getAnchorProperty(anchor, 'data-disable-progress' as any);
    expect(result).toBe('true');
  });

  it('returns href for an HTMLAnchorElement (no prefix added in that scenario)', () => {
    const anchor = document.createElement('a');
    anchor.href = 'http://example.com';

    // key is 'href', normal anchor => no prefix transformation
    const result = getAnchorProperty(anchor, 'href');
    expect(result).toBe('http://example.com/');
  });

  it('handles an SVGAElement with an SVGAnimatedString for href', () => {
    // we need to create an SVG document to test this
    const svgDoc = document.implementation.createDocument(
      'http://www.w3.org/2000/svg',
      'svg',
      null,
    );
    const link = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'a');
    (link as any).href = { baseVal: '/foo/bar' };

    const result = getAnchorProperty(link, 'href');
    expect(result).toEqual({ baseVal: '/foo/bar' });
  });

  it('returns the raw property if prop is not SVGAnimatedString', () => {
    const svgDoc = document.implementation.createDocument(
      'http://www.w3.org/2000/svg',
      'svg',
      null,
    );
    const link = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'a');
    // We set target to _blank to test the next case
    (link as any).target = '_blank';

    const result = getAnchorProperty(link, 'target');
    expect(result).toBe('_blank');
  });
});
