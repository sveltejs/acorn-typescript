export {};

declare const await: any;
declare class C extends await {}

declare global {
  export namespace ns {
    export function eval(): void;
    export function arguments(): void;
    export function yield(): void;
  }
}
