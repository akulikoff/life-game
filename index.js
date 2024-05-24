// генерация дефолтного поля
createTable(20, 20);

var speed = document.getElementById("speed");

var field = document.getElementById("field");
document.getElementById("start").addEventListener("click", playGame);
document.getElementById("create").addEventListener("click", handleCreateTable);
document.getElementById("generate").addEventListener("click", generateTable);

field.addEventListener("click", function (e) {
  if (e.target.classList.contains("game-table-cell")) {
    e.target.classList.add("cell-life");
  }
});
field.addEventListener("mousemove", function (e) {
  if (e.buttons === 1) {
    e.target.classList.add("cell-life");
    field.classList.remove("cell-life");
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
// запуск игры
function playGame(speed) {
  if (!speed) {
    speed = 1000;
  }

  setInterval(generateNextGeneration(), speed);
}
function stopGame() {
  clearInterval(speed);
}
function generateNextGeneration() {
  // Получение всех ячеек с классом "life"
  const cells = Array.from(document.getElementsByClassName("cell-life"));
  if (cells.length === 0) {
    stopGame();
  }
  console.log(cells);
  // Перебор каждой ячейки
  cells.forEach((cell) => {
    // Получение координат текущей ячейки
    const row = parseInt(cell.parentNode.rowIndex);
    const col = parseInt(cell.cellIndex);

    // Получение соседних элементов
    const neighbors = getNeighbors(field, row, col);
    console.log(neighbors);

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
      cell.className = "game-table-cell";
      cell.id = "cell-" + i + "-" + j;
      row.appendChild(cell);
    }

    table.appendChild(row);
  }

  return table;
}
