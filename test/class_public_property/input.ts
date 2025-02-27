class Student {
 public name: string
 public age: number
 public school: string
 constructor(name: string, age: number, school: string) {
   this.name = name
   this.age = age
   this.school = school
 }
 study() {
   console.log('Im studying')
 }
}