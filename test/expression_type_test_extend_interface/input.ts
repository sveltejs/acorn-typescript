interface Person {
 name: string
 age: number
}

interface Student extends Person {
 family: string[]
 interest: {
  artificialIntelligence: string
  study: string
 }
}