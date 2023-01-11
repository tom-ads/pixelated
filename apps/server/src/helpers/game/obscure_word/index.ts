export function obscureWord(word: string) {
  return word.replace(/[^\s]/g, "-");
}
