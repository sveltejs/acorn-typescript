class A {
  blub = 6;
}

class B extends A {
  constructor(public x: number) {
    "use strict";
    super();
  }
}

class C {
  constructor(readonly a: number, private b: string, protected override c: boolean) {
    'use strict';
  }
}
