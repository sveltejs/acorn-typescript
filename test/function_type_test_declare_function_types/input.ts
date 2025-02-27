function test(a: string): string
function test(a: number): number
function test(a: number | string): number | string {
  return a
}