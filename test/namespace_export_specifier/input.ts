declare namespace Q {
  function _try(method: Function, ...args: any[]): any;
  export { _try as try };
}

namespace R {
  function helper(): void {}
  export { helper };
}

declare module 'm2' {
  function Y(): void;
  export { Y as X };
}

declare module 'm3' {
  import { Request } from 'm4';
  export { Request };
}
