class Student {
 study(book: 'math'): void
 study(book: 'english'): void
 study(book: 'math' | 'english'): void {
   console.log('Im studying')
 }
}

const a = 12345;

export { a }
