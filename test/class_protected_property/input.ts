class Student {
 protected name: string
 protected age: number
 protected school: string
 constructor(name: string, age: number, school: string) {
   this.name = name
   this.age = age
   this.school = school
 }
 study() {
   console.log('Im studying')
 }
}