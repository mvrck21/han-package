import { getCharPart, getPartsOffsets, disassembleChar, isSingleChar, isString, romanizeSyllable } from "./utils";

import {
  LETTERS_OFFSET,
  LETTERS_MAX,
  SYLLABLES_OFFSET,
  SYLLABLES_MAX,
  COMBINED,
  letterForms,
  CONSONANTS,
  VOWELS,
  BATCHIMS,
  VOWELS_COUNT,
  BATCHIMS_COUNT,
} from "./constants";

type DisassembleOptions = {
  chunked?: boolean; // возвращать составные как массив - например, 사과 будет [["ㅅ","ㅏ"],["ㄱ","ㅗ","ㅏ"]], а не ["ㅅ","ㅏ","ㄱ","ㅗ","ㅏ"]
  charParts?: boolean; // разлагать слоги на части        - например, 사과 будет ["ㅅ","ㅏ","ㄱ","ㅘ"], а не ["ㅅ","ㅏ","ㄱ","ㅗ","ㅏ"]
};

type DisassemblingResult = [] | (string | string[])[];

// jamo = любой одиночный корейский символ (даже сдвоенный)  // isLetter
export function isJamo(c: string): boolean {
  if (!isSingleChar(c)) {
    return false;
  }

  const code = c.charCodeAt(0);
  return code >= LETTERS_OFFSET && code <= LETTERS_MAX;
}

// является ли слогом - комбинацией нескольких jamo
export function isSyllable(c: string): boolean {
  if (!isSingleChar(c)) {
    return false;
  }

  const code = c.charCodeAt(0);
  return code >= SYLLABLES_OFFSET && code <= SYLLABLES_MAX;
}

// ㅟ ㅢ ㅘ ㅝ ㅙ ㅚ ㅞ ㄳ ㄵ ㄶ ㄺ ㄻ ㄼ ㄽ ㄾ ㄿ ㅀ ㅄ
export function isCombined(char: string): boolean {
  // if (!isSingleChar(char)) {
  //   return false;
  // }

  // return Array.from(COMBINED.keys()).some((k) => k === char);

  return isSingleChar(char) ? Array.from(COMBINED.keys()).some((k) => k === char) : false;
}

// определяет, является ли символ корейским
// если передана строка из нескольких символов, то проверит только первый символ переданной строки
export const isHangul = (c: string): boolean => isJamo(c) || isSyllable(c); // +++++++++++++++++++++++++++

// все, что не входит в Combined считается простой буквой
const isBasic = (c: string): boolean => isHangul(c) && !isCombined(c) && !isSyllable(c);

// возвращает отдельные буквы из слога
// [string, string, string?] | [string?]
// breakSyllable - такое название?
export const getCharParts = (char: string): string[] => {
  if (!isString(char)) {
    return [];
  }

  if (!isSyllable(char)) {
    return [char];
  }

  const parts = getPartsOffsets(char);

  if (parts.length === 0) {
    return [];
  }

  const [consonantIdx, vowelIdx, batchimIdx] = parts;

  const consonant = CONSONANTS[consonantIdx][0];
  const vowel = VOWELS[vowelIdx][0];
  const batchim = BATCHIMS[batchimIdx][0];

  return [consonant, vowel, batchim].filter(Boolean);
};

// ================================================================================================================

function disassemble(text: string, options?: DisassembleOptions): DisassemblingResult[] {
  const { chunked = false, charParts = false } = options || {};

  let result: DisassemblingResult[] = [];

  if (!isString(text)) {
    return result;
  }

  for (const char of text) {
    const processedChar: DisassemblingResult = charParts ? getCharParts(char) : disassembleChar(char);

    if (chunked) {
      result.push(processedChar);
    } else {
      result = result.concat(processedChar);
    }
  }

  return result;
}

export function disassembleIntoParts(text: string, chunked?: boolean): DisassemblingResult[] {
  return disassemble(text, { charParts: true, chunked });
}

export function disassembleIntoLetters(text: string, chunked?: boolean): DisassemblingResult[] {
  return disassemble(text, { chunked });
}

// ================================================================================================================

export const getConsonant = (c: string) => getCharPart(c, 0);

export const getVowel = (c: string) => getCharPart(c, 1);

export const getBatchim = (c: string) => getCharPart(c, 2);

export const getPlain = (l: string) => letterForms.find((el) => el.includes(l))?.[0];

export const getTense = (l: string) => letterForms.find((el) => el.includes(l))?.[1];

export const getAspirated = (l: string) => letterForms.find((el) => el.includes(l))?.[2];

export const isTense = (l: string) => letterForms.some((el) => el[1] === l);

export const isAspirated = (l: string) => letterForms.some((el) => el[2] === l);

export const isConsonant = (l: string) => CONSONANTS.some((el) => el[0] === l);

