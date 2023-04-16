export type LetterType = {
  value: string | null;
  status: "ALMOST" | "CORRECT" | "WRONG" | null;
};

export class WordleLogic {
  correctWord: string;
  correctWordLength: number;
  testWord: LetterType[][];
  currentAttempt: number;
  totalAttempts: number;
  alphabetFound: string[];
  cursorAt: number;
  won: boolean;

  constructor(_correctWord: string, _attempts: number = 6) {
    this.correctWord = _correctWord.toLowerCase();
    this.correctWordLength = 5;
    this.totalAttempts = _attempts;
    this.currentAttempt = 1;
    this.testWord = [];
    this.alphabetFound = [];
    this.cursorAt = 0;
    this.won = false;
    for (let rIndex = 0; rIndex < this.totalAttempts; rIndex++) {
      this.testWord[rIndex] = [];
      for (let cIndex = 0; cIndex < this.correctWordLength; cIndex++) {
        this.testWord[rIndex][cIndex] = { value: null, status: null };
      }
    }
  }

  getCursorPosition(cursorIndex: number) {
    return {
      x: cursorIndex % this.correctWordLength,
      y: Math.floor(cursorIndex / this.correctWordLength),
    };
  }

  hasWon() {
    return this.won;
  }

  hasLost() {
    if (this.currentAttempt > this.totalAttempts) return true;
    else return false;
  }

  onEnter() {
    if (this.cursorAt === 0) return;
    if (
      this.cursorAt % this.correctWordLength === 0 &&
      this.cursorAt === this.currentAttempt * this.correctWordLength
    ) {
      this.won = true;
      for (let cIndex = 0; cIndex < this.correctWordLength; cIndex++) {
        var tempLetter = this.testWord[this.currentAttempt - 1][cIndex];
        if (
          tempLetter.value?.toLocaleLowerCase() ===
          this.correctWord[cIndex].toLocaleLowerCase()
        ) {
          tempLetter.status = "CORRECT";
          this.won = this.won ? true : false;
        } else if (
          this.correctWord.includes(tempLetter.value?.toLocaleLowerCase()!)
        ) {
          tempLetter.status = "ALMOST";
          this.won = false;
        } else {
          tempLetter.status = "WRONG";
          this.won = false;
        }
      }
      ++this.currentAttempt;
      return this;
    }
  }

  onDelete() {
    if (this.cursorAt === 0) return;
    if (this.cursorAt <= (this.currentAttempt - 1) * this.correctWordLength)
      return;
    var cursorPos = this.getCursorPosition(this.cursorAt - 1);
    this.testWord[cursorPos.y][cursorPos.x] = { value: null, status: null };
    --this.cursorAt;
    return this;
  }

  onKeyPressed(key: string) {
    if (this.cursorAt === this.correctWordLength * this.totalAttempts)
      return null;
    var cursorPos = this.getCursorPosition(this.cursorAt);
    if (this.cursorAt >= this.currentAttempt * this.correctWordLength)
      return null;
    this.testWord[cursorPos.y][cursorPos.x] = {
      value: key.toLocaleLowerCase(),
      status: null,
    };
    ++this.cursorAt;
    return this;
  }

  static getWord(wordArray: LetterType[][], currentAttempt: number) {
    const tempWordArray: string[] = [];
    for (let cIndex = 0; cIndex < 5; cIndex++) {
      let temp = wordArray[currentAttempt - 1][cIndex];
      tempWordArray.push(temp.value!);
    }
    const word = tempWordArray.join("");
    return word;
  }
}
