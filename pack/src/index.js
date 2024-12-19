"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportsForTest = exports.replaceConsonant = exports.isVowel = exports.isConsonant = exports.isAspirated = exports.isTense = exports.getAspirated = exports.getTense = exports.getPlain = exports.getBatchim = exports.getVowel = exports.getConsonant = exports.getCharParts = exports.isHangul = void 0;
exports.isJamo = isJamo;
exports.isSyllable = isSyllable;
exports.isCombined = isCombined;
exports.disassembleIntoParts = disassembleIntoParts;
exports.disassembleIntoLetters = disassembleIntoLetters;
exports.romanize = romanize;
exports.createBlockFromParts = createBlockFromParts;
exports.replaceVowel = replaceVowel;
exports.replaceBatchim = replaceBatchim;
exports.createComposite = createComposite;
exports.assemble = assemble;
exports.appendLetter = appendLetter;
const utils_1 = require("./utils");
const constants_1 = require("./constants");
// jamo = любой одиночный корейский символ (даже сдвоенный)  // isLetter
function isJamo(c) {
    if (!(0, utils_1.isSingleChar)(c)) {
        return false;
    }
    const code = c.charCodeAt(0);
    return code >= constants_1.LETTERS_OFFSET && code <= constants_1.LETTERS_MAX;
}
// является ли слогом - комбинацией нескольких jamo
function isSyllable(c) {
    if (!(0, utils_1.isSingleChar)(c)) {
        return false;
    }
    const code = c.charCodeAt(0);
    return code >= constants_1.SYLLABLES_OFFSET && code <= constants_1.SYLLABLES_MAX;
}
// ㅟ ㅢ ㅘ ㅝ ㅙ ㅚ ㅞ ㄳ ㄵ ㄶ ㄺ ㄻ ㄼ ㄽ ㄾ ㄿ ㅀ ㅄ
function isCombined(char) {
    // if (!isSingleChar(char)) {
    //   return false;
    // }
    // return Array.from(COMBINED.keys()).some((k) => k === char);
    return (0, utils_1.isSingleChar)(char) ? Array.from(constants_1.COMBINED.keys()).some((k) => k === char) : false;
}
// определяет, является ли символ корейским
// если передана строка из нескольких символов, то проверит только первый символ переданной строки
const isHangul = (c) => isJamo(c) || isSyllable(c); // +++++++++++++++++++++++++++
exports.isHangul = isHangul;
// все, что не входит в Combined считается простой буквой
const isBasic = (c) => (0, exports.isHangul)(c) && !isCombined(c) && !isSyllable(c);
// возвращает отдельные буквы из слога
// [string, string, string?] | [string?]
// breakSyllable - такое название?
const getCharParts = (char) => {
    if (!(0, utils_1.isString)(char)) {
        return [];
    }
    if (!isSyllable(char)) {
        return [char];
    }
    const parts = (0, utils_1.getPartsOffsets)(char);
    if (parts.length === 0) {
        return [];
    }
    const [consonantIdx, vowelIdx, batchimIdx] = parts;
    const consonant = constants_1.CONSONANTS[consonantIdx][0];
    const vowel = constants_1.VOWELS[vowelIdx][0];
    const batchim = constants_1.BATCHIMS[batchimIdx][0];
    return [consonant, vowel, batchim].filter(Boolean);
};
exports.getCharParts = getCharParts;
// ================================================================================================================
function disassemble(text, options) {
    const { chunked = false, charParts = false } = options || {};
    let result = [];
    if (!(0, utils_1.isString)(text)) {
        return result;
    }
    for (const char of text) {
        const processedChar = charParts ? (0, exports.getCharParts)(char) : (0, utils_1.disassembleChar)(char);
        if (chunked) {
            result.push(processedChar);
        }
        else {
            result = result.concat(processedChar);
        }
    }
    return result;
}
function disassembleIntoParts(text, chunked) {
    return disassemble(text, { charParts: true, chunked });
}
function disassembleIntoLetters(text, chunked) {
    return disassemble(text, { chunked });
}
// ================================================================================================================
const getConsonant = (c) => (0, utils_1.getCharPart)(c, 0);
exports.getConsonant = getConsonant;
const getVowel = (c) => (0, utils_1.getCharPart)(c, 1);
exports.getVowel = getVowel;
const getBatchim = (c) => (0, utils_1.getCharPart)(c, 2);
exports.getBatchim = getBatchim;
const getPlain = (l) => { var _a; return (_a = constants_1.letterForms.find((el) => el.includes(l))) === null || _a === void 0 ? void 0 : _a[0]; };
exports.getPlain = getPlain;
const getTense = (l) => { var _a; return (_a = constants_1.letterForms.find((el) => el.includes(l))) === null || _a === void 0 ? void 0 : _a[1]; };
exports.getTense = getTense;
const getAspirated = (l) => { var _a; return (_a = constants_1.letterForms.find((el) => el.includes(l))) === null || _a === void 0 ? void 0 : _a[2]; };
exports.getAspirated = getAspirated;
const isTense = (l) => constants_1.letterForms.some((el) => el[1] === l);
exports.isTense = isTense;
const isAspirated = (l) => constants_1.letterForms.some((el) => el[2] === l);
exports.isAspirated = isAspirated;
const isConsonant = (l) => constants_1.CONSONANTS.some((el) => el[0] === l);
exports.isConsonant = isConsonant;
const isVowel = (l) => constants_1.VOWELS.some((el) => el[0] === l);
exports.isVowel = isVowel;
const canBeBatchim = (l) => constants_1.BATCHIMS.findIndex((el) => el[0] === l) !== -1;
// ================================================================================================================
function romanize(text) {
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
    return [...text].reduce((resultString, char) => {
        if (isSyllable(char)) {
            return (resultString += (0, utils_1.romanizeSyllable)(char));
        }
        if (!isJamo(char)) {
            return (resultString += char);
        }
        if ((0, exports.isConsonant)(char)) {
            return (resultString += constants_1.CONSONANTS.find((c) => c[0] === char)[1]);
        }
        if ((0, exports.isVowel)(char)) {
            return (resultString += constants_1.VOWELS.find((v) => v[0] === char)[1]);
        }
        return (resultString += constants_1.BATCHIMS.find((b) => b[0] === char)[1]);
    }, "");
}
//====================================================================== ЗДЕСЬ РАЗНИЦА!!!!
function createBlockFromParts(letters) {
    const [consonant, vowel, batchim] = letters;
    if (!consonant) {
        return "";
    }
    if (!vowel) {
        return consonant;
    }
    const consonantIdx = constants_1.CONSONANTS.findIndex((c) => c[0] === consonant);
    const c = consonantIdx * constants_1.VOWELS_COUNT;
    const vowelIdx = constants_1.VOWELS.findIndex((v) => v[0] === vowel);
    const v = (c + vowelIdx) * constants_1.BATCHIMS_COUNT;
    const batchimIdx = constants_1.BATCHIMS.findIndex((b) => b[0] === batchim);
    const b = v + (batchimIdx < 0 ? batchimIdx + 1 : batchimIdx);
    const newSyllable = b + constants_1.SYLLABLES_OFFSET;
    const result = String.fromCharCode(newSyllable);
    if (!isSyllable(result)) {
        return "";
    }
    return result;
}
//==================================================================================
// заменит первую согласную в слоге
// если char является одиночной корейской согласной, то заменит эту согласную
const replaceConsonant = (char, newConsonant) => {
    const isAvailableToReplace = (isSyllable(char) || isBasic(char)) && (0, exports.isConsonant)(newConsonant) && char.length === 1;
    if (!isAvailableToReplace) {
        return char;
    }
    if (isBasic(char)) {
        return newConsonant;
    }
    let [_, vowel, batchim] = (0, exports.getCharParts)(char);
    const newSyllable = createBlockFromParts([newConsonant, vowel, batchim]);
    // нужна ли проверка??
    return isSyllable(newSyllable) ? newSyllable : char;
};
exports.replaceConsonant = replaceConsonant;
// заменит гласную букву в слоге
// если char не является корейским слогом или является строкой из нескольких символов, то вернет оригинальный переданный символ
// если является одиночной корейской согласной, то прибавит к этой согласной гласную
// А ЕСЛИ ПЕРЕДАНА СТРОКА ДЛИННЕЕ 1 СИМВОЛА???
function replaceVowel(char, newVowel) {
    const isAvailableToReplace = (isSyllable(char) || isBasic(char)) && (0, exports.isVowel)(newVowel) && char.length === 1;
    //  !isVowel(letter) || (!isSyllable(char) && !isBasic(char));
    if (!isAvailableToReplace) {
        return char;
    }
    let [consonant, _, batchim] = (0, exports.getCharParts)(char);
    const newSyllable = createBlockFromParts([consonant, newVowel, batchim]);
    // нужна ли проверка??
    return isSyllable(newSyllable) ? newSyllable : char;
}
function replaceBatchim(char, newBatchim) {
    const isAvailableToReplace = isSyllable(char) && canBeBatchim(newBatchim) && char.length === 1;
    if (!isAvailableToReplace) {
        return char;
    }
    const [consonant, vowel] = (0, exports.getCharParts)(char);
    const newSyllable = createBlockFromParts([consonant, vowel, newBatchim]);
    // нужна ли проверка??
    return isSyllable(newSyllable) ? newSyllable : char;
}
//==================================================================================
function createComposite(a, b) {
    const isAvailableToCreateComposite = ((0, exports.isConsonant)(a) && (0, exports.isConsonant)(b)) || ((0, exports.isVowel)(a) && (0, exports.isVowel)(b));
    if (!isAvailableToCreateComposite) {
        return;
    }
    for (let entry of constants_1.COMBINED.entries()) {
        if (entry[1].join("") === a + b) {
            return entry[0];
        }
    }
}
//==================================================================================
const assembleArrayOfLetters = (lettersArray) => {
    let resultString = "";
    let currentBlock = [];
    for (const [idx, letter] of lettersArray.entries()) {
        const blockLength = currentBlock.length;
        // ================================================ 1
        // было почему-то так: !isVowel(letter)
        // if (!blockLength && (isConsonant(letter) || !isVowel(letter))) {
        if (blockLength === 0) {
            if ((0, exports.isConsonant)(letter) || (0, exports.isVowel)(letter)) {
                currentBlock.push(letter);
                continue;
            }
            resultString += letter;
            continue;
        }
        if (blockLength === 1) {
            if ((0, exports.isConsonant)(letter)) {
                const composite = createComposite(currentBlock[0], letter);
                if (composite) {
                    currentBlock[0] = composite;
                    continue;
                }
                resultString += currentBlock[0];
                currentBlock = [letter];
                continue;
            }
            if ((0, exports.isVowel)(letter)) {
                if ((0, exports.isConsonant)(currentBlock[0])) {
                    currentBlock.push(letter);
                    continue;
                }
                if ((0, exports.isVowel)(currentBlock[0])) {
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
            if ((0, exports.isVowel)(letter)) {
                const composite = createComposite(currentBlock[1], letter);
                if (composite) {
                    currentBlock[1] = composite;
                    continue;
                }
            }
            if ((0, exports.isVowel)(lettersArray[idx + 1])) {
                resultString += createBlockFromParts(currentBlock);
                currentBlock = [letter];
                continue;
            }
            if (constants_1.BATCHIMS.find((b) => b[0] === letter)) {
                currentBlock.push(letter);
                continue;
            }
            resultString += createBlockFromParts(currentBlock);
            currentBlock = [letter];
            continue;
        }
        if (blockLength === 3) {
            if ((0, exports.isConsonant)(letter) && !(0, exports.isVowel)(lettersArray[idx + 1])) {
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
const processArrayOfLetters = (letters) => {
    const result = [];
    for (let item of letters) {
        if ((0, utils_1.isString)(item)) {
            result.push(item);
            continue;
        }
        if (Array.isArray(item)) {
            const [a, b] = item;
            if (!(0, utils_1.isString)(a) || !(0, utils_1.isString)(b)) {
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
//
//
//
//
//
//
// =====================================================================
function assemble(letters) {
    if ((0, utils_1.isString)(letters)) {
        const lettersArray = letters.split("");
        return assembleArrayOfLetters(lettersArray);
    }
    if (Array.isArray(letters)) {
        const hasNested = letters.some((i) => Array.isArray(i));
        const lettersArray = hasNested ? processArrayOfLetters(letters) : letters;
        return assembleArrayOfLetters(lettersArray);
    }
    return "";
}
// =====================================================================
// присоедняет букву к слогу (если 2 - то патчим, если 1 - то гласную)
function appendLetter(text, letter) {
    // порследний символ текста
    const base = text.slice(-1);
    const result = assemble(assemble([...disassemble(base), letter]));
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
exports.exportsForTest = {
    assembleArrayOfLetters,
};
// const res1 = assembleArrayOfLetters(["ㅇ", "ㅣ", "ㄷ", "ㄽ", "ㅏ"]);
// console.log(res1);
