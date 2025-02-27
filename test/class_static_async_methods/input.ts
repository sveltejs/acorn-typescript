class Student {
 static async study(): Promise<void> {
   console.log('Im studying')
 }
 static async * students(): AsyncIterable<string> {
   yield 'John Smith'
 }
}