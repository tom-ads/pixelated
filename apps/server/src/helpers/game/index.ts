import { PartyDocument, PartyMember } from "../../api/Model/Party";
import { words } from "../../words";

export function getRandomWord(excluded?: string[]) {
  let validWords: string[] = words;

  // Filter out excluded words from word list
  if (excluded?.length) {
    validWords = words.filter(
      (word) => !excluded?.some((excludedWord) => excludedWord === word)
    );
  }

  // credit: https://stackoverflow.com/questions/5915096/get-a-random-item-from-a-javascript-array
  return validWords[Math.floor(Math.random() * validWords.length)];
}

export function setDrawer(party: PartyDocument): PartyMember[] {
  let drawerFound = false;
  const members = party.members.map((member) => {
    if (member.isDrawer) {
      member.isDrawer = false;
    } else if (member.rounds < party!.round && !drawerFound) {
      member.isDrawer = true;
      member.rounds += 1;
      drawerFound = true;
    }

    return member;
  });

  return members;
}

export function obscureWord(word: string) {
  return word.replace(/./g, "-");
}

export function calcGuesserScore(guessPos: number, prevScore: number): number {
  const turnScore = guessPos > 0 ? 225 - 25 * guessPos : 0;
  return prevScore + turnScore;
}

export function calcDrawerScore(
  correctGuesses: number,
  prevScore: number
): number {
  const turnScore = correctGuesses * 25;
  return prevScore + turnScore;
}
