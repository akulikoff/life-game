function generateNextGeneration(field) {
  let result = [];
  function countLiveNeighbors(x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;

        let ni = x + i;
        if (ni < 0) ni = field.length - 1;
        if (ni >= field.length) ni = 0;

        let nj = y + j;
        if (nj < 0) nj = field[0].length - 1;
        if (nj >= field[0].length) nj = 0;

        if (field[ni][nj]) {
          count++;
        }
      }
    }
    return count;
  }
  for (let i = 0; i < field.length; i++) {
    result[i] = [];
    for (let j = 0; j < field[i].length; j++) {
      let current = field[i][j];
      let liveNeibors = countLiveNeighbors(i, j);
      if (current) {
        if (liveNeibors == 2 || liveNeibors == 3) {
          result[i][j] = true;
        } else {
          result[i][j] = false;
        }
      } else {
        if (liveNeibors == 3) {
          result[i][j] = true;
        } else {
          result[i][j] = false;
        }
      }
    }
  }
  return result;
}

function assert(expected, got) {
  if (expected.length !== got.length) return false;
  for (let i = 0; i < expected.length; i++) {
    if (expected[i].length !== got[i].length) return false;
    for (let j = 0; j < expected[i].length; j++) {
      if (expected[i][j] !== got[i][j]) return false;
    }
  }
  return true;
}

let cases = [
  //   {
  //     name: "одна сгорает",
  //     args: [
  //       [false, false, false],
  //       [false, true, false],
  //       [false, false, false],
  //     ],
  //     expected: [
  //       [false, false, false],
  //       [false, false, false],
  //       [false, false, false],
  //     ],
  //   },
  {
    name: "крест",
    args: [
      [false, false, false, false],
      [false, false, false, false],
      [true, true, true, false],
      [false, false, false, false],
    ],
    expected: [
      [false, false, false, false],
      [false, true, false, false],
      [false, true, false, false],
      [false, true, false, false],
    ],
  },
  {
    name: "крест 2",
    args: [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [true, true, false, true],
    ],
    expected: [
      [true, false, false, false],
      [false, false, false, false],
      [true, false, false, false],
      [true, false, false, false],
    ],
  },
  {
    name: "квадрат",
    args: [
      [false, false, false, false],
      [false, true, true, false],
      [false, true, true, false],
      [false, false, false, false],
    ],
    expected: [
      [false, false, false, false],
      [false, true, true, false],
      [false, true, true, false],
      [false, false, false, false],
    ],
  },
];
for (let i = 0; i < cases.length; i++) {
  let args = cases[i].args;
  let expected = cases[i].expected;
  let res = generateNextGeneration(args);
  if (assert(expected, res)) {
    console.log(cases[i].name, "ЗАЕБОК");
  } else {
    console.error(cases[i].name, "error");
  }
}
