try {
  throw new Error();
} catch (foo) {
  var foo = "initializer in catch";
}