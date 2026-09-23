interface Shape {}
declare class Base {}

export default abstract class<T> extends Base implements Shape {
  abstract m(): T;
}
