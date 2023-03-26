import { useEffect, useMemo, useRef, useState } from "react";
import PageMeta from "../PageMeta";
import { WordleLogic } from "./GameLogic";
import { KeyBoard } from "./KeyBoard";
import { WorldLetter } from "./WordleLetter";
import { useDictionaryApi } from "../../utility/word";
import GameWonLostModal from "../GameWonLostModal";
import useEvent from "../../hooks/useEvent";

export interface IWordleGameBoardProps {}

export default function WordleGameBoard(props: IWordleGameBoardProps) {
  const wordOfDay = useMemo(() => {}, []);
  let WORD = "hello";
  const refNotValidText = useRef<HTMLDivElement>(null);
  const [openModal, setOpenModal] = useState<boolean>(true);
  const [board, setBoard] = useState(new WordleLogic(WORD));
  const [wrongWordGuessed, setWrongWordGuessed] = useState<string[]>([]);

  const { isWordValid, generateWord } = useDictionaryApi();

  useEffect(() => {
    async function getWord() {
      const word = await generateWord();
      setBoard(new WordleLogic(word));
    }
    getWord();
  }, []);

  const handleShowError = () => {
    refNotValidText.current!.style.display = "block";
    setTimeout(() => {
      refNotValidText.current!.style.display = "none";
    }, 2000);
  };

  const handleKeyStroke = (value: string) => {
    let boardClone = Object.assign(
      Object.create(Object.getPrototypeOf(board)),
      board
    );
    switch (value) {
      case "enter": {
        const word = WordleLogic.getWord(board.testWord, board.currentAttempt);
        if (word === "" || word.length !== 5) break;
        if (wrongWordGuessed.includes(word)) {
          handleShowError();
          break;
        }
        async function check() {
          const isValid = await isWordValid(word);
          if (isValid) {
            let newBoard = boardClone.onEnter();
            if (newBoard) {
              setBoard(newBoard);
            }
          } else {
            handleShowError();
            if (!wrongWordGuessed.includes(word)) {
              setWrongWordGuessed((prev) => [...prev, word]);
            }
            return;
          }
        }
        check();
        break;
      }
      case "delete": {
        let newBoard = boardClone.onDelete();
        if (newBoard) {
          setBoard(newBoard);
        }
        break;
      }
      default: {
        let newBoard = boardClone.onKeyPressed(value);
        if (newBoard) {
          setBoard(newBoard);
        }
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.currentTarget !== document.activeElement) return;
    if (
      (65 > event.keyCode || event.keyCode > 90) &&
      event.keyCode !== 8 &&
      event.keyCode !== 13
    ) {
      return;
    }

    if (event.repeat) return;
    let boardClone = Object.assign(
      Object.create(Object.getPrototypeOf(board)),
      board
    );
    switch (event.keyCode) {
      case 13: {
        const word = WordleLogic.getWord(board.testWord, board.currentAttempt);
        if (word === "" || word.length !== 5) break;
        if (wrongWordGuessed.includes(word)) {
          console.log("repeated word");
          handleShowError();
          break;
        }
        async function check() {
          const isValid = await isWordValid(word);
          if (isValid) {
            let newBoard = boardClone.onEnter();
            if (newBoard) {
              setBoard(newBoard);
            }
          } else {
            handleShowError();
            if (!wrongWordGuessed.includes(word)) {
              setWrongWordGuessed((prev) => [...prev, word]);
            }
            return;
          }
        }
        check();
        break;
      }
      case 8: {
        let newBoard = boardClone.onDelete();
        if (newBoard) {
          setBoard(newBoard);
        }
        break;
      }
      default: {
        let newBoard = boardClone.onKeyPressed(event.key);
        if (newBoard) {
          setBoard(newBoard);
        }
        return;
      }
    }
  };

  useEvent(document.body, "keydown", handleKeyDown, false);

  const handleCloseModal = () => {
    setOpenModal(false);
    async function getWord() {
      const word = await generateWord();
      setBoard(new WordleLogic(word));
    }
    getWord();
    setOpenModal(true);
  };

  return (
    <div className="flex flex-col items-center gap-4 lg:gap-8">
      <PageMeta title="ManyGames | Wordle" description="Play online wordle" />
      <div className="relative flex flex-col items-center gap-1 xl:gap-2">
        <div
          ref={refNotValidText}
          style={{ animation: "1500ms linear 500ms hide" }}
          className="absolute top-1/2 hidden rounded-md border border-gray-400 bg-white p-3 font-bold text-black"
        >
          Not a valid word
        </div>
        {board.testWord.map((row, rIndex) => {
          return (
            <div key={rIndex} className="flex flex-row gap-2">
              {row.map((letter, cIndex) => {
                return (
                  <WorldLetter
                    key={rIndex * board.correctWordLength + cIndex}
                    value={letter.value}
                    status={letter.status}
                    isActive={false}
                    colIndex={cIndex}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <KeyBoard getValue={handleKeyStroke} />
      {(board.hasWon() || board.hasLost()) && (
        <GameWonLostModal
          isOpen={openModal}
          closeModal={handleCloseModal}
          type={board.hasWon() ? "won" : "lost"}
        >
          <div className="mt-4">
            <div className="text-md mb-1 text-gray-500">
              <pre>
                Word was{" "}
                <span className="text-xl font-bold text-emerald-500">
                  {board.correctWord}
                </span>
              </pre>
            </div>
            {board.hasWon() && (
              <>
                <p className="mb-1 text-sm text-gray-500">Total Attempts</p>
                <p className="text-3xl font-bold text-emerald-500">
                  {board.currentAttempt - 1}
                </p>
              </>
            )}
          </div>
        </GameWonLostModal>
      )}
    </div>
  );
}
