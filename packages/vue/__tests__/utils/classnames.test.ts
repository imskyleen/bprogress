import { classNames } from '../../src/utils/classnames';

describe('classNames', () => {
  it("renvoie une chaîne vide lorsqu'aucun argument n'est fourni", () => {
    expect(classNames()).toBe('');
  });

  it("renvoie le nom de classe unique lorsqu'un seul argument est fourni", () => {
    expect(classNames('foo')).toBe('foo');
  });

  it('concatène plusieurs noms de classe avec un espace', () => {
    expect(classNames('foo', 'bar', 'baz')).toBe('foo bar baz');
  });

  it('ignore les valeurs falsy (undefined, null, false)', () => {
    expect(classNames('foo', undefined, null, false, 'bar')).toBe('foo bar');
  });

  it('ignore les chaînes vides et concatène le reste avec des espaces', () => {
    expect(classNames('foo', '', 'bar')).toBe('foo bar');
  });

  it('fonctionne avec une combinaison de valeurs valides et invalides', () => {
    expect(classNames('', 'foo', null, 'bar', undefined, false, 'baz')).toBe(
      'foo bar baz',
    );
  });

  it('gère les tableaux de noms de classe', () => {
    expect(classNames(['foo', 'bar'])).toBe('foo bar');
    expect(classNames('foo', ['bar', 'baz'])).toBe('foo bar baz');
  });

  it('gère les objets avec des valeurs booléennes', () => {
    expect(classNames({ foo: true, bar: false, baz: true })).toBe('foo baz');
  });

  it('gère une combinaison de chaînes, tableaux et objets', () => {
    expect(
      classNames('foo', ['bar', 'baz'], { qux: true, quux: false }, undefined, [
        'corge',
        { grault: true, garply: false },
      ]),
    ).toBe('foo bar baz qux corge grault');
  });
});
