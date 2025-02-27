async function * test(p: Promise<string[]>): void {
  yield * await p
}