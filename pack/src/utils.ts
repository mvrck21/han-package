import { getCharParts, isSyllable } from "./index";
import { COMBINED, SYLLABLES_OFFSET, VOWELS_COUNT, BATCHIMS_COUNT, CONSONANTS, VOWELS, BATCHIMS } from "./constants";

export function isString(data: any): data is string {
  return typeof data === "string";
}

// проверяет, что длина строки равна 1
export function isSingleChar(data: any): boolean {
  return isString(data) && data.length === 1;
}

// возвращает оффсеты для каждой буквы (согласная, гласная, патчим) в слоге ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export function getPartsOffsets(char: string): [number, number, number] | [] {
  if (!isString(char) || !isSyllable(char)) {
    return [];
  }

  let charOffset = char.charCodeAt(0) - SYLLABLES_OFFSET;

  let idx = charOffset % BATCHIMS_COUNT;
  const batchim = idx;

  charOffset = (charOffset - idx) / BATCHIMS_COUNT;

  idx = charOffset % VOWELS_COUNT;
  const vowel = idx;

  const consonant = (charOffset - idx) / VOWELS_COUNT;

  return [consonant, vowel, batchim];
}

// возвращает определенную букву из слога - по ее позиции - 0 (согласная), 1 (гласная), 2 (патчим)  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export function getCharPart(char: string, position: number): string {
  if (!isString(char) || !isSyllable(char)) {
    return "";
  }

  return getCharParts(char)[position] ?? "";
}

export function romanizeSyllable(syllable: string): string {
  const parts = getPartsOffsets(syllable);

  if (parts.length === 0) {
    return "";
  }

  const [cIdx, vIdx, bIdx] = parts;

  return `${CONSONANTS[cIdx][1]}${VOWELS[vIdx][1]}${BATCHIMS[bIdx][1]}`;
}

// разобрать слог на мельчайшие части - если буква составная, то тоже будет разложена
export function disassembleChar(char: string): (string | string[])[] {
  const [consonant, vowel, batchim] = getCharParts(char);

  // TODO: переделать, потому что непонятно, какой должен быть результат
  // если первый - составной, то он останется массивом, а все последующие массивы
  // будут развернуты
  // return ([] as string[])
  //   .concat(COMBINED.get(consonant) || consonant || [])
  //   .concat(COMBINED.get(vowel) || vowel || [])
  //   .concat(COMBINED.get(batchim) || batchim || []);
  return [COMBINED.get(consonant) || consonant]
    .concat(COMBINED.get(vowel) || vowel || [])
    .concat(COMBINED.get(batchim) || batchim || []);
}
