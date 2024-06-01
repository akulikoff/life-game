

function getCellCoords(i, j, size, width, height){
  let x = 0
  let y = 0
  return {x:x, y:y}
}

function assert(expected, got) {
  return !(expected.x !== got.x || expected.y !== got.y);

}

let cases = [
  {
    name: "Первый тест",
    args: {i:0, j:0, size:10, width:100, height:100},
    expected: {x:0,y:0}
  },
  {
    name: "Второй тест",
    args: {i:0, j:1, size:10,  width:100, height:100},
    expected: {x:0,y:0}
  },
];
for (let i = 0; i < cases.length; i++) {
  let args = cases[i].args;
  let expected = cases[i].expected;
  let res = getCellCoords(args.i, args.j, args.size, args.width, args.height);

  if (assert(expected, res)) {
    console.log(cases[i].name, "ЗАЕБОК");
  } else {
    console.error(cases[i].name, "ERROR", "Ожидаю:", expected, "Получаю:", res);
  }
}