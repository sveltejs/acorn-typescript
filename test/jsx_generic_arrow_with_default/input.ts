const identity = <T = string>(value: T): T => value;
const node = <Box fn={<T = () => void>(x: T) => x} />;