export const isVowel = (l: string) => VOWELS.some((el) => el[0] === l);

const canBeBatchim = (l: string) => BATCHIMS.findIndex((el) => el[0] === l) !== -1;

// ================================================================================================================

export function romanize(text: string): string {
  // let resultString = "";

  // for (let char of text) {
  //   if (isSyllable(char)) {
  //     resultString += romanizeSyllable(char);
  //     continue;
  //   }

  //   if (!isJamo(char)) {
  //     resultString += char;
  //     continue;
  //   }

  //   if (isConsonant(char)) {
  //     resultString += CONSONANTS.find((c) => c[0] === char)![1];
  //     continue;
  //   }

  //   if (isVowel(char)) {
  //     resultString += VOWELS.find((v) => v[0] === char)![1];
  //     continue;
  //   }

  //   resultString += BATCHIMS.find((b) => b[0] === char)![1];
  // }

  // return resultString;

  return [...text].reduce<string>((resultString, char) => {
    if (isSyllable(char)) {
      return (resultString += romanizeSyllable(char));
    }

    if (!isJamo(char)) {
      return (resultString += char);
    }

    if (isConsonant(char)) {
      return (resultString += CONSONANTS.find((c) => c[0] === char)![1]);
    }

    if (isVowel(char)) {
      return (resultString += VOWELS.find((v) => v[0] === char)![1]);
    }

    return (resultString += BATCHIMS.find((b) => b[0] === char)![1]);
  }, "");
}

//====================================================================== ЗДЕСЬ РАЗНИЦА!!!!
export function createBlockFromParts(letters: string[]): string {
  const [consonant, vowel, batchim] = letters;

  if (!consonant) {
    return "";
  }

  if (!vowel) {
    return consonant;
  }

  const consonantIdx = CONSONANTS.findIndex((c) => c[0] === consonant);
  const c = consonantIdx * VOWELS_COUNT;

  const vowelIdx = VOWELS.findIndex((v) => v[0] === vowel);
  const v = (c + vowelIdx) * BATCHIMS_COUNT;

  const batchimIdx = BATCHIMS.findIndex((b) => b[0] === batchim);
  const b = v + (batchimIdx < 0 ? batchimIdx + 1 : batchimIdx);

  const newSyllable = b + SYLLABLES_OFFSET;

  const result = String.fromCharCode(newSyllable);

  if (!isSyllable(result)) {
    return "";
  }

  return result;
}
//==================================================================================

// заменит первую согласную в слоге
// если char является одиночной корейской согласной, то заменит эту согласную
export const replaceConsonant = (char: string, newConsonant: string) => {
  const isAvailableToReplace = (isSyllable(char) || isBasic(char)) && isConsonant(newConsonant) && char.length === 1;

  if (!isAvailableToReplace) {
    return char;
  }

  if (isBasic(char)) {
    return newConsonant;
  }

  let [_, vowel, batchim] = getCharParts(char);

  const newSyllable = createBlockFromParts([newConsonant, vowel, batchim]);

  // нужна ли проверка??
  return isSyllable(newSyllable) ? newSyllable : char;
};

// заменит гласную букву в слоге
// если char не является корейским слогом или является строкой из нескольких символов, то вернет оригинальный переданный символ
// если является одиночной корейской согласной, то прибавит к этой согласной гласную
export function replaceVowel(char: string, newVowel: string) {
  const isAvailableToReplace = (isSyllable(char) || isBasic(char)) && isVowel(newVowel) && char.length === 1;

  //  !isVowel(letter) || (!isSyllable(char) && !isBasic(char));

  if (!isAvailableToReplace) {
    return char;
  }

  let [consonant, _, batchim] = getCharParts(char);

  const newSyllable = createBlockFromParts([consonant, newVowel, batchim]);

  // нужна ли проверка??
  return isSyllable(newSyllable) ? newSyllable : char;
}

export function replaceBatchim(char: string, newBatchim: string) {
  const isAvailableToReplace = isSyllable(char) && canBeBatchim(newBatchim) && char.length === 1;

  if (!isAvailableToReplace) {
    return char;
  }

  const [consonant, vowel] = getCharParts(char);

  const newSyllable = createBlockFromParts([consonant, vowel, newBatchim]);

  // нужна ли проверка??
  return isSyllable(newSyllable) ? newSyllable : char;
}

//==================================================================================

export function createComposite(a: string, b: string): string | void {
  const isAvailableToCreateComposite = (isConsonant(a) && isConsonant(b)) || (isVowel(a) && isVowel(b));

  if (!isAvailableToCreateComposite) {
    return;
  }

  for (let entry of COMBINED.entries()) {
    if (entry[1].join("") === a + b) {
      return entry[0];
    }
  }
}

//==================================================================================

