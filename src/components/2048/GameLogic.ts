export class GameTile {
  value: number;
  row: number;
  column: number;
  oldRow: number;
  oldColumn: number;
  markedForDeletion: boolean;
  mergeToTile: GameTile | null;

  constructor(_value: number) {
    this.value = _value;
    this.row = -1;
    this.column = -1;
    this.oldRow = -1;
    this.oldColumn = -1;
    this.markedForDeletion = false;
    this.mergeToTile = null;
  }

  isNew() {
    return this.oldRow === -1 && !this.mergeToTile;
  }

  fromRow() {
    if (this.mergeToTile !== null) return this.row;
    return this.oldRow;
  }

  fromColumn() {
    if (this.mergeToTile !== null) return this.column;
    return this.oldColumn;
  }

  toRow() {
    if (this.mergeToTile !== null) return this.mergeToTile.row;
    return this.row;
  }

  toColumn() {
    if (this.mergeToTile !== null) return this.mergeToTile.column;
    return this.column;
  }

  hasMoved() {
    return (
      (this.fromRow() !== -1 &&
        (this.fromRow() !== this.toRow() ||
          this.fromColumn() !== this.toColumn())) ||
      this.mergeToTile
    );
  }
}

function rotateLeftMatrix(_cells: GameTile[][]) {
  var rowLen = _cells.length;
  var columnLen = _cells[0].length;
  var newCell: GameTile[][] = [];
  for (var xIndex = 0; xIndex < rowLen; ++xIndex) {
    newCell.push([]);
    for (var yIndex = 0; yIndex < columnLen; ++yIndex) {
      newCell[xIndex][yIndex] = _cells[yIndex][columnLen - xIndex - 1];
    }
  }
  return newCell;
}

export class Board {
  tiles: GameTile[];
  cells: GameTile[][];
  boardSize: number;
  score: number;
  probability: number;
  deltaX: number[];
  deltaY: number[];
  won: boolean;

  constructor(_size: number = 4) {
    this.boardSize = _size;
    this.tiles = [];
    this.cells = [];
    this.score = 0;
    this.probability = 0.1;
    this.won = false;
    this.deltaX = [-1, 0, 1, 0];
    this.deltaY = [0, -1, 0, 1];
    for (let rowIndex = 0; rowIndex < _size; ++rowIndex) {
      this.cells[rowIndex] = [];
      for (let colIndex = 0; colIndex < _size; ++colIndex) {
        this.cells[rowIndex][colIndex] = this.addTile(0);
      }
    }
    this.addRandomTile();
    this.addRandomTile();
    this.setPositions();
  }

  getCells() {
    return this.cells;
  }

  addTile(_value: number) {
    var newTile = new GameTile(_value);
    this.tiles.push(newTile);
    return newTile;
  }

  setPositions() {
    this.cells.forEach((_row, rowIndex) => {
      _row.forEach((_tile, columnIndex) => {
        _tile.oldRow = _tile.row;
        _tile.oldColumn = _tile.column;
        _tile.row = rowIndex;
        _tile.column = columnIndex;
        _tile.markedForDeletion = false;
      });
    });
  }

  addRandomTile() {
    var emptyCells = [];
    for (var rowIndex = 0; rowIndex < this.boardSize; ++rowIndex) {
      for (var columnIndex = 0; columnIndex < this.boardSize; ++columnIndex) {
        if (this.cells[rowIndex][columnIndex].value === 0) {
          emptyCells.push({ rowIndex, columnIndex });
        }
      }
    }
    var index = Math.floor(Math.random() * emptyCells.length);
    var randomIndex = emptyCells[index];
    var newValue = Math.random() < this.probability ? 4 : 2;
    this.cells[randomIndex.rowIndex][randomIndex.columnIndex] =
      this.addTile(newValue);
  }

  clearOldTiles() {
    this.tiles = this.tiles.filter((tile) => tile.markedForDeletion === false);
    this.tiles.forEach((tile) => {
      tile.markedForDeletion = true;
    });
  }

  move(_direction: number) {
    this.clearOldTiles();
    for (var i = 0; i < _direction; ++i) {
      this.cells = rotateLeftMatrix(this.cells);
    }
    var hasChanged: boolean = this.moveLeft();
    for (let i = _direction; i < 4; ++i) {
      this.cells = rotateLeftMatrix(this.cells);
    }
    if (hasChanged) {
      this.addRandomTile();
    }
    this.setPositions();
    return this;
  }

  moveLeft() {
    var hasChanged = false;
    for (var rowIndex = 0; rowIndex < this.boardSize; ++rowIndex) {
      var currentRow = this.cells[rowIndex].filter(
        (_tile) => _tile.value !== 0
      );
      var resultRow: GameTile[] = [];
      for (var targetIndex = 0; targetIndex < this.boardSize; ++targetIndex) {
        var targetTile: GameTile =
          currentRow.length !== 0 ? currentRow.shift()! : this.addTile(0);
        if (currentRow.length > 0 && currentRow[0].value === targetTile.value) {
          var tile1 = targetTile;
          targetTile = this.addTile(targetTile.value);
          tile1.mergeToTile = targetTile;
          var tile2 = currentRow.shift()!;
          tile2.mergeToTile = targetTile;
          targetTile.value += tile2.value;
          this.score += tile1.value + tile2.value;
        }
        resultRow[targetIndex] = targetTile;
        this.won = targetTile.value === 2048;
        hasChanged =
          targetTile.value !== this.cells[rowIndex][targetIndex].value ||
          hasChanged;
      }
      this.cells[rowIndex] = resultRow;
    }
    return hasChanged;
  }

  getScore() {
    return this.score;
  }

  hasWon() {
    return this.won;
  }

  hasLost() {
    var canMove = false;
    for (var rowIndex = 0; rowIndex < this.boardSize; ++rowIndex) {
      for (var columnIndex = 0; columnIndex < this.boardSize; ++columnIndex) {
        canMove = this.cells[rowIndex][columnIndex].value === 0 || canMove;
        for (var dir = 0; dir < 4; ++dir) {
          var newRow = rowIndex + this.deltaX[dir];
          var newColumn = columnIndex + this.deltaY[dir];
          if (
            newRow < 0 ||
            newRow >= this.boardSize ||
            newColumn < 0 ||
            newColumn >= this.boardSize
          ) {
            continue;
          }
          canMove =
            this.cells[rowIndex][columnIndex].value ===
              this.cells[newRow][newColumn].value || canMove;
        }
      }
    }
    return !canMove;
  }
}
