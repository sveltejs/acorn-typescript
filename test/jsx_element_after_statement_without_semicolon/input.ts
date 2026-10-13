import { dom } from './renderer'
<h></h>

declare const otherProps: { bar: string }
declare function GenericComponent<T>(props: T): null
<GenericComponent {...otherProps} />;

const cmp = <T,>(x: T) => x;
const cmp2 = a < b;
const cmp3 = a < b > c;
