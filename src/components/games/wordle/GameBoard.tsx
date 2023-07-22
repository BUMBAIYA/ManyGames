import { useEffect, useRef, useState } from "react";
import PageMeta from "../../utility/PageMeta";
import { WordleLogic } from "./GameLogic";
import { KeyBoard, KeyBoardResponse } from "./KeyBoard";
import { WorldLetter } from "./WordleLetter";
import { useDictionaryApi } from "../../../utility/word";
import GameWonLostModal from "../../modal/GameWonLostModal";
import { useEventListener } from "../../../hooks/useEventListener";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { BasicModal } from "../../modal/BasicModal";
import "./style.css";

export interface IWordleGameBoardProps {}

export default function WordleGameBoard(props: IWordleGameBoardProps) {
  const refNotValidText = useRef<HTMLDivElement>(null);
  const [openModal, setOpenModal] = useState<boolean>(true);
  const [openInfoModal, setOpenInfoModal] = useState<boolean>(true);
  const [board, setBoard] = useState(new WordleLogic("hello"));
  const [wordMeaning, setWordMeaning] = useState<string>(
    "used as a greeting or to begin a phone conversation",
  );
  const [wrongWordGuessed, setWrongWordGuessed] = useState<string[]>([]);

  const { isWordValid, generateWord } = useDictionaryApi();

  const getInitialRandomWord = async () => {
    const word = await generateWord();
    const data = await isWordValid(word);
    if (data) {
      setBoard(new WordleLogic(word));
      setWordMeaning(data.definition);
    }
  };

  const checkWordValidity = async (word: string) => {
    let boardClone = createDeepClone();
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
  };

  const handleShowError = () => {
    refNotValidText.current!.style.display = "block";
    setTimeout(() => {
      refNotValidText.current!.style.display = "none";
    }, 2000);
  };

  const createDeepClone = () => {
    const boardClone: WordleLogic = Object.assign(
      Object.create(Object.getPrototypeOf(board)),
      board,
    );
    return boardClone;
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    getInitialRandomWord();
    setOpenModal(true);
  };

  const handleKeyDown = (event: KeyboardEvent | KeyBoardResponse) => {
    if (event instanceof KeyboardEvent) {
      if (event.currentTarget !== document.activeElement) return;
      if (
        (65 > event.keyCode || event.keyCode > 90) &&
        event.keyCode !== 8 &&
        event.keyCode !== 13
      ) {
        return;
      }
      if (event.repeat) return;
    }
    if (board.wrongGuessedLetters.includes(event.key)) return;
    switch (event.key) {
      case "Enter": {
        const word = WordleLogic.getWord(board.testWord, board.currentAttempt);
        if (word === "" || word.length !== 5) break;
        if (wrongWordGuessed.includes(word)) {
          handleShowError();
          break;
        }
        checkWordValidity(word);
        break;
      }
      case "Backspace": {
        let boardClone = createDeepClone();
        let newBoard = boardClone.onDelete();
        if (newBoard) {
          setBoard(newBoard);
        }
        break;
      }
      default: {
        let boardClone = createDeepClone();
        let newBoard = boardClone.onKeyPressed(event.key);
        if (newBoard) {
          setBoard(newBoard);
        }
        return;
      }
    }
  };

  useEventListener("keydown", handleKeyDown, document.body, false);

  useEffect(() => {
    getInitialRandomWord();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 lg:gap-8">
      <PageMeta title="ManyGames | Wordle" description="Play online wordle" />
      <div className="flex gap-4">
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
        <button className="h-6 w-6" onClick={() => setOpenInfoModal(true)}>
          <InformationCircleIcon />
        </button>
        <BasicModal
          title="How to play"
          isOpen={openInfoModal}
          closeModal={setOpenInfoModal}
          className="max-w-xl"
        >
          <span>{/* TODO: Info here */}</span>
        </BasicModal>
      </div>
      <KeyBoard
        getValue={handleKeyDown}
        disabledKeys={board.wrongGuessedLetters}
      />
      {(board.hasWon() || board.hasLost()) && (
        <GameWonLostModal
          isOpen={openModal}
          closeModal={handleCloseModal}
          type={board.hasWon() ? "won" : "lost"}
        >
          <div className="mt-4">
            <div className="text-md mb-1 text-gray-500">
              <div>
                {board.hasLost() ? "Word was " : ""}
                <span className="text-2xl font-extrabold text-emerald-500">
                  {board.correctWord.charAt(0).toLocaleUpperCase() +
                    board.correctWord.substring(1)}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-sm text-gray-500">
              Definition{" "}
              <span className="text-md font-semibold text-emerald-500">
                "
                {wordMeaning.replace(
                  wordMeaning[0],
                  wordMeaning[0].toLocaleUpperCase(),
                )}
                "
              </span>
            </div>
          </div>
        </GameWonLostModal>
      )}
    </div>
  );
}
