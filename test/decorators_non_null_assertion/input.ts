declare let x: any;

{
  @x! class C {}
}

{
  @x.y! class C {}
}

{
  @x!.y class C {}
}

{
  class C {
    @x! m() {}
  }
}
