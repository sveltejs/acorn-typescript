abstract class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  display(): void{
    console.log(this.name);
  }
  abstract find(string): Person;
}
class Employee extends Person {
  empCode: number;
  constructor(name: string, code: number) {
    super(name);
    this.empCode = code;
  }
  find(name:string): Person {
    return new Employee(name, 1);
  }
}