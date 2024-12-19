const { getCharPart, getPartsOffsets, disassembleChar } = require("./utils.js");

// ========================================================= getCharPart
test("get batchim of 가", () => {
  expect(getCharPart("가", 2)).toBe("");
});

test("get initial letter of 가", () => {
  expect(getCharPart("가", 0)).toBe("ㄱ");
});

test("get batchim of 읽", () => {
  expect(getCharPart("읽", 2)).toBe("ㄺ");
});

test("get batchim of 읽다", () => {
  expect(getCharPart("읽", 2)).toBe("ㄺ");
});

test("get consonant of 발", () => {
  expect(getCharPart("발", 1)).toBe("ㅏ");
});

test("get batchim of ㄱ", () => {
  expect(getCharPart("ㄱ", 1)).toBe("");
});

test("get batchim of ㄱ", () => {
  expect(getCharPart("ㄱ", 2)).toBe("");
});

// ========================================================= getPartsOffsets
test("get parts offsetes of 읽", () => {
  expect(getPartsOffsets("읽")).toStrictEqual([11, 20, 9]);
});

test("get parts offsetes of 발", () => {
  expect(getPartsOffsets("발")).toStrictEqual([7, 0, 8]);
});

test("get parts offsetes of 가", () => {
  expect(getPartsOffsets("가")).toStrictEqual([0, 0, 0]);
});

test("get parts offsetes of ㅏ", () => {
  expect(getPartsOffsets("ㅏ")).toStrictEqual([]);
});

test("get parts offsetes of ㄺ", () => {
  expect(getPartsOffsets("ㄺ")).toStrictEqual([]);
});

test("get parts offsetes of w", () => {
  expect(getPartsOffsets("w")).toStrictEqual([]);
});

// ========================================================= getCharPart
test("get 1 char part of ㄱ", () => {
  expect(getCharPart("ㄱ", 1)).toBe("");
});

test("get 1 char part of 가", () => {
  expect(getCharPart("가", 1)).toBe("ㅏ");
});

test("get 1 char part of 읽", () => {
  expect(getCharPart("읽", 1)).toBe("ㅣ");
});

test("get 2 char part of 읽", () => {
  expect(getCharPart("읽", 2)).toBe("ㄺ");
});

test("get 2 char part of 가", () => {
  expect(getCharPart("가", 2)).toBe("");
});

// ========================================================= disassembleChar;

test("disassembling of char 가", () => {
  expect(disassembleChar("가")).toStrictEqual(["ㄱ", "ㅏ"]);
});

test("disassembling of char 읽", () => {
  expect(disassembleChar("읽")).toStrictEqual(["ㅇ", "ㅣ", "ㄹ", "ㄱ"]);
});

test("disassembling of char 빵", () => {
  expect(disassembleChar("빵")).toStrictEqual(["ㅃ", "ㅏ", "ㅇ"]);
});

test("disassembling of char 과", () => {
  expect(disassembleChar("과")).toStrictEqual(["ㄱ", "ㅗ", "ㅏ"]);
});