const assembleArrayOfLetters = (lettersArray: string[]): string => {
  let resultString = "";
  let currentBlock: string[] = [];

  for (const [idx, letter] of lettersArray.entries()) {
    const blockLength = currentBlock.length;

    // ================================================ 1
    // было почему-то так: !isVowel(letter)
    // if (!blockLength && (isConsonant(letter) || !isVowel(letter))) {

    if (blockLength === 0) {
      if (isConsonant(letter) || isVowel(letter)) {
        currentBlock.push(letter);
        continue;
      }

      resultString += letter;
      continue;
    }

    if (blockLength === 1) {
      if (isConsonant(letter)) {
        const composite = createComposite(currentBlock[0], letter);

        if (composite) {
          currentBlock[0] = composite;
          continue;
        }

        resultString += currentBlock[0];
        currentBlock = [letter];
        continue;
      }

      if (isVowel(letter)) {
        if (isConsonant(currentBlock[0])) {
          currentBlock.push(letter);
          continue;
        }

        if (isVowel(currentBlock[0])) {
          const composite = createComposite(currentBlock[0], letter);

          if (composite) {
            resultString += composite;
            currentBlock = [];
            continue;
          }
        }
      }

      resultString += currentBlock[0] + letter;
      currentBlock = [];
      continue;
    }

    if (blockLength === 2) {
      if (isVowel(letter)) {
        const composite = createComposite(currentBlock[1], letter);

        if (composite) {
          currentBlock[1] = composite;
          continue;
        }
      }

      if (isVowel(lettersArray[idx + 1])) {
        resultString += createBlockFromParts(currentBlock);
        currentBlock = [letter];
        continue;
      }

      if (BATCHIMS.find((b) => b[0] === letter)) {
        currentBlock.push(letter);
        continue;
      }

      resultString += createBlockFromParts(currentBlock);
      currentBlock = [letter];
      continue;
    }

    if (blockLength === 3) {
      if (isConsonant(letter) && !isVowel(lettersArray[idx + 1])) {
        const doublePatchim = createComposite(currentBlock[2], letter);

        if (doublePatchim) {
          currentBlock[2] = doublePatchim;
          resultString += createBlockFromParts(currentBlock);
          currentBlock = [];
          continue;
        }
      }

      resultString += createBlockFromParts(currentBlock);
      currentBlock = [letter];
      continue;
    }
  }

  return resultString + createBlockFromParts(currentBlock);
};

// =========================== ТУТ ЛУЧШЕ !!!!!
// не должен быть доступен как самостоятельная функция - только вызываться из assemble
// assembleArray
const processArrayOfLetters = (letters: DisassemblingResult): string[] => {
  const result: string[] = [];

  for (let item of letters) {
    if (isString(item)) {
      result.push(item);
      continue;
    }

    if (Array.isArray(item)) {
      const [a, b] = item;

      if (!isString(a) || !isString(b)) {
        break;
      }

      const composite = createComposite(a, b);

      if (!composite) {
        result.push(a, b);
        continue;
      }

      result.push(composite);
      continue;
    }

    break;
  }

  return result;
};

// =====================================================================

export function assemble(letters: string | DisassemblingResult): string {
  if (isString(letters)) {
    const lettersArray = letters.split("");
    return assembleArrayOfLetters(lettersArray);
  }

  if (Array.isArray(letters)) {
    const hasNested = letters.some((i) => Array.isArray(i));

    const lettersArray = hasNested ? processArrayOfLetters(letters) : (letters as string[]);

    return assembleArrayOfLetters(lettersArray);
  }

  return "";
}

// =====================================================================

// присоедняет букву к слогу (если 2 - то патчим, если 1 - то гласную)
export function appendLetter(text: string, letter: string): string {
  const base = text.slice(-1); // последний символ текста

  const result = assemble(assemble([...(disassemble(base) as unknown as string[]), letter]));

  return text.slice(0, -1) + result;
}

// =====================================================================

// const findAllConjugated = (text, word) => {};

// строить блок из двух гласных - так получить complex
// и из двух согласных
// дать возможность добавлять первым гласную
// и рассматривать второй переданный знак в качестве согласной
// или создать другую функцию для этих целей

// =============================

// Hangul.isComplete(c)	-	isSyllable

// Hangul.isConsonant(c)	-	isConsonant

// Hangul.isVowel(c)	-	isVowel

// Hangul.isCho(c)		-	isConsonant ????		ㄲ ок, но ㄳ не ок

// Hangul.isJong(c)	-	нет

// Hangul.endsWithConsonant(c)	- нет

// Hangul.endsWith(c, t)		- нет

export const exportsForTest = {
  assembleArrayOfLetters,
};

// const res1 = assembleArrayOfLetters(["ㅇ", "ㅣ", "ㄷ", "ㄽ", "ㅏ"]);
// console.log(res1);
