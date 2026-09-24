const identity = <T extends string>(value: T): T => value;
const run = <T extends () => void>(task: T) => task();
const node = <Box fn={<T extends () => void>(x: T) => x} />;
