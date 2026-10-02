declare namespace Foo {
  enum Bar {
    a = `1`,
    b = '2'
  }

  export const a = 'string';
  export const b = `template`;

  export const c = Bar.a;
  export const d = Bar['b'];
  export const e = Bar[`a`];
}
