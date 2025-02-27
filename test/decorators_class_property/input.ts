function format(target: string) {
  return target
}
class ExampleClass {
  @format('Hello, %s')
  title: string
  constructor(t: string) {
    this.title = t;
  }
}