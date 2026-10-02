import a from './a.json' with { type: 'json' };
import b from './b.json' with { type: 'json', other: 'x' };
import c from './c.json' assert { type: 'json' };
export { d } from './d.json' with { type: 'json' };
