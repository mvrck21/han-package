function checkDisassembling(original, result, expect) {
  const isSame = result.join("-") === expect.join("-");

  if (isSame) {
    console.log(
      `Successfully disassembled ${JSON.stringify(
        original
      )} to ${JSON.stringify(result)}\n`
    );

    return;
  }

  console.log(
    `Failed disassembling ${JSON.stringify(
      original
    )}. Expected ${JSON.stringify(expect)} but got ${JSON.stringify(result)}\n`
  );
}

function checkAssembling(original, result, expect) {
  const isSame = result === expect;

  if (isSame) {
    console.log(
      `Successfully assembled ${JSON.stringify(original)} to ${JSON.stringify(
        result
      )}\n`
    );

    return;
  }

  console.log(
    `Failed assembling ${JSON.stringify(original)}. Expected ${JSON.stringify(
      expect
    )} but got ${JSON.stringify(result)}\n`
  );
}

exports.checkDisassembling = checkDisassembling;
exports.checkAssembling = checkAssembling;
