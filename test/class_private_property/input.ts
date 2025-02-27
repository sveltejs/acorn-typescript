class Student {
 private name: string
 private age: number
 private school: string
 constructor(name: string, age: number, school: string) {
   this.name = name
   this.age = age
   this.school = school
 }
 study() {
   console.log('Im studying')
 }
}