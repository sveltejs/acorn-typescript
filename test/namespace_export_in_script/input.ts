namespace M {
  export function f() {
    var args = [];
    return args;
  }

  export const x = 1;
  export class C {}
}

declare module 'm' {
  export function g(): void;
}
