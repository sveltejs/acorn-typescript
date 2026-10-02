abstract class C1 {
  abstract accessor e: any;
  protected static accessor i: any;
}

class C2 extends C1 {
  override accessor e: any;
  static override accessor i: any;
}
