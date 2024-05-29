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

class Game {
  intervalId;
  state = [];
  scoreCounter = 0;
  prevResultArr = [];
  that = this;
  handleClickLifereference;
  handleMoveLifereference;
  dom = {
    // instance,
    field: document.getElementById("field"),
    createBtn: document.getElementById("create"),
    widthInput: document.getElementById("width"),
    heightInput: document.getElementById("height"),
    speedInput: document.getElementById("speed"),
    stopBtn: document.getElementById("stop"),
    text: document.getElementById("text"),
  };
  constructor(
    width,
    height,
    speed,
    scoreId,
    createBtnId,
    generateBtnId,
    startBtnId,
    stopBtnId,
    textId
  ) {
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.score = document.getElementById(scoreId);
    this.create = document.getElementById(createBtnId);
    this.generate = document.getElementById(generateBtnId);
    this.start = document.getElementById(startBtnId);
    this.stop = document.getElementById(stopBtnId);
    this.text = document.getElementById(textId);
  }
  init() {
    this.createTable(this.width, this.height);
    this.bindEvents();
  }
  bindEvents() {
    this.start.addEventListener("click", this.handlePlayGame.bind(this));
    this.dom.field.addEventListener(
      "click",
      (this.handleClickLifereference = this.handleClickLife.bind(this)),
      true
    );
    this.dom.field.addEventListener(
      "mousemove",
      (this.handleMoveLifereference = this.handleMove.bind(this)),
      true
    );
    // this.field.addEventListener("click", this.handleClickLife.bind(this), true);
    // this.field.addEventListener("mousemove", this.handleMove.bind(this), true);
    this.create.addEventListener("click", this.handleCreateTable.bind(this));
    this.generate.addEventListener(
      "click",
      this.handleRandomGenerate.bind(this)
    );
    this.stop.addEventListener("click", this.stopGame.bind(this));
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

  // запуск игры
  handlePlayGame(e) {
    e.preventDefault();
    console.log("start");
    if (+this.dom.speedInput.value > 0) {
      this.speed = +this.dom.speedInput.value;
    }

    this.text.textContent = "";
    this.scoreCounter = 0;
    this.stop.style.display = "block";
    this.stop.addEventListener("click", this.stopGame.bind(this));
    if (!this.speed) {
      this.speed = 50;
    }
    this.intervalId = setInterval(this.run.bind(this), this.speed);
    this.field.removeEventListener(
      "click",
      this.handleClickLifereference,
      true
    );
    this.field.removeEventListener(
      "mousemove",
      this.handleMoveLifereference,
      true
    );
    this.field.style.cursor = "not-allowed";
  }
  // setSpeed() {
  //   if (!this.speed) {
  //     this.speed = this.dom.speedInput.value;
  //     console.log(this.speed);
  //   }
  // }
  stopGame() {
    clearInterval(this.intervalId);
    this.field.style.cursor = "";
    this.text.textContent = `game over \nscore: ${this.scoreCounter}`;
    this.stop.style.display = "none";
    this.stop.removeEventListener("click", this.stopGame.bind(this), true);
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

  handleCreateTable(e) {
    let userRows = width.value;
    let userCols = height.value;
    if (!userRows || !userCols) {
      alert("введите данные");
      return;
    }
    let oldField = this.field;
    let isExistTable = oldField !== null;
    if (isExistTable) {
      let element = oldField;
      element.parentNode.removeChild(element);
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
    this.stop.style.display = "none";
    if (!rows || !columns || rows <= 0 || columns <= 0) return;

    if (rows < 0 || columns < 0) return;
    if (rows > 1000 || columns > 1000) return;
    this.field = document.createElement("table");
    document.getElementById("game").appendChild(this.field);
    let fragment = new DocumentFragment();
    this.field.id = "field";
    this.dom.field = this.field;
    // обнуляем старую таблицу
    this.state = [];
    // Создаем строки
    for (let i = 0; i < rows; i++) {
      this.state[i] = [];
      let row = document.createElement("tr");
      // Создаем столбцы
      let rowFragment = new DocumentFragment();
      for (let j = 0; j < columns; j++) {
        this.state[i][j] = false;
        let cell = document.createElement("td");
        cell.className = "game-table-cell";
        cell.id = this.getCellIdByCoords(i, j);
        rowFragment.append(cell);
      }
      row.append(rowFragment);
      fragment.append(row);
    }
    this.field.appendChild(fragment);
  }
}

let game = new Game(
  30,
  30,
  100,
  "score",
  "create",
  "generate",
  "start",
  "stop",
  "text"
);
document.addEventListener("DOMContentLoaded", () => {
  game.init();
});

console.log(game);
