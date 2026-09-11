class A {
  static #dec() {}

  @A.#dec
  method() {}

  @A.#dec
  accessor field: number = 1;
}

class B {
  static #ns = { dec() {} };

  @B.#ns.dec
  method() {}
}
