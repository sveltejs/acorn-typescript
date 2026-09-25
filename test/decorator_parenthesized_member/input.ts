class C {
  static #priv = { nested: { dec() {} } };

  @(getDecorators().first)
  a() {}

  @(getDecorators().first).second
  b() {}

  @(C.#priv).nested.dec()
  c() {}
}
