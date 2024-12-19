const han = require("han");
const utils = require("./utils");

let res;

console.log(
  "= = = = = = = = = = = = = = = = = = = = = = = = Disassembling = = = = = = = = = = = = = = = = = = = = = = = =\n"
);

res = han.disassemble("가나다");
utils.checkDisassembling("가나다", res, ["ㄱ", "ㅏ", "ㄴ", "ㅏ", "ㄷ", "ㅏ"]);

res = han.disassemble("ab가c");
utils.checkDisassembling("ab가c", res, ["a", "b", "ㄱ", "ㅏ", "c"]);

res = han.disassemble("ab@!23X.");
utils.checkDisassembling("ab@!23X.", res, [
  "a",
  "b",
  "@",
  "!",
  "2",
  "3",
  "X",
  ".",
]);

res = han.disassemble("ㄲ");
utils.checkDisassembling("ㄲ", res, ["ㄲ"]);

res = han.disassemble("ㄳ");
utils.checkDisassembling("ㄳ", res, ["ㄱ", "ㅅ"]);

res = han.disassemble("ㅚ", {
  chunked: true,
});
utils.checkDisassembling("ㅚ", res, ["ㅗ", "ㅣ"]);

res = han.disassemble("사과", {
  //   chunked: true,
});
utils.checkDisassembling("사과", res, ["ㅅ", "ㅏ", "ㄱ", "ㅗ", "ㅏ"]);

res = han.disassemble("읽다");
utils.checkDisassembling("읽다", res, ["ㅇ", "ㅣ", "ㄹ", "ㄱ", "ㄷ", "ㅏ"]);

// Hangul.d('매드캣MK2', true);
// [['ㅁ', 'ㅐ'], ['ㄷ', 'ㅡ'], ['ㅋ', 'ㅐ', 'ㅅ'], ['M'], ['K'], ['2']]

console.log(
  "\n\n\n= = = = = = = = = = = = = = = = = = = = = = = = = Assembling = = = = = = = = = = = = = = = = = = = = = = = = =\n"
);

res = han.assemble(["ㄱ", "ㅏ", "ㄴ", "ㅏ", "ㄷ", "ㅏ"]);
utils.checkAssembling(["ㄱ", "ㅏ", "ㄴ", "ㅏ", "ㄷ", "ㅏ"], res, "가나다");

res = han.assemble(["a", "b", "ㄱ", "ㅏ", "c"]);
utils.checkAssembling(["a", "b", "ㄱ", "ㅏ", "c"], res, "ab가c");

res = han.assemble(["a", "b", "@", "1", "2", "3", "X", "."]);
utils.checkAssembling(
  ["a", "b", "@", "1", "2", "3", "X", "."],
  res,
  "ab@123X."
);

res = han.assemble(["ㅗ", "ㅐ"]);
utils.checkAssembling(["ㅗ", "ㅐ"], res, "ㅙ");

res = han.assemble(["ㄹ", "ㅂ", "ㅅ"]);
utils.checkAssembling(["ㄹ", "ㅂ", "ㅅ"], res, "ㄼㅅ");

// Hangul.a(Hangul.d('옽ㅏ')); // '오타' ('옽ㅏ' 가 아님)

res = han.assemble(han.disassemble("옽ㅏ"));
utils.checkAssembling("옽ㅏ", res, "오타");

res = han.assemble(["ㅇ", "ㅗ", "ㅌ", "ㅏ"]);
utils.checkAssembling(["ㅇ", "ㅗ", "ㅌ", "ㅏ"], res, "오타");
