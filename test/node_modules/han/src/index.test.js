const {
  isJamo,
  getCharParts,
  isCombined,
  isHangul,
  replaceConsonant,
  replaceVowel,
  replaceBatchim,
  appendLetter,
} = require("./index.js");
const { exportsForTest } = require("./index.js");
const { assembleArrayOfLetters } = exportsForTest;

test("is ㄸ jamo: true", () => {
  expect(isJamo("ㄸ")).toBe(true);
});

test("is ㄻ jamo: true", () => {
  expect(isJamo("ㄻ")).toBe(true);
});

test("is ㄹ jamo: true", () => {
  expect(isJamo("ㄹ")).toBe(true);
});

test("is 가 jamo: false", () => {
  expect(isJamo("가")).toBe(false);
});

test("get char parts of 발", () => {
  expect(getCharParts("발", 1)).toStrictEqual(["ㅂ", "ㅏ", "ㄹ"]);
});

test("is ㅚ a combination", () => {
  expect(isCombined("ㅚ")).toBe(true);
});

test("is ㅚ hangul", () => {
  expect(isHangul("ㅚ")).toBe(true);
});

test("is 발 hangul", () => {
  expect(isHangul("발")).toBe(true);
});

test("is ㅏ hangul", () => {
  expect(isHangul("ㅏ")).toBe(true);
});

test("is ㄻ hangul", () => {
  expect(isHangul("ㄻ")).toBe(true);
});

test("is ㄸ hangul", () => {
  expect(isHangul("ㄸ")).toBe(true);
});

test("is m hangul", () => {
  expect(isHangul("m")).toBe(false);
});

// ================================================= assembling

test("assembling ㅂ ㅏ ㄹ", () => {
  expect(assembleArrayOfLetters(["ㅂ", "ㅏ", "ㄹ"])).toBe("발");
});

test("assembling ㅏ ㄹ", () => {
  expect(assembleArrayOfLetters(["ㅏ", "ㄹ"])).toBe("ㅏㄹ");
});

test("assembling ㅂ ㅏ ㅂ ㅏ ㄹ", () => {
  expect(assembleArrayOfLetters(["ㅂ", "ㅏ", "ㅂ", "ㅏ", "ㄹ"])).toBe("바발");
});

test("assembling ㅇㅣㄹㅅㄷㅏ", () => {
  expect(assembleArrayOfLetters(["ㅇ", "ㅣ", "ㄹ", "ㅅ", "ㄷ", "ㅏ"])).toBe("잀다");
});

test("assembling ㅇㅣㄹㅅㅏ", () => {
  expect(assembleArrayOfLetters(["ㅇ", "ㅣ", "ㄹ", "ㅅ", "ㅏ"])).toBe("일사");
});

test("assembling ㅇㅣㄹㄷㅏ", () => {
  expect(assembleArrayOfLetters(["ㅇ", "ㅣ", "ㄹ", "ㄷ", "ㅏ"])).toBe("일다");
});

test("assembling ㅇㅣㄱㄱㄷㅏ", () => {
  expect(assembleArrayOfLetters(["ㅇ", "ㅣ", "ㄱ", "ㄱ", "ㄷ", "ㅏ"])).toBe("익ㄱ다");
});

test("assembling ㅇㅣㄱㅏ", () => {
  expect(assembleArrayOfLetters(["ㅇ", "ㅣ", "ㄱ", "ㅏ"])).toBe("이가");
});

test("assembling ㅇㅣㄽㄷㅏ", () => {
  expect(assembleArrayOfLetters(["ㅇ", "ㅣ", "ㄽ", "ㄷ", "ㅏ"])).toBe("잀다");
});

test("assembling ㅇㅣㄷㄽㅏ", () => {
  expect(assembleArrayOfLetters(["ㅇ", "ㅣ", "ㄷ", "ㄽ", "ㅏ"])).toBe("읻ㄽㅏ");
});

// ================================================= replaceConsonant

test("replacing consonant in 마 with ㄷ", () => {
  expect(replaceConsonant("마", "ㄷ")).toBe("다");
});

test("replacing consonant in 안 with ㅁ", () => {
  expect(replaceConsonant("안", "ㅁ")).toBe("만");
});

test("replacing consonant in 안마 with ㅁ", () => {
  expect(replaceConsonant("안마", "ㅁ")).toBe("안마");
});

test("replacing consonant in 안 with ㅁㄷ", () => {
  expect(replaceConsonant("안", "ㅁㄷ")).toBe("안");
});

test("replacing consonant in lol with ㄷ", () => {
  expect(replaceConsonant("lol", "ㄷ")).toBe("lol");
});

test("replacing consonant in q with ㅁ", () => {
  expect(replaceConsonant("q", "ㅁ")).toBe("q");
});

test("replacing consonant in 안 with q", () => {
  expect(replaceConsonant("안", "q")).toBe("안");
});

test("replacing consonant in 마 with w", () => {
  expect(replaceConsonant("마", "w")).toBe("마");
});

test("replacing consonant in q with w", () => {
  expect(replaceConsonant("q", "w")).toBe("q");
});

test("replacing consonant in q with wy", () => {
  expect(replaceConsonant("q", "wy")).toBe("q");
});

// ================================================= replaceVowel

test("replacing vowel in 인 with ㅏ", () => {
  expect(replaceVowel("인", "ㅏ")).toBe("안");
});

// ================================================= appendLetter

test("adding a letter ㄴ to 잠깐마", () => {
  expect(appendLetter("잠깐마", "ㄴ")).toBe("잠깐만");
});

// ========================================================= getCharParts
test("get char parts of 읽", () => {
  expect(getCharParts("읽")).toStrictEqual(["ㅇ", "ㅣ", "ㄺ"]);
});
