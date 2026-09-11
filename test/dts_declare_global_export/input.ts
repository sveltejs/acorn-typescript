declare global {
  interface JQueryXHR {}
  class Model<T = any> {
    fetch(options?: any): JQueryXHR;
  }
  const level: number;
  function report(): void;
}

export { Model, level, report };
export as namespace Backbone;
