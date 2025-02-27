
class Test {
  parseNode(esTreeNode: GenericEsTreeNode): void {
    const { param } = esTreeNode;
    if (param) {
      (this.param as GenericEsTreeNode) = new (this.context.getNodeConstructor(param.type))(
        param, this,this.scope
      );
      this.param!.declare('parameter', UNKNOWN_EXPRESSION);
    }
    super.parseNode(esTreeNode);
  }
}
