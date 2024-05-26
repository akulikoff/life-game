/* TODO
+реализовать логику подсчёта соседей и переключения класса
 -генерацию случайной расстановки живых
+проверить работу выбора скорости


+проверить создание таблицы (слушатель)
+удалять слушатели событий после старта
+добавить счётчик очков
+добавить логику остановки игры

масштабировать поле 
    минимальные размеры клетки
    максимальные размеры контейнера поля

*/

// генерация дефолтного поля
createTable(50, 50);
let intervalId;
let isPlaying = false;
var speed = document.getElementById("speed");
var fieldData;
var field = document.getElementById("field");
var width = document.getElementById("width");
var height = document.getElementById("height");
var create = document.getElementById("create");
var score = document.getElementById("score");
var stop = document.getElementById("stop");
stop.style.display = "none";

var scoreCounter = 0;
var prevResultArr = [];
document.getElementById("start").addEventListener("click", handlePlayGame);
document.getElementById("create").addEventListener("click", handleCreateTable);
document
  .getElementById("generate")
  .addEventListener("click", handleRandomGenerate);

function handleClickLife(e) {
  if (e.target.classList.contains("game-table-cell")) {
    e.target.classList.toggle("cell-life");
    [i, j] = getCoordsById(e.target.id);
    if (e.target.classList.contains("cell-life")) {
      fieldData[i][j] = true;
    } else {
      fieldData[i][j] = false;
    }
  }
}
function handleMove(e) {
  if (e.buttons === 1 && e.target.classList.contains("game-table-cell")) {
    e.target.classList.toggle("cell-life");
    [i, j] = getCoordsById(e.target.id);
    if (e.target.classList.contains("cell-life")) {
      fieldData[i][j] = true;
      console.log(fieldData[i][j]);
    } else {
      fieldData[i][j] = false;
    }
  }
}
field.addEventListener("click", handleClickLife, true);
field.addEventListener("mousemove", handleMove, true);

function getCoordsById(id) {
  let temp = id.split("-");
  if (temp.length < 3) {
    console.error("неверный ID");
  }
  let x = temp[1];
  let y = temp[2];

  return [x, y];
}

function reGenerateField(field) {
  // TODO
  let result = [];
  let genx = Math.random(0, field.length - 1);
  for (let i = 0; i < field.length; i++) {
    let geny = Math.random(0, field.length[i] - 1);
    for (let j = 0; j < field[i].length; j++) {
      fieldData[genx][geny] = true;
      console.log(genx, geny);
    }
  }
  return result;
}
// запуск игры
function handlePlayGame(e) {
  console.log("start");
  stop.style.display = "block";
  stop.addEventListener("click", stopGame);

  // isPlaying = true;
  scoreCounter = 0;
  let v = speed.value;
  if (!v) {
    v = 50;
  }
  intervalId = setInterval(run, v);
  field.removeEventListener("click", handleClickLife, true);
  field.removeEventListener("mousemove", handleMove, true);
  field.style.cursor = "not-allowed";
}
function stopGame() {
  clearInterval(intervalId);
  field.style.cursor = "pointer";
  alert(`game over \nscore: ${scoreCounter - 1}`);
  isPlaying = false;
  stop.removeEventListener("click", stopGame);
}
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
  let isFinish = assert(prevResultArr, result);
  prevResultArr = result;
  scoreCounter++;
  score.textContent = "Score: " + (scoreCounter - 1);
  if (isFinish) {
    stopGame();
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

function run() {
  fieldData = generateNextGeneration(fieldData);
  renderTable(fieldData);
}

function handleCreateTable() {
  var userRows = width.value;
  var userCols = height.value;
  if (!userRows || !userCols) {
    alert("введите данные");
    return;
  }
  createTable(userRows, userCols);
  width.value = "";
  height.value = "";
  document.getElementById("text").textContent =
    "Game created, your field size: " + userCols + "x" + userRows;
}
function getCellIdByCoords(i, j) {
  return "cell-" + i + "-" + j;
}
function renderTable(fieldData) {
  for (var i = 0; i < fieldData.length; i++) {
    for (var j = 0; j < fieldData[i].length; j++) {
      let cell = document.getElementById(getCellIdByCoords(i, j));
      if (fieldData[i][j]) {
        cell.classList.add("cell-life");
      } else {
        cell.classList.remove("cell-life");
      }
    }
  }
}
function handleRandomGenerate() {
  const field = document.getElementsByClassName("game-table-cell");
  const randomCells = [];
  let x = document.getElementsByTagName("tr").length;
  let y = document.getElementsByTagName("td").length / x;
  console.log("xy", x, y);
  // randomCells.length = field.length;
  createTable(x, y);
  for (var i = 0; i < fieldData.length; i++) {
    // randomCells[i] = field[i].length;
    for (var j = 0; j < fieldData[i].length; j++) {
      if (Math.random() > 0.866) {
        field[i].classList.add("cell-life");
        let cellId = field[i].id;
        const lifeCell = getCoordsById(cellId);
        randomCells.push(lifeCell);
        console.log(randomCells);
        fieldData[i][j] = true;
      } else {
        fieldData[i][j] = false;
      }
      // if (randomCells.includes([i, j])) {
      //   console.log("life", i, j);
      // }
    }
  }
  // for (var i = 0; i < field.length; i++) {}
}

// for (var i = 0; i < fieldData.length; i++) {
//   console.log(genx, geny);
//   let genx = Math.random(0, field.length - 1);
//   for (var j = 0; j < fieldData[i].length; j++) {
//     let geny = Math.random(0, field.length[i] - 1);
//     console.log(genx, geny);
//     var cell = document.getElementById(getCellIdByCoords(genx, geny));

//     cell.classList.add("cell-life");
//   }
// }

function createTable(rows, columns) {
  if (!rows || !columns || rows <= 0 || columns <= 0) return;
  var oldField = document.getElementById("field");
  var isExistTable = oldField !== null;
  if (isExistTable) {
    var element = oldField;
    element.parentNode.removeChild(element);
  }

  if (rows < 0 || columns < 0) return;
  if (rows > 1000 || columns > 1000) return;
  var table = document.createElement("table");
  document.getElementById("game").appendChild(table);
  table.id = "field";
  table.addEventListener("click", handleClickLife, true);
  table.addEventListener("mousemove", handleMove, true);
  // Создаем строки
  fieldData = [];
  for (var i = 0; i < rows; i++) {
    fieldData[i] = [];
    var row = document.createElement("tr");
    // Создаем столбцы
    for (var j = 0; j < columns; j++) {
      fieldData[i][j] = false;
      var cell = document.createElement("td");
      cell.className = "game-table-cell";
      cell.id = getCellIdByCoords(i, j);
      row.appendChild(cell);
    }
    table.appendChild(row);
  }

  return table;
}
