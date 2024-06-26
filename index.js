/* TODO
+реализовать логику подсчёта соседей и переключения класса
+генерацию случайной расстановки живых
+проверить работу выбора скорости


+проверить создание таблицы (слушатель)
+удалять слушатели событий после старта
+добавить счётчик очков
+добавить логику остановки игры

+переписать на Class
+добавить наследование
+использовать canvas
+масштабировать поле 
    минимальные размеры клетки
    максимальные размеры контейнера поля
-добавить возможность установки тлщины линии
*/

class CanvasRenderer {
  canvas;
  ctx;
  references = {
    handleStartDrawingreference: null,
    handleDrawreference: null,
    handleStopDrawingreference: null,
  };
  drawing = false;
  cellSize = 0;

  constructor(fieldId, setCell) {
    this.setCell = setCell;
    this.canvas = document.getElementById(fieldId);
    const val = Math.min(innerWidth - 2, innerHeight - 130);
    this.canvas.width = val;
    this.canvas.height = val;
    this.init();
  }

  init() {
    this.canvas.addEventListener(
      "mousedown",
      (this.references.handleStartDrawingreference =
        this.startDrawing.bind(this))
    );
    this.canvas.addEventListener(
      "mousemove",
      (this.references.handleDrawreference = this.draw.bind(this))
    );
    this.canvas.addEventListener(
      "mouseup",
      (this.references.handleStopDrawingreference = this.stopDrawing.bind(this))
    );
    this.canvas.addEventListener(
      "mouseout",
      (this.references.handleStopDrawingreference = this.stopDrawing.bind(this))
    );
  }

  createField(rows, columns) {
    this.cellSize = this.calcCellSize(
      rows,
      columns,
      this.canvas.width,
      this.canvas.height
    );
    this.canvas.width = columns * this.cellSize; // исправил строки на столбцы
    this.canvas.height = rows * this.cellSize; // исправил столбцы на строки
    this.ctx = this.canvas.getContext("2d");

    this.ctx.strokeStyle = "green";
    this.ctx.lineWidth = 1;
    // this.ctx.strokeRect(0, 0, this.field.width, this.field.height);

    // Clear the canvas and redraw the field
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
  }

  fillCell(i, j, val) {
    let color = "white";
    if (val) {
      color = "red";
    }
    const coords = this.getCellCoords(i, j, this.cellSize, this.cellSize);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(coords.x, coords.y, this.cellSize, this.cellSize);
  }

  startDrawing(event) {
    this.drawing = true;

    this.cellVal = true;

    var x = event.offsetX;
    var y = event.offsetY;
    var imageData = this.ctx.getImageData(x, y, 1, 1);
    var data = imageData.data;
    if (data[0] > 0) {
      this.cellVal = false;
    }
    var rgb = "rgb(" + data[0] + ", " + data[1] + ", " + data[2] + ")";
    console.log(rgb);
    this.draw(event); // Начинаем рисование
  }

  draw(event) {
    if (!this.drawing) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (x < 0 || x > this.canvas.width || y < 0 || y > this.canvas.height) {
      return; // Предотвращение рисования за пределами canvas
    }
    const i = Math.floor(x / this.cellSize);
    const j = Math.floor(y / this.cellSize);
    this.fillCell(i, j, this.cellVal);
    this.setCell(i, j, this.cellVal);
  }

  stopDrawing() {
    this.drawing = false;
  }

  removeHandlers() {
    console.log("remove handlers");
    this.canvas.removeEventListener(
      "mousedown",
      this.references.handleStartDrawingreference
    );
    this.canvas.removeEventListener(
      "mousemove",
      this.references.handleDrawreference
    );
    this.canvas.removeEventListener(
      "mouseup",
      this.references.handleStopDrawingreference
    );
    this.canvas.removeEventListener(
      "mouseout",
      this.references.handleStopDrawingreference
    );
  }

  calcCellSize(rows, columns, width, height) {
    if (rows > width) {
      width = rows;
    }
    if (columns > height) {
      height = columns;
    }
    const cellWidth = Math.floor(width / columns);
    const cellHeight = Math.floor(height / rows);
    return Math.min(cellWidth, cellHeight);
  }

  getCellCoords(i, j, cellWidth, cellHeight) {
    let x = i * cellWidth;
    let y = j * cellHeight;
    return { x: x, y: y };
  }
}

class DOMRenderer {
  references = {
    handleClickLifereference: null,
    handleMoveLifereference: null,
  };
  dom = {
    field: null,
  };
  callbacks = {
    setCell: null,
  };

  constructor(fieldId, setCell) {
    this.callbacks.setCell = setCell;
    this.dom.field = document.getElementById(fieldId);
  }

