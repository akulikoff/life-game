/* TODO
+реализовать логику подсчёта соседей и переключения класса
 -генерацию случайной расстановки живых
+проверить работу выбора скорости


провверить создание таблицы (слушатель)
+удалять слушатели событий после старта
добавить счётчик очков
добавить логику остановки игры

масштабировать поле 
    минимальные размеры клетки
    максимальные размеры контейнера поля

*/

// генерация дефолтного поля
createTable(20, 20);
var speed = document.getElementById("speed");
var fieldData;
var field = document.getElementById("field");
var width = document.getElementById("width");
var height = document.getElementById("height");
var create = document.getElementById("create");

document.getElementById("start").addEventListener("click", playGame);
document.getElementById("create").addEventListener("click", handleCreateTable);
document.getElementById("generate").addEventListener("click", reGenerateField);

function clickLife(e) {
  if (e.target.classList.contains("game-table-cell")) {
    e.target.classList.toggle("cell-life");
    const [i, j] = getCoordsById(e.target.id);
    if (e.target.classList.contains("cell-life")) {
      fieldData[i][j] = true;
    } else {
      fieldData[i][j] = false;
    }
  }
}
function drawLife(e) {
  if (e.buttons === 1 && e.target.classList.contains("game-table-cell")) {
    e.target.classList.toggle("cell-life");
    field.classList.remove("cell-life");
    const [i, j] = getCoordsById(e.target.id);
    if (e.target.classList.contains("cell-life")) {
      fieldData[i][j] = true;
    } else {
      fieldData[i][j] = false;
    }
  }
}
field.addEventListener("click", clickLife, true);
field.addEventListener("mousemove", drawLife, true);
function isDisabledCreatedBtn() {
  if (userCols > 0 && userRows > 0) {
    console.log(create);
    document.getElementById("create").disabled = false;
  } else {
    document.getElementById("create").disabled = true;
  }
}
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
      result[genx][geny] = true;
      console.log(genx, geny);
    }
  }
  return result;
}
// запуск игры
function playGame(event) {
  let v = speed.value;
  if (!v) {
    v = 50;
  }
  setInterval(run, v);
  field.removeEventListener("click", clickLife, true);
  field.removeEventListener("mousemove", drawLife, true);
  field.style.cursor = "not-allowed";
}
function stopGame() {
  clearInterval(speed);
  field.style.cursor = "pointer";
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

  return result;
}
function run() {
  fieldData = generateNextGeneration(fieldData);
  fillTable(fieldData);
}

function handleCreateTable() {
  var userRows = width.value;
  var userCols = height.value;
  createTable(userRows, userCols);
}
function getCellIdByCoords(i, j) {
  return "cell-" + i + "-" + j;
}
function fillTable(fieldData) {
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
function randomFillTable(fieldData) {
  for (var i = 0; i < fieldData.length; i++) {
    console.log(genx, geny);
    let genx = Math.random(0, field.length - 1);
    for (var j = 0; j < fieldData[i].length; j++) {
      let geny = Math.random(0, field.length[i] - 1);
      console.log(genx, geny);
      var cell = document.getElementById(getCellIdByCoords(genx, geny));

      cell.classList.add("cell-life");
    }
  }
}
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
  table.addEventListener("click", clickLife, true);
  table.addEventListener("mousemove", drawLife, true);
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
