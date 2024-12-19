"use strict";
// letter = jamo = not syllable
Object.defineProperty(exports, "__esModule", { value: true });
exports.SYLLABLES_MAX = exports.SYLLABLES_OFFSET = exports.LETTERS_MAX = exports.LETTERS_OFFSET = exports.BATCHIMS_COUNT = exports.VOWELS_COUNT = exports.COMBINED = exports.BATCHIMS = exports.VOWELS = exports.CONSONANTS = exports.letterForms = void 0;
// isLetter = isJamo
// consonant - Jaeum
// vowel     - Moeum
// basic, tense, aspirated
exports.letterForms = [
    ["ㄱ", "ㄲ", "ㅋ"],
    ["ㄷ", "ㄸ", "ㅌ"],
    ["ㅂ", "ㅃ", "ㅍ"],
    ["ㅅ", "ㅆ"],
    ["ㅈ", "ㅉ", "ㅊ"],
];
// cho / choseong - initial sound
exports.CONSONANTS = [
    ["ㄱ", "g"],
    ["ㄲ", "kk"],
    ["ㄴ", "n"],
    ["ㄷ", "d"],
    ["ㄸ", "tt"],
    ["ㄹ", "r"],
    ["ㅁ", "m"],
    ["ㅂ", "b"],
    ["ㅃ", "pp"],
    ["ㅅ", "s"],
    ["ㅆ", "ss"],
    ["ㅇ", ""],
    ["ㅈ", "j"],
    ["ㅉ", "jj"],
    ["ㅊ", "ch"],
    ["ㅋ", "k"],
    ["ㅌ", "t"],
    ["ㅍ", "p"],
    ["ㅎ", "h"],
];
//  jung / jungseong - medial sound
exports.VOWELS = [
    ["ㅏ", "a"],
    ["ㅐ", "ae"],
    ["ㅑ", "ya"],
    ["ㅒ", "yee"],
    ["ㅓ", "eo"],
    ["ㅔ", "e"],
    ["ㅕ", "yeo"],
    ["ㅖ", "ye"],
    ["ㅗ", "o"],
    ["ㅘ", "wa"],
    ["ㅙ", "wae"],
    ["ㅚ", "oe"],
    ["ㅛ", "yo"],
    ["ㅜ", "u"],
    ["ㅝ", "wo"],
    ["ㅞ", "we"],
    ["ㅟ", "wi"],
    ["ㅠ", "yu"],
    ["ㅡ", "eu"],
    ["ㅢ", "ui"],
    ["ㅣ", "i"],
];
// jong / jongseong - final sound
exports.BATCHIMS = [
    ["", ""],
    ["ㄱ", "k"],
    ["ㄲ", "k"],
    ["ㄳ", "kt"],
    ["ㄴ", "n"],
    ["ㄵ", "nt"],
    ["ㄶ", "nh"],
    ["ㄷ", "t"],
    ["ㄹ", "l"],
    ["ㄺ", "lk"],
    ["ㄻ", "lm"],
    ["ㄼ", "lp"],
    ["ㄽ", "lt"],
    ["ㄾ", "lt"],
    ["ㄿ", "lp"],
    ["ㅀ", "lh"],
    ["ㅁ", "m"],
    ["ㅂ", "p"],
    ["ㅄ", "pt"],
    ["ㅅ", "t"],
    ["ㅆ", "tt"],
    ["ㅇ", "ng"],
    ["ㅈ", "t"],
    ["ㅊ", "t"],
    ["ㅋ", "k"],
    ["ㅌ", "t"],
    ["ㅍ", "p"],
    ["ㅎ", "h"],
];
exports.COMBINED = new Map([
    ["ㅟ", ["ㅜ", "ㅣ"]],
    ["ㅢ", ["ㅡ", "ㅣ"]],
    ["ㅘ", ["ㅗ", "ㅏ"]],
    ["ㅝ", ["ㅜ", "ㅓ"]],
    ["ㅙ", ["ㅗ", "ㅐ"]],
    ["ㅚ", ["ㅗ", "ㅣ"]],
    ["ㅞ", ["ㅜ", "ㅔ"]],
    // ㅒㅖ ㅔ
    // ㅐ -> ㅏ + ㅣ
    // ㅔ -> ㅓ +
    ["ㄳ", ["ㄱ", "ㅅ"]],
    ["ㄵ", ["ㄴ", "ㅈ"]],
    ["ㄶ", ["ㄴ", "ㅎ"]],
    ["ㄺ", ["ㄹ", "ㄱ"]],
    ["ㄻ", ["ㄹ", "ㅁ"]],
    ["ㄼ", ["ㄹ", "ㅂ"]],
    ["ㄽ", ["ㄹ", "ㅅ"]],
    ["ㄾ", ["ㄹ", "ㅌ"]],
    ["ㄿ", ["ㄹ", "ㅍ"]],
    ["ㅀ", ["ㄹ", "ㅎ"]],
    ["ㅄ", ["ㅂ", "ㅅ"]],
]);
// 1) дать альтернатиные имена для согласной, гласной и патчима - jung, jong и тд
// 2) находить в тексте измененные слова, получив слово в форме инфинитива, если глагол или прилагательное
// и в одиночной форме, если существительное - это вряд ли
const consonantsCount = exports.CONSONANTS.length;
exports.VOWELS_COUNT = exports.VOWELS.length;
exports.BATCHIMS_COUNT = exports.BATCHIMS.length;
exports.LETTERS_OFFSET = 12593;
exports.LETTERS_MAX = 12643;
exports.SYLLABLES_OFFSET = 44032;
exports.SYLLABLES_MAX = 55203;
