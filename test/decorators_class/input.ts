function reportableClassDecorator<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    reportingURL = "http://www...";
  };
}
@reportableClassDecorator
class ExampleClass {
  title: string
  constructor(t: string) {
    this.title = t;
  }
}