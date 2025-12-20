class Student {
 constructor(book: 'math'): void
 constructor(book: 'english'): void
 constructor(book: 'math' | 'english'): void {
   console.log('Im studying')
 }
}