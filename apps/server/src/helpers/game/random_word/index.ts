export function getRandomWord(set: string[]) {
  // credit: https://stackoverflow.com/questions/5915096/get-a-random-item-from-a-javascript-array
  return set[Math.floor(Math.random() * set.length)];
}
