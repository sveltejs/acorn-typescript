interface Family {
  father: string
  mother: string
}
function test(name: string, family: Family, age?: number): Family {
  console.log(name, age)
  return family
}