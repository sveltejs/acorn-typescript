
export class ObjectEntity extends ExpressionEntity {
  constructor(
    properties: ObjectProperty[] | PropertyMap,
    private prototypeExpression: ExpressionEntity | null,
    private immutable = false
  ) {}
}
