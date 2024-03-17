const X = "X";
const O = "O";

class Engine {
  constructor() {
    this.cells = [[], [], []];
    this.turn = 0;
    this.ended = false;
    this.rows = [0, 0, 0];
    this.columns = [0, 0, 0];
    this.diagonals = [0, 0];
    this.winner = null;
  }

  async setCell(x, y) {
    if (this.ended || this.getCell(x, y) != null) return;

    const turnValue = this.turn % 2 === 0 ? X : O;

    this.turn++;

    this.cells[x][y] = turnValue;

    this.addRow(x, turnValue);
    this.addColumn(y, turnValue);
    this.addDiagonal0(x, y, turnValue);
    this.addDiagonal1(x, y, turnValue);
    this.checkWinCondition();

    if (this.turn >= 9 || this.winner != null) this.ended = true;
  }

  checkWinCondition() {
    const series = this.rows.concat(this.columns, this.diagonals);

    const winnerCount = series.find((count) => Math.abs(count) === 3);

    if (winnerCount === 3) this.winner = X;
    if (winnerCount === -3) this.winner = O;
  }

  addRow(x, val) {
    if (val === X) this.rows[x]++;
    else this.rows[x]--;
  }

  addColumn(y, val) {
    if (val === X) this.columns[y]++;
    else this.columns[y]--;
  }

  addDiagonal0(x, y, val) {
    if (x - y !== 0) return;
    if (val === X) this.diagonals[0]++;
    else this.diagonals[0]--;
  }
  addDiagonal1(x, y, val) {
    if (x + y !== 2) return;
    if (val === X) this.diagonals[1]++;
    else this.diagonals[1]--;
  }

  getCell(x, y) {
    return this.cells[x][y];
  }
}

class Game3x3 {
  engine = new Engine();
  cells = [];

  init() {
    this.cells = document.querySelectorAll(".cell");
    for (const cell of this.cells) {
      cell.addEventListener("click", (e) => {
        this.mark(e.target);
      });
    }
    this.render();
  }

  async mark(cell) {
    if (this.engine.ended) return;
    await this.engine.setCell(cell.dataset.x - 1, cell.dataset.y - 1);
    this.render();
  }

  render() {
    this.cells.forEach((cell) => {
      const x = cell.dataset.x - 1;
      const y = cell.dataset.y - 1;
      const cellState = this.engine.getCell(x, y);
      const classes = ["cell"];
      if (cellState != null) {
        classes.push(cellState);
      }

      cell.className = classes.join(" ");
    });
    if (this.engine.ended) {
      document.querySelector(
        ".notification"
      ).innerText = `${this.engine.winner} wins!`;
    }
  }
}

new Game3x3().init();
