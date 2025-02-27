class Student {
 name: string
 age: number
 school: string
 constructor(name: string, age: number, school: string) {
   this.name = name
   this.age = age
   this.school = school
 }
 study() {
   console.log('Im studying')
 }
}