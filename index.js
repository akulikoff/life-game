/* TODO
+реализовать логику подсчёта соседей и переключения класса
+генерацию случайной расстановки живых
+проверить работу выбора скорости


+проверить создание таблицы (слушатель)
+удалять слушатели событий после старта
+добавить счётчик очков
+добавить логику остановки игры

-переписать на Class
-добавить наследование
-использовать canvas
масштабировать поле 
    минимальные размеры клетки
    максимальные размеры контейнера поля

*/

// генерация дефолтного поля
// createTable(50, 50);

class Game {
  state = [];
  scoreCounter = 0;
  prevResultArr = [];
  handleClickLife(e) {
    if (e.target.classList.contains("game-table-cell")) {
      e.target.classList.toggle("cell-life");
      const [i, j] = this.getCoordsById(e.target.id);
      if (e.target.classList.contains("cell-life")) {
        this.state[i][j] = true;
      } else {
        this.state[i][j] = false;
      }
    }
  }
  handleMove(e) {
    if (e.buttons === 1 && e.target.classList.contains("game-table-cell")) {
      e.target.classList.toggle("cell-life");
      const [i, j] = this.getCoordsById(e.target.id);
      if (e.target.classList.contains("cell-life")) {
        this.state[i][j] = true;
        console.log(this.state[i][j]);
      } else {
        this.state[i][j] = false;
      }
    }
  }

  getCoordsById(id) {
    let temp = id.split("-");
    if (temp.length < 3) {
      console.error("неверный ID");
    }
    let x = temp[1];
    let y = temp[2];

    return [x, y];
  }

  reGenerateField(field) {
    // TODO
    let result = [];
    let genx = Math.random(0, field.length - 1);
    for (let i = 0; i < field.length; i++) {
      let geny = Math.random(0, field.length[i] - 1);
      for (let j = 0; j < field[i].length; j++) {
        this.state[genx][geny] = true;
        console.log(genx, geny);
      }
    }
    return result;
  }
  // запуск игры
  handlePlayGame(e) {
    console.log("start");
    stop.style.display = "block";
    stop.addEventListener("click", this.stopGame.bind(this));

    // isPlaying = true;
    scoreCounter = 0;
    let v = speed.value;
    if (!v) {
      v = 50;
    }
    intervalId = setInterval(this.run, v);
    field.removeEventListener("click", this.handleClickLife.bind(this), true);
    field.removeEventListener("mousemove", this.handleMove.bind(this), true);
    field.style.cursor = "not-allowed";
  }
  stopGame() {
    clearInterval(intervalId);
    field.style.cursor = "pointer";
    alert(`game over \nscore: ${scoreCounter - 1}`);
    isPlaying = false;
    stop.removeEventListener("click", stopGame);
  }
  generateNextGeneration(field) {
    let result = [];
    let countLiveNeighbors = function countLiveNeighbors(x, y) {
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
    };
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
    let isFinish = assert(this.prevResultArr, result);
    this.prevResultArr = result;
    this.scoreCounter++;
    score.textContent = "Score: " + (this.scoreCounter - 1);
    if (isFinish) {
      stopGame();
    }
    return result;
  }
  assert(expected, got) {
    if (expected.length !== got.length) return false;
    for (let i = 0; i < expected.length; i++) {
      if (expected[i].length !== got[i].length) return false;
      for (let j = 0; j < expected[i].length; j++) {
        if (expected[i][j] !== got[i][j]) return false;
      }
    }
    return true;
  }

  run() {
    this.state = this.generateNextGeneration(this.state);
    this.renderTable(this.state);
  }

  handleCreateTable() {
    var userRows = width.value;
    var userCols = height.value;
    if (!userRows || !userCols) {
      alert("введите данные");
      return;
    }
    this.createTable(userRows, userCols);
    width.value = "";
    height.value = "";
    document.getElementById("text").textContent =
      "Game created, your field size: " + userCols + "x" + userRows;
  }
  getCellIdByCoords(i, j) {
    return "cell-" + i + "-" + j;
  }
  renderTable(fieldData) {
    for (var i = 0; i < fieldData.length; i++) {
      for (var j = 0; j < fieldData[i].length; j++) {
        let cell = document.getElementById(this.getCellIdByCoords(i, j));
        if (fieldData[i][j]) {
          cell.classList.add("cell-life");
        } else {
          cell.classList.remove("cell-life");
        }
      }
    }
  }
  genRandom(st) {
    let result = [];
    for (let i = 0; i < st.length; i++) {
      result[i] = [];
      for (let j = 0; j < st[i].length; j++) {
        if (Math.random() > 0.866) {
          result[i][j] = true;
        } else {
          result[i][j] = false;
        }
      }
    }
    return result;
  }
  handleRandomGenerate(e) {
    this.state = this.genRandom(this.state);
    this.renderTable(this.state);
  }

  createTable(rows, columns) {
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
    table.addEventListener("click", this.handleClickLife.bind(this), true);
    table.addEventListener("mousemove", this.handleMove.bind(this), true);
    // Создаем строки
    this.state = [];
    for (var i = 0; i < rows; i++) {
      this.state[i] = [];
      var row = document.createElement("tr");
      // Создаем столбцы
      for (var j = 0; j < columns; j++) {
        this.state[i][j] = false;
        var cell = document.createElement("td");
        cell.className = "game-table-cell";
        cell.id = this.getCellIdByCoords(i, j);
        row.appendChild(cell);
      }
      table.appendChild(row);
    }
  }
}
let game = new Game();
game.createTable(20, 20);
let intervalId;
let isPlaying = false;
var speed = document.getElementById("speed");
var field = document.getElementById("field");
var width = document.getElementById("width");
var height = document.getElementById("height");
var create = document.getElementById("create");
var score = document.getElementById("score");
var stop = document.getElementById("stop");
stop.style.display = "none";

document
  .getElementById("start")
  .addEventListener("click", game.handlePlayGame.bind(game));
document
  .getElementById("create")
  .addEventListener("click", game.handleCreateTable.bind(game));
// document
//   .getElementById("generate")
//   .addEventListener("click", handleRandomGenerate);
// field.addEventListener("click", handleClickLife, true);
// field.addEventListener("mousemove", handleMove, true);
