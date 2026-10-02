namespace M {}

var a;
import a = M;

export namespace m1 {}
import foo = m1;
class foo {}

namespace N {}
import b = N;
const b = 1;
