/* TODO
реализовать логику подсчёта соседей и переключения класса
генерацию случайной расстановки живых
проверить работу выбора скорости
удалять слушатели событий после старта
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
document.getElementById("start").addEventListener("click", playGame);
document.getElementById("create").addEventListener("click", handleCreateTable);
document.getElementById("generate").addEventListener("click", generateTable);

field.addEventListener(
  "click",
  function (e) {
    if (e.target.classList.contains("game-table-cell")) {
      e.target.classList.toggle("cell-life");
      [i, j] = getCoordsById(e.target.id);
      if (e.target.classList.contains("cell-life")) {
        fieldData[i][j] = true;
      } else {
        fieldData[i][j] = false;
      }
    }
  },
  true
);
field.addEventListener(
  "mousemove",
  function (e) {
    if (e.buttons === 1 && e) {
      e.target.classList.toggle("cell-life");
      field.classList.remove("cell-life");
      const [i, j] = getCoordsById(e.target.id);
      if (e.target.classList.contains("cell-life")) {
        fieldData[i][j] = true;
      } else {
        fieldData[i][j] = false;
      }
    }
  },
  true
);
function getCoordsById(id) {
  let temp = id.split("-");
  if (temp.length < 3) {
    console.error("неверный ID");
  }
  let x = temp[1];
  let y = temp[2];

  return [x, y];
}
function generateRandomNumber() {
  var min = 10;
  var max = 100;
  var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
}
function generateTable() {
  let rows = generateRandomNumber();
  let cols = generateRandomNumber();
  return createTable(rows, cols);
}
// запуск игры
function playGame(event) {
  let v = speed.value;
  if (!v) {
    v = 1000;
  }
  setInterval(run, v);
}
function stopGame() {
  clearInterval(speed);
}
function generateNextGeneration(field) {
  let result = [];
  for (let i = 0; i < field.length; i++) {
    result[i] = [];
    for (let j = 0; j < field[i].length; j++) {
      if (field[i][j]) {
        result[i][j] = false;
      } else {
        result[i][j] = true;
      }
    }
  }
  return result;
}
function run() {
  fieldData = generateNextGeneration(fieldData);
  console.log("sdv");
  fillTable(fieldData);
}

function create2DArray(rows, cols) {
  let array = [];
  for (let i = 0; i < rows; i++) {
    array[i] = [];
    for (let j = 0; j < cols; j++) {
      array[i][j] = 0; // или любое другое значение по умолчанию
    }
  }
  return array;
}
// Предположим, что у нас есть двумерный массив arr размером 20 на 20

// Определение соседей для элемента в позиции (row, col), включая соседей по диагонали и обработку краевых случаев
function getNeighbors(arr, row, col) {
  let neighbors = [];

  // Проверяем соседние элементы по горизонтали и вертикали
  if (row > 0) {
    neighbors.push(arr[row - 1][col]); // Верхний сосед
  }
  if (row < arr.length - 1) {
    neighbors.push(arr[row + 1][col]); // Нижний сосед
  }
  if (col > 0) {
    neighbors.push(arr[row][col - 1]); // Левый сосед
  }
  if (col < arr[0].length - 1) {
    neighbors.push(arr[row][col + 1]); // Правый сосед
  }

  // Проверяем соседние элементы по диагонали и обрабатываем краевые случаи
  if (row > 0 && col > 0) {
    neighbors.push(arr[row - 1][col - 1]); // Верхний левый сосед
  }
  if (row > 0 && col < arr[0].length - 1) {
    neighbors.push(arr[row - 1][col + 1]); // Верхний правый сосед
  }
  if (row < arr.length - 1 && col > 0) {
    neighbors.push(arr[row + 1][col - 1]); // Нижний левый сосед
  }
  if (row < arr.length - 1 && col < arr[0].length - 1) {
    neighbors.push(arr[row + 1][col + 1]); // Нижний правый сосед
  }

  // Обработка краевых случаев
  if (row === 0) {
    neighbors.push(arr[arr.length - 1][col]); // Верхний сосед (противоположный край)
  }
  if (row === arr.length - 1) {
    neighbors.push(arr[0][col]); // Нижний сосед (противоположный край)
  }
  if (col === 0) {
    neighbors.push(arr[row][arr[0].length - 1]); // Левый сосед (противоположный край)
  }
  if (col === arr[0].length - 1) {
    neighbors.push(arr[row][0]); // Правый сосед (противоположный край)
  }

  return neighbors;
}

function handleCreateTable() {
  var width = document.getElementById("width");
  var height = document.getElementById("height");
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
      var cell = document.getElementById(getCellIdByCoords(i, j));
      if (fieldData[i][j]) {
        cell.classList.add("cell-life");
      } else {
        cell.classList.remove("cell-life");
      }
    }
  }
}
function createTable(rows, columns) {
  if (!rows || !columns || rows <= 0 || columns <= 0) return;
  var field = document.getElementById("field");
  var isExistTable = field !== null;
  if (isExistTable) {
    var element = field;
    element.parentNode.removeChild(element);
  }

  if (rows < 0 || columns < 0) return;
  if (rows > 1000 || columns > 1000) return;
  var table = document.createElement("table");
  document.getElementById("game").appendChild(table);
  table.id = "field";
  //   table.addEventListener("click", function (e) {
  //     if (e.target.classList.contains("game-table-cell")) {
  //       e.target.classList.add("cell-life");
  //     }
  //   });
  //   table.addEventListener("mousemove", function (e) {
  //     if (e.buttons === 1) {
  //       e.target.classList.add("cell-life");
  //     }
  //   });
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

const id = "cell-123-345";
const coords = getCoordsById(id);
console.log(coords); // { x: 123, y: 345 }
