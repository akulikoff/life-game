

function getCellCoords(i, j, cellWidth, cellHeight){
  let x = i * cellWidth
  let y = j * cellHeight
  return {x:x, y:y}
}

function assert(expected, got) {
  return !(expected.x !== got.x || expected.y !== got.y);

}

let cases = [
  {
    name: "Нулевая позиция",
    args: {i:0, j:0, cellWidth:10, cellHeight:10},
    expected: {x:0,y:0}
  },
  {
    name: "Перваям позиция",
    args: {i:0, j:1, cellWidth:17, cellHeight:17,},
    expected: {x:0,y:17}
  },
  {
    name: "Вторая позиция",
    args: {i:0, j:2, cellWidth:17, cellHeight:17,},
    expected: {x:0,y:34}
  },
  {
    name: "Две ячейки",
    args: {i:1, j:1, cellWidth:10, cellHeight:10,},
    expected: {x:10,y:10}
  },
  {
    name: "Большие индексы",
    args: {i:5, j:5, cellWidth:20, cellHeight:20,},
    expected: {x:100,y:100}
  },
  {
    name: "Нулевые размеры ячеек ERROR!!!! TODO",
    args: {i:1, j:1, cellWidth:0, cellHeight:0,},
    expected: {x:Infinity, y:Infinity}
  },
  {
    name: "Нулевые размеры поля ERROR!!!! TODO",
    args: {i:1, j:1, cellWidth:10, cellHeight:10,},
    expected: {x:0, y:0}
  },
  {
    name: "Негативные индексы ERROR!!!! TODO",
    args: {i:-1, j:-1, cellWidth:10, cellHeight:10,},
    expected: {x:-10, y:-10}
  },
  {
    name: "ERROR!!!! TODO",
    args: {i:15, j:15, cellWidth:10, cellHeight:10,},
    expected: {x:150, y:150}
  }
];
for (let i = 0; i < cases.length; i++) {
  let args = cases[i].args;
  let expected = cases[i].expected;
  let res = getCellCoords(args.i, args.j, args.cellWidth, args.cellHeight);

  if (assert(expected, res)) {
    console.log(cases[i].name, "ЗАЕБОК");
  } else {
    console.error(cases[i].name, "ERROR", "Ожидаю:", expected, "Получаю:", res);
  }
}