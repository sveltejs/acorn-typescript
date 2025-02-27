class MyClass {
  myMethod(@logParam myParameter: string) {}
}
function logParam(target: any, methodKey: string, parameterIndex: number) {
  target.test = methodKey;
}