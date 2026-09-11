const withConstraint = <T extends object>(x: T) => x;
const withUnknown = <T extends unknown>(x: T) => x;
const withComma = <T,>(x: T) => x;
const withTwo = <T, U>(x: T, y: U) => x;
const withBoth = <T extends object,>(x: T) => x;
