let a = {
  b1: <T>(args: any) => {},
  b2: <T>() => (args: any) => {},
  b3: <T>() => (args: any) => {},
}

@a.b1<number>
class C1 {}

@a.b2<number>()
class C2 {}

@a.b3<<T>() => void>()
class C3 {}

@a.b1<number>
export class C4 {}

@a.b2<number>()
export class C5 {}

@a.b3<<T>() => void>()
export class C6 {}
