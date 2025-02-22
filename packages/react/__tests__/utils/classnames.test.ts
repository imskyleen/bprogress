import { classNames } from '../../src/utils/classnames';

describe('classNames', () => {
  it('returns an empty string when called with no arguments', () => {
    expect(classNames()).toBe('');
  });

  it('returns the single class name when called with one argument', () => {
    expect(classNames('foo')).toBe('foo');
  });

  it('joins multiple class names with a space', () => {
    expect(classNames('foo', 'bar', 'baz')).toBe('foo bar baz');
  });

  it('ignores falsy values (undefined, null, false)', () => {
    expect(classNames('foo', undefined, null, false, 'bar')).toBe('foo bar');
  });

  it('ignores empty strings and joins the rest with spaces', () => {
    expect(classNames('foo', '', 'bar')).toBe('foo bar');
  });

  it('works with a combination of valid and invalid values', () => {
    expect(classNames('', 'foo', null, 'bar', undefined, false, 'baz')).toBe(
      'foo bar baz',
    );
  });
});
