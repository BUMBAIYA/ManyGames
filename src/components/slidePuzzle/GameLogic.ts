export class GameBoard {
  boardCol: number;
  boardRow: number;
  tiles: number[];
  emptyBoxIndex: number;
  won: boolean;
  movesCount: number;
  constructor(_col: number, _row: number) {
    this.boardCol = _col;
    this.boardRow = _row;
    this.movesCount = 0;
    this.won = false;
    this.tiles = [];
    for (let i = 0; i < _row * _col; i++) {
      this.tiles[i] = i;
    }
    this.shuffle();
    this.emptyBoxIndex = this.tiles.findIndex(
      (_tile) => _tile === _col * _row - 1
    );
  }

  shuffle() {
    let currentLen = this.boardCol * this.boardRow;
    for (let i = currentLen - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [this.tiles[i], this.tiles[randomIndex]] = [
        this.tiles[randomIndex],
        this.tiles[i],
      ];
    }
    this.checkSolvable();
  }

  checkSolvable() {
    let currentLen = this.boardCol * this.boardRow;
    let inversions = 0;
    for (let i = 0; i < currentLen; i++) {
      for (let j = i + 1; j < currentLen; j++) {
        if (this.tiles[i] > this.tiles[j] && this.tiles[j] !== 0) {
          inversions++;
        }
      }
    }
    const isSolvable = inversions % 2 === 0;
    if (!isSolvable) {
      this.shuffle();
    }
  }

  moveTile(_direction: number): GameBoard | null {
    let indexToBeSwaped = 0;
    if (_direction === 1) {
      if (
        this.emptyBoxIndex + this.boardCol >
        this.boardCol * this.boardRow - 1
      )
        return null;
      indexToBeSwaped = this.emptyBoxIndex + this.boardCol;
    }
    if (_direction === 3) {
      if (this.emptyBoxIndex - this.boardCol < 0) return null;
      indexToBeSwaped = this.emptyBoxIndex - this.boardCol;
    }
    if (_direction === 2) {
      if (this.emptyBoxIndex === 0) return null;
      indexToBeSwaped = this.emptyBoxIndex - 1;
      if (
        Math.floor(indexToBeSwaped / this.boardCol) !==
        Math.floor(this.emptyBoxIndex / this.boardCol)
      )
        return null;
    }
    if (_direction === 4) {
      if (this.emptyBoxIndex === this.boardCol * this.boardCol - 1) return null;
      indexToBeSwaped = this.emptyBoxIndex + 1;
      if (
        Math.floor(indexToBeSwaped / this.boardCol) !==
        Math.floor(this.emptyBoxIndex / this.boardCol)
      )
        return null;
    }
    var tempTile = this.tiles[this.emptyBoxIndex];
    this.tiles[this.emptyBoxIndex] = this.tiles[indexToBeSwaped];
    this.tiles[indexToBeSwaped] = tempTile;
    this.emptyBoxIndex = indexToBeSwaped;
    this.movesCount++;
    this.checkWonCondition();
    return this;
  }

  hasWon() {
    return this.won;
  }

  checkWonCondition() {
    for (let i = 0; i < this.boardCol * this.boardRow; i++) {
      if (this.tiles[i] !== i) {
        this.won = false;
        break;
      }
      this.won = true;
    }
  }
}
