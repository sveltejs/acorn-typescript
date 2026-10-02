function f() {
  using handle: Disposable = getHandle();
  using a = first(), b = second();

  for (using each of resources()) {
    consume(each);
  }
}

async function g() {
  await using conn: AsyncDisposable = connect();

  for await (const chunk of stream()) {
    consume(chunk);
  }
}
