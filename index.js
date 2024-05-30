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
  references = {
    handleClickLifereference: null,
    handleMoveLifereference: null,
    handleCreateReference: null,
    handleRandomGenerateReference: null,
    handleStartReference: null,
    handleStopReference: null,
  };
  dom = {
    // instance,
    field: document.getElementById("field"),
    createBtn: document.getElementById("create"),
    widthInput: document.getElementById("width"),
    heightInput: document.getElementById("height"),
    speedInput: document.getElementById("speed"),
    stopBtn: document.getElementById("stop"),
    startBtn: document.getElementById("start"),
    text: document.getElementById("text"),
    score: document.getElementById("score"),
    generateBtn: document.getElementById("generate"),
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
    this.dom.score = document.getElementById(scoreId);
    this.dom.createBtn = document.getElementById(createBtnId);
    this.dom.generateBtn = document.getElementById(generateBtnId);
    this.dom.startBtn = document.getElementById(startBtnId);
    this.dom.stopBtn = document.getElementById(stopBtnId);
    this.dom.text = document.getElementById(textId);
  }
  init() {
    this.createTable(this.width, this.height);
    this.bindEvents();
    this.dom.widthInput.value = this.width;
    this.dom.heightInput.value = this.height;
    this.dom.speedInput.value = this.speed;
  }
  bindEvents() {
    this.dom.startBtn.addEventListener(
      "click",
      (this.references.handleStartReference = this.handlePlayGame.bind(this))
    );
    this.dom.field.addEventListener(
      "click",
      (this.references.handleClickLifereference =
        this.handleClickLife.bind(this)),
      true
    );
    this.dom.field.addEventListener(
      "mousemove",
      (this.references.handleMoveLifereference = this.handleMove.bind(this)),
      true
    );

    this.dom.createBtn.addEventListener(
      "click",
      (this.references.handleCreateReference =
        this.handleCreateTable.bind(this))
    );
    this.dom.generateBtn.addEventListener(
      "click",
      (this.references.handleRandomGenerateReference =
        this.handleRandomGenerate.bind(this))
    );
    this.dom.stopBtn.addEventListener(
      "click",
      (this.references.handleStopReference = this.stopGame.bind(this))
    );
  }

  handleClickLife(e) {
    this.clickLife(e.target);
  }

  handleMove(e) {
    if (e.buttons === 1) {
      this.Move(e.target);
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
    console.log("start");
    if (+this.dom.speedInput.value > 0) {
      this.speed = +this.dom.speedInput.value;
    }

    this.dom.text.textContent = "";
    this.scoreCounter = 0;
    this.dom.stopBtn.style.display = "block";
    if (!this.speed) {
      this.speed = 50;
    }
    this.intervalId = setInterval(this.run.bind(this), this.speed);
    this.field.removeEventListener(
      "click",
      this.references.handleClickLifereference,
      true
    );
    this.field.removeEventListener(
      "mousemove",
      this.references.handleMoveLifereference,
      true
    );
    this.field.style.cursor = "not-allowed";
    this.dom.createBtn.removeEventListener(
      "click",
      this.references.handleCreateReference
    );
    this.dom.generateBtn.removeEventListener(
      "click",
      this.references.handleRandomGenerateReference
    );
    this.dom.startBtn.removeEventListener(
      "click",
      this.references.handleStartReference
    );
  }
  stopGame() {
    clearInterval(this.intervalId);
    this.dom.createBtn.addEventListener(
      "click",
      (this.references.handleCreateReference =
        this.handleCreateTable.bind(this))
    );
    this.dom.generateBtn.addEventListener(
      "click",
      (this.references.handleRandomGenerateReference =
        this.handleRandomGenerate.bind(this))
    );
    this.dom.startBtn.addEventListener(
      "click",
      (this.references.handleStartReference = this.handlePlayGame.bind(this))
    );
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
    let isFinish = this.assert(this.prevResultArr, this.state);
    this.prevResultArr = this.state;
    this.scoreCounter++;
    this.dom.score.textContent = "Score: " + this.scoreCounter;
    if (isFinish) {
      this.stopGame();
    }
    this.renderTable(this.state);
  }

  genRandom(st) {
    let result = [];
    for (let i = 0; i < st.length; i++) {
      result[i] = [];
      for (let j = 0; j < st[i].length; j++) {
        if (Math.random() > 0.5) {
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
    this.dom.stopBtn.style.display = "none";
    if (!rows || !columns || rows <= 0 || columns <= 0) return;

    if (rows < 0 || columns < 0) return;
    if (rows > 1000 || columns > 1000) return;
    this.field = document.createElement("table");
    document.getElementById("game").appendChild(this.field); // todo instance dom
    let fragment = new DocumentFragment();
    this.field.id = "field";
    this.dom.field = this.field;
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
  clickLife(cell) {
    if (cell.classList.contains("game-table-cell")) {
      cell.classList.toggle("cell-life");
      const [i, j] = this.getCoordsById(cell.id);
      if (cell.classList.contains("cell-life")) {
        this.state[i][j] = true;
      } else {
        this.state[i][j] = false;
      }
    }
  }
  Move(cell) {
    if (cell.classList.contains("game-table-cell")) {
      cell.classList.toggle("cell-life");
      const [i, j] = this.getCoordsById(cell.id);
      if (cell.classList.contains("cell-life")) {
        this.state[i][j] = true;
      } else {
        this.state[i][j] = false;
      }
    }
  }
  handleCreateTable(e) {
    let userRows = this.dom.widthInput.value;
    let userCols = this.dom.heightInput.value;
    if (!userRows || !userCols) {
      alert("введите данные");
      return;
    }
    let isExistTable = this.field !== null;
    if (isExistTable) {
      let element = this.field;
      element.parentNode.removeChild(element);
    }

    this.createTable(userRows, userCols);
    this.dom.widthInput.value = "";
    this.dom.heightInput.value = "";
    this.dom.text.textContent =
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
