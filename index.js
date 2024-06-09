/* 
rows - height
columns - width
*/

class CanvasRenderer {
  canvas;
  ctx;
  references = {
    handleStartDrawingreference: null,
    handleDrawreference: null,
    handleStopDrawingreference: null,
  };
  outer = {
    width: innerWidth - 2,
    height: innerHeight - 130,
  };
  drawing = false;
  cellSize = 0;

  constructor(fieldId, setCell) {
    this.setCell = setCell;
    this.canvas = document.getElementById(fieldId);
    this.canvas.style.display = "block";
    // const val = Math.min(innerWidth - 2, innerHeight - 130);
    // this.canvas.width = val;
    // this.canvas.height = val;
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
      this.outer.width,
      this.outer.height
    );
    this.canvas.width = columns * this.cellSize + 2;
    this.canvas.height = rows * this.cellSize + 2;
    this.ctx = this.canvas.getContext("2d");

    this.ctx.strokeStyle = "blue";
    this.ctx.lineWidth = 1;

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
    let x = event.offsetX;
    let y = event.offsetY;
    let imageData = this.ctx.getImageData(x, y, 1, 1);
    let data = imageData.data;
    if (data[0] > 0 && data[1] == 0) {
      this.cellVal = false;
    }
    this.draw(event); // Начинаем рисование
  }

  draw(event) {
    if (!this.drawing) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left + 1;
    const y = event.clientY - rect.top + 1;
    if (x < 0 || x > this.canvas.width || y < 0 || y > this.canvas.height) {
      return; // Предотвращение рисования за пределами canvas
    }
    const i = Math.floor(y / this.cellSize);
    const j = Math.floor(x / this.cellSize);
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
    const cellWidth = Math.floor(width / rows);
    const cellHeight = Math.floor(height / columns);
    const res = Math.min(cellWidth, cellHeight);
    if (res < 2) {
      return 2;
    }
    return res;
  }

  getCellCoords(i, j, cellWidth, cellHeight) {
    let y = i * cellWidth + 1;
    let x = j * cellHeight + 1;
    return { x: x, y: y };
  }
  destroy() {
    this.canvas.style.display = "none";
    this.removeHandlers();
    console.log("CanvasRenderer instance destroyed");
  }
}

class TableRenderer {
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
      this.moveLife(e.target);
    }
  }

  moveLife(cell) {
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
  destroy() {
    this.removeHandlers();
    this.dom.field.parentNode.removeChild(this.dom.field);
  }
}

class Game {
  renderer;
  intervalId;
  state = [];
  behavior = {
    allowRadio: true,
    allowCreate: false,
    allowGenerate: false,
    allowStart: false,
    allowStop: false,
  };
  scoreCounter = 0;
  prevResultArr = [];

  dom = {
    tableBtn: document.getElementById("table-btn"),
    canvasBtn: document.getElementById("canvas-btn"),
    createBtn: document.getElementById("create"),
    widthInput: document.getElementById("width"),
    heightInput: document.getElementById("height"),
    speedInput: document.getElementById("speed"),
    stopBtn: document.getElementById("stop"),
    startBtn: document.getElementById("start"),
    text: document.getElementById("text"),
    score: document.getElementById("score"),
    generateBtn: document.getElementById("generate"),
    game: document.getElementById("game"),
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
    textId,
    gameId
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
  setCell(i, j, val) {
    this.state[i][j] = val;
  }

  init() {
    // this.fieldRenderer = rendererInstance;
    this.bindControls();
    this.bindGameConf();
    this.dom.widthInput.value = this.width;
    this.dom.heightInput.value = this.height;
    this.dom.speedInput.value = this.speed;
    this.dom.stopBtn.style.display = "none";
    this.dom.game.style.display = "none";
  }
  bindControls() {
    this.dom.startBtn.addEventListener("click", this.handlePlayGame.bind(this));

    this.dom.createBtn.addEventListener(
      "click",

      this.handleCreateTable.bind(this)
    );
    this.dom.generateBtn.addEventListener(
      "click",

      this.handleRandomGenerate.bind(this)
    );
    this.dom.stopBtn.addEventListener("click", this.stopGame.bind(this));
  }
  bindGameConf() {
    this.dom.tableBtn.addEventListener("change", (event) => {
      if (event.target.checked) {
        this.handleButtonSelection(event.target.id);
      }
    });
    this.dom.canvasBtn.addEventListener("change", (event) => {
      if (event.target.checked) {
        this.handleButtonSelection(event.target.id);
      }
    });
  }

  handleButtonSelection(selectedButtonId) {
    this.dom.game.style.display = "flex";
    if (!this.behavior.allowRadio) {
      console.log("radio not allowed");
      return;
    }
    if (this.renderer) {
      this.renderer.destroy();
    }
    if (selectedButtonId === "table-btn") {
      console.log("Button 1 was clicked!");
      this.renderer = new TableRenderer("field", this.setCell.bind(this));
    } else if (selectedButtonId === "canvas-btn") {
      console.log("Button 2 was clicked!");
      this.renderer = new CanvasRenderer("canv-field", this.setCell.bind(this));
    }
    this.behavior.allowCreate = true;
    this.behavior.allowGenerate = true;
    this.behavior.allowStart = true;
    this.createTable(this.height, this.width);
  }
  printState() {
    this.state.forEach((row) => {
      let arr = [];
      row.forEach((val) => arr.push(val ? 1 : 0));
      console.log(arr.join(" "));
    });
  }
  // запуск игры
  handlePlayGame(e) {
    if (!this.behavior.allowStart) {
      console.log("start not allowed");
      return;
    }
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
    this.behavior.allowStop = true;
    this.behavior.allowRadio = false;
    this.behavior.allowStart = false;
    this.behavior.allowGenerate = false;
    this.behavior.allowCreate = false;
    this.intervalId = setInterval(this.run.bind(this), this.speed);
    this.renderer.removeHandlers();
  }
  stopGame() {
    if (!this.behavior.allowStop) {
      console.log("stop not allowed");
      return;
    }
    this.behavior.allowRadio = true;
    this.behavior.allowStart = true;
    this.behavior.allowGenerate = true;
    this.behavior.allowCreate = true;
    this.behavior.allowStop = false;
    this.dom.stopBtn.style.display = "none";
    clearInterval(this.intervalId);
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
    if (!this.behavior.allowGenerate) {
      console.log("random not allowed");
      return;
    }
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
    this.renderer.createField(rows, columns);
  }

  handleCreateTable(e) {
    if (!this.behavior.allowCreate) {
      console.log("create not allowed");
      return;
    }
    let userCols = +this.dom.widthInput.value;
    let userRows = +this.dom.heightInput.value;
    if (!userRows || !userCols) {
      alert("введите данные");
      return;
    }
    this.createTable(userRows, userCols);
    this.dom.text.textContent =
      "Game created, your field size: " + userCols + "x" + userRows;
  }
  fillCells(fieldData) {
    for (let i = 0; i < fieldData.length; i++) {
      for (let j = 0; j < fieldData[i].length; j++) {
        this.renderer.fillCell(i, j, fieldData[i][j]);
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let game = new Game(
    50,
    100,
    30,
    "score",
    "create",
    "generate",
    "start",
    "stop",
    "text",
    "game"
  );
  game.init();
});
