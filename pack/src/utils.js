"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isString = isString;
exports.isSingleChar = isSingleChar;
exports.getPartsOffsets = getPartsOffsets;
exports.getCharPart = getCharPart;
exports.romanizeSyllable = romanizeSyllable;
exports.disassembleChar = disassembleChar;
const index_1 = require("./index");
const constants_1 = require("./constants");
function isString(data) {
    return typeof data === "string";
}
// проверяет, что длина строки равна 1
function isSingleChar(data) {
    return isString(data) && data.length === 1;
}
// возвращает оффсеты для каждой буквы (согласная, гласная, патчим) в слоге ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function getPartsOffsets(char) {
    if (!isString(char) || !(0, index_1.isSyllable)(char)) {
        return [];
    }
    let charOffset = char.charCodeAt(0) - constants_1.SYLLABLES_OFFSET;
    let idx = charOffset % constants_1.BATCHIMS_COUNT;
    const batchim = idx;
    charOffset = (charOffset - idx) / constants_1.BATCHIMS_COUNT;
    idx = charOffset % constants_1.VOWELS_COUNT;
    const vowel = idx;
    const consonant = (charOffset - idx) / constants_1.VOWELS_COUNT;
    return [consonant, vowel, batchim];
}
// возвращает определенную букву из слога - по ее позиции - 0 (согласная), 1 (гласная), 2 (патчим)  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function getCharPart(char, position) {
    var _a;
    if (!isString(char) || !(0, index_1.isSyllable)(char)) {
        return "";
    }
    return (_a = (0, index_1.getCharParts)(char)[position]) !== null && _a !== void 0 ? _a : "";
}
function romanizeSyllable(syllable) {
    const parts = getPartsOffsets(syllable);
    if (parts.length === 0) {
        return "";
    }
    const [cIdx, vIdx, bIdx] = parts;
    return constants_1.CONSONANTS[cIdx][1] + constants_1.VOWELS[vIdx][1] + constants_1.BATCHIMS[bIdx][1];
}
// разобрать слог на мельчайшие части - если буква составная, то тоже будет разложена
function disassembleChar(char) {
    const [consonant, vowel, batchim] = (0, index_1.getCharParts)(char);
    // TODO: переделать, потому что непонятно, какой должен быть результат
    // если первый - составной, то он останется массивом, а все последующие массивы
    // будут развернуты
    return []
        .concat(constants_1.COMBINED.get(consonant) || consonant || [])
        .concat(constants_1.COMBINED.get(vowel) || vowel || [])
        .concat(constants_1.COMBINED.get(batchim) || batchim || []);
    // return [COMBINED.get(consonant) || consonant]
    //   .concat(COMBINED.get(vowel) || vowel || [])
    //   .concat(COMBINED.get(batchim) || batchim || []);
}
