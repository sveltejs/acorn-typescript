function configurable(value: Boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.configurable = value;
  };
}
class ExampleClass {
  title: string
  constructor(t: string) {
    this.title = t;
  }
  @configurable(false)
  get x() {
    return this.title;
  }
}