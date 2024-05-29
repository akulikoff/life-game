/* TODO
+реализовать логику подсчёта соседей и переключения класса
+генерацию случайной расстановки живых
+проверить работу выбора скорости


+проверить создание таблицы (слушатель)
+удалять слушатели событий после старта
+добавить счётчик очков
+добавить логику остановки игры

+переписать на Class
-добавить наследование
-использовать canvas
масштабировать поле 
    минимальные размеры клетки
    максимальные размеры контейнера поля

*/
var speedInput = document.getElementById("speed");
var field = document.getElementById("field");
var width = document.getElementById("width");
var height = document.getElementById("height");
var createBtn = document.getElementById("create");
var score = document.getElementById("score");
var stopBtn = document.getElementById("stop");
var textContent = document.getElementById("text");
class Game {
  intervalId;
  state = [];
  scoreCounter = 0;
  prevResultArr = [];
  // dom = {
  //   instance,
  //   field: document.getElementById("field"),
  //   createBtn: document.getElementById("create"),
  //   widthInput: document.getElementById("width"),
  //   heightInput: document.getElementById("height"),
  //   speedInput: document.getElementById("speed"),
  //   stopBtn: document.getElementById("stop"),
  //   text: document.getElementById("text"),
  // }
  constructor(width, height, speed, field, createBtn, stopBtn) {
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.stop = document.getElementById(stopBtn);
    this.field = document.getElementById(field);
    this.create = document.getElementById(createBtn);
    this.text = textContent;
  }
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
    document.getElementById("text").textContent = "";
    this.scoreCounter = 0;
    stopBtn.style.display = "block";
    stopBtn.addEventListener("click", this.stopGame.bind(this));
    // this.speed = speedInput;
    // if (!this.speed) {
    //   this.speed = 50;
    // }
    this.intervalId = setInterval(this.run.bind(this));
    document
      .getElementById("field")
      .removeEventListener("click", this.handleClickLife.bind(this), true);
    document
      .getElementById("field")
      .removeEventListener("mousemove", this.handleMove.bind(this), true);
    document.getElementById("field").style.cursor = "not-allowed";
  }
  stopGame() {
    clearInterval(this.intervalId);
    field.style.cursor = "";
    textContent.textContent = `game over \nscore: ${this.scoreCounter}`;
    stopBtn.style.display = "none";
    stopBtn.removeEventListener("click", this.stopGame.bind(this));
  }

  generateNextGeneration(field) {
    let result = [];
    let countLiveNeighbors = function (x, y) {
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
    let isFinish = this.assert(this.prevResultArr, result);
    this.prevResultArr = result;
    this.scoreCounter++;
    score.textContent = "Score: " + this.scoreCounter;
    if (isFinish) {
      this.stopGame();
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
    let userRows = width.value;
    let userCols = height.value;
    if (!userRows || !userCols) {
      alert("введите данные");
      return;
    }
    this.createTable(userRows, userCols);
    width.value = "";
    height.value = "";
    this.text.textContent =
      "Game created, your field size: " + userCols + "x" + userRows;
  }
  getCellIdByCoords(i, j) {
    return "cell-" + i + "-" + j;
  }
  renderTable(fieldData) {
    for (let i = 0; i < fieldData.length; i++) {
      for (let j = 0; j < fieldData[i].length; j++) {
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
    stopBtn.style.display = "none";
    if (!rows || !columns || rows <= 0 || columns <= 0) return;
    let oldField = document.getElementById("field");
    let isExistTable = oldField !== null;
    if (isExistTable) {
      let element = oldField;
      element.parentNode.removeChild(element);
    }

    if (rows < 0 || columns < 0) return;
    if (rows > 1000 || columns > 1000) return;
    let table = document.createElement("table");
    document.getElementById("game").appendChild(table);
    table.id = "field";
    table.addEventListener("click", this.handleClickLife.bind(this), true);
    table.addEventListener("mousemove", this.handleMove.bind(this), true);
    // Создаем строки
    for (let i = 0; i < rows; i++) {
      this.state[i] = [];
      let row = document.createElement("tr");
      // Создаем столбцы
      for (let j = 0; j < columns; j++) {
        this.state[i][j] = false;
        let cell = document.createElement("td");
        cell.className = "game-table-cell";
        cell.id = this.getCellIdByCoords(i, j);
        row.appendChild(cell);
      }
      table.appendChild(row);
    }
  }
}

let game = new Game();

// генерация дефолтного поля

game.createTable(10, 30, 1000, field, createBtn, stopBtn);
console.log(game);
// game.renderTable(game.state);

document
  .getElementById("start")
  .addEventListener("click", game.handlePlayGame.bind(game));
document
  .getElementById("create")
  .addEventListener("click", game.handleCreateTable.bind(game));
document
  .getElementById("generate")
  .addEventListener("click", game.handleRandomGenerate.bind(game));
// field.addEventListener("click", handleClickLife, true);
// field.addEventListener("mousemove", handleMove, true);
