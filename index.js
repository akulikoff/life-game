createTable(20, 20);
var speed = document.getElementById("speed");
var field = document.getElementById("field");
field.addEventListener("click", function (e) {
  if (e.target.classList.contains("game-table-cell")) {
    e.target.classList.add("cell-life");
  }
});
field.addEventListener("mousemove", function (e) {
  if (e.buttons === 1) {
    e.target.classList.add("cell-life");
  }
});
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
function playGame(speed) {
  setInterval(generateNextGeneration(), speed);
}
function generateNextGeneration() {
  // Получение всех ячеек с классом "life"
  const cells = document.querySelectorAll(".cell-life");

  // Перебор каждой ячейки
  cells.forEach((cell) => {
    // Получение координат текущей ячейки
    const row = cell.parentNode.rowIndex;
    const col = cell.cellIndex;

    // Получение соседних элементов
    const neighbors = getNeighbors(cells, row, col);

    // Проверка условий и применение класса "life"
    if (cell.classList.contains("cell-life")) {
      if (neighbors.length < 2 || neighbors.length > 3) {
        cell.classList.remove("cell-life");
      }
    } else {
      if (neighbors.length === 3) {
        cell.classList.add("cell-life");
      }
    }
  });
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
function getNeighbors(array, row, col) {
  const numRows = array.length;
  const numCols = array[0].length;

  const neighbors = [];

  // Проверка соседей вокруг элемента
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      // Исключаем элемент самого себя
      if (i === 0 && j === 0) continue;

      const neighborRow = (row + i + numRows) % numRows; // Определение индекса строки соседа с учетом противоположного края
      const neighborCol = (col + j + numCols) % numCols; // Определение индекса столбца соседа с учетом противоположного края

      neighbors.push(array[neighborRow][neighborCol]);
    }
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
  table.addEventListener("click", function (e) {
    if (e.target.classList.contains("game-table-cell")) {
      e.target.classList.add("cell-life");
    }
  });
  table.addEventListener("mousemove", function (e) {
    if (e.buttons === 1) {
      e.target.classList.add("cell-life");
    }
  });
  // Создаем строки
  for (var i = 0; i < rows; i++) {
    var row = document.createElement("tr");

    // Создаем столбцы
    for (var j = 0; j < columns; j++) {
      var cell = document.createElement("td");
      cell.className = "game-table-cell cell-" + i + "-" + j;

      row.appendChild(cell);
    }

    table.appendChild(row);
  }

  return table;
}
