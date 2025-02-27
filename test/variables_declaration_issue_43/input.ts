
const binaryOperators: {
  [operator in any]?: (left: any, right: any) => any;
} = {
  '<': (left, right) => left! < right!
};
