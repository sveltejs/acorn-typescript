declare let dec: any;

@dec export class A {}

@dec
@dec
export abstract class B {}

@dec export @dec class C {}

@dec export default class {}
