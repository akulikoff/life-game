var speed = document.getElementById("speed");
var field = document.getElementById("field");
field.addEventListener("click", function (e) {
  if (event.target.classList.contains("game-table-cell")) {
    event.target.classList.add("cell-life");
  }
});
field.addEventListener("mousemove", function (e) {
  if (event.buttons === 1) {
    event.target.classList.add("cell-life");
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
function handleCreateTable() {
  var width = document.getElementById("width");
  var height = document.getElementById("height");
  var userRows = width.value;
  var userCols = height.value;
  console.log(userRows, userCols);
  createTable(userRows, userCols);
}
function createTable(rows, columns) {
  var field = document.getElementById("field");
  var isExistTable = field !== null;
  if (isExistTable) {
    var element = document.getElementById("field");
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
      cell.classList.add("game-table-cell");
      row.appendChild(cell);
    }

    table.appendChild(row);
  }

  return table;
}