  bindEvent() {
    this.dom.field.addEventListener(
      "click",
      (this.references.handleClickLifereference =
        this.handleClickCell.bind(this)),
      true
    );
    this.dom.field.addEventListener(
      "mousemove",
      (this.references.handleMoveLifereference = this.handleMove.bind(this)),
      true
    );
  }

  handleClickCell(e) {
    this.clickLife(e.target);
  }

  clickLife(cell) {
    if (cell.classList.contains("game-table-cell")) {
      cell.classList.toggle("cell-life");
      const [i, j] = this.getCoordsById(cell.id);
      let state = false;
      if (cell.classList.contains("cell-life")) {
        state = true;
      }
      this.callbacks.setCell(i, j, state);
    }
  }

  handleMove(e) {
    if (e.buttons === 1) {
      this.Move(e.target);
    }
  }

  Move(cell) {
    if (cell.classList.contains("game-table-cell")) {
      cell.classList.toggle("cell-life");
      const [i, j] = this.getCoordsById(cell.id);
      let state = false;
      if (cell.classList.contains("cell-life")) {
        state = true;
      }
      this.callbacks.setCell(i, j, state);
    }
  }

  createField(rows, columns) {
    let isExistTable = this.dom.field !== null;
    if (isExistTable) {
      let element = this.dom.field;
      element.parentNode.removeChild(element);
    }

    // this.dom.stopBtn.style.display = "none"; // TODO
    if (!rows || !columns || rows <= 0 || columns <= 0) return;

    if (rows < 0 || columns < 0) return;
    if (rows > 1000 || columns > 1000) return;
    this.dom.field = document.createElement("table");
    document.getElementById("game").appendChild(this.dom.field); // todo instance dom
    let fragment = new DocumentFragment();
    this.dom.field.id = "field";
    // Создаем строки
    for (let i = 0; i < rows; i++) {
      let row = document.createElement("tr");
      // Создаем столбцы
      let rowFragment = new DocumentFragment();
      for (let j = 0; j < columns; j++) {
        let cell = document.createElement("td");
        cell.className = "game-table-cell";
        cell.id = this.getCellIdByCoords(i, j);
        rowFragment.append(cell);
      }
      row.append(rowFragment);
      fragment.append(row);
    }
    this.dom.field.appendChild(fragment);

    this.bindEvent(); // TODO: пока пусть тут
  }

  fillCell(i, j, val) {
    let cell = document.getElementById(this.getCellIdByCoords(i, j));
    if (val) {
      cell.classList.add("cell-life");
    } else {
      cell.classList.remove("cell-life");
    }
  }

  getCellIdByCoords(i, j) {
    return "cell-" + i + "-" + j;
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

  removeHandlers() {
    this.dom.field.removeEventListener(
      "click",
      this.references.handleClickLifereference,
      true
    );
    this.dom.field.removeEventListener(
      "mousemove",
      this.references.handleMoveLifereference,
      true
    );
  }
}

class Game {
  fieldRenderer; // = new CanvasRenderer(); // Use interface Renderer
  intervalId;
  state = [];
  scoreCounter = 0;
  prevResultArr = [];
  references = {
    handleCreateReference: null,
    handleRandomGenerateReference: null,
    handleStartReference: null,
    handleStopReference: null,
  };
  dom = {
    // instance,
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

    this.fieldRenderer = new CanvasRenderer(
      "canv-field",
      this.setCell.bind(this)
    );
  }
  setCell(i, j, val) {
    this.state[i][j] = val;
  }

  init() {
    // this.fieldRenderer.init();
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
    this.fieldRenderer.removeHandlers();
    // this.dom.field.style.cursor = "not-allowed"; // TODO унести в fieldRenderer
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
    this.fillCells(this.state);
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
    this.fillCells(this.state);
  }

  createTable(rows, columns) {
    this.state = [];
    for (let i = 0; i < rows; i++) {
      this.state[i] = [];
      for (let j = 0; j < columns; j++) {
        this.state[i][j] = false;
      }
    }
    this.fieldRenderer.createField(rows, columns);
  }

  handleCreateTable(e) {
    let userRows = this.dom.widthInput.value;
    let userCols = this.dom.heightInput.value;
    if (!userRows || !userCols) {
      alert("введите данные");
      return;
    }

    this.createTable(userRows, userCols);

    this.dom.widthInput.value = "";
    this.dom.heightInput.value = "";
    this.dom.text.textContent =
      "Game created, your field size: " + userCols + "x" + userRows;
  }
  fillCells(fieldData) {
    for (let i = 0; i < fieldData.length; i++) {
      for (let j = 0; j < fieldData[i].length; j++) {
        this.fieldRenderer.fillCell(i, j, fieldData[i][j]);
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let game = new Game(
    50,
    50,
    100,
    "score",
    "create",
    "generate",
    "start",
    "stop",
    "text"
  );
  game.init();
});
