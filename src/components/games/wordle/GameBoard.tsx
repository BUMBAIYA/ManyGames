import { useEffect, useRef, useState } from "react";
import {
  ArrowPathIcon,
  InformationCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import PageMeta from "../../utility/PageMeta";
import { WorldLetter } from "./WordleLetter";
import { KeyBoard, KeyBoardResponse } from "./KeyBoard";
import GameWonLostModal from "../../modal/GameWonLostModal";
import { WordleHowToPlay } from "./HowToPlay";
import { useEventListener } from "../../../hooks/useEventListener";
import { useDictionaryApi } from "../../../utility/word";
import { generateInitialTiles } from "./helper";
import styles from "./style.module.css";
import { WordleSettingModal } from "./SettingModal";

export type LetterType = {
  value: string | null;
  status: "ALMOST" | "CORRECT" | "WRONG" | null;
};

export type WordleGameMode = "NORMAL" | "HARD";

export const GAME_MODES = ["NORMAL", "HARD"] as const;

const TOTAL_ATTEMPT = 6 as const;
const WORD_LENGTH = 5 as const;

export default function TestingWordleBoard() {
  const refNotValidText = useRef<HTMLDivElement>(null);
  const [word, setWord] = useState<string>("hello");
  const [wordToTest, setWordToTest] = useState<string>("");
  const [mode, setMode] = useState<WordleGameMode>("NORMAL");
  const [wordDefination, setWordDefination] = useState<string>(
    "Used as a greeting or to begin a phone conversation",
  );

  const [isWon, setIsWon] = useState<boolean>(false);
  const [isLost, setIsLost] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [boardTiles, setBoardTiles] = useState<LetterType[][]>(
    generateInitialTiles(TOTAL_ATTEMPT, WORD_LENGTH),
  );

  const [currentAttempt, setCurrentAttempt] = useState<number>(0);
  const [cursorAt, setCursorAt] = useState<number>(0);
  const [wrongGuessedLetters, setWorngGuessedLetters] = useState<string[]>([]);
  const [wrongGuessedWords, setWrongGuessedWords] = useState<string[]>([]);
  const [validGuessedWords, setValidGuessedWords] = useState<string[]>([]);

  const [openInfoModal, setOpenInfoModal] = useState<boolean>(false);
  const [openSettingModal, setOpenSettingModal] = useState<boolean>(false);

  const { checkWordIsValid, generateWord } = useDictionaryApi();

  const getInitialRandomWord = async () => {
    const word = await generateWord();
    const data = await checkWordIsValid(word);
    if (data) {
      setWord(word);
      setWordDefination(data.definition);
    }
  };

  const getCursorPosition = () => {
    return [currentAttempt, cursorAt - currentAttempt * WORD_LENGTH];
  };

  const handleShowError = () => {
    refNotValidText.current!.style.display = "inline-block";
    setTimeout(() => {
      refNotValidText.current!.style.display = "none";
    }, 2000);
  };

  const handleCorrectWordChange = () => {
    if (mode === "HARD") {
      setWorngGuessedLetters((prev) => [
        ...prev,
        ...Array.from(new Set(wordToTest)).filter(
          (letter) =>
            !word.includes(letter) && !wrongGuessedLetters.includes(letter),
        ),
      ]);
    }
    setBoardTiles((prevTiles) => {
      return prevTiles.map((rowArr, rIndex) =>
        rIndex === currentAttempt
          ? rowArr.map((letter, cIndex) => {
              if (
                word[cIndex].toLocaleLowerCase() ===
                letter.value?.toLocaleLowerCase()
              ) {
                return { ...letter, status: "CORRECT" };
              } else if (word.includes(letter.value?.toLocaleLowerCase()!)) {
                return { ...letter, status: "ALMOST" };
              } else {
                return { ...letter, status: "WRONG" };
              }
            })
          : rowArr,
      );
    });
    setWordToTest("");
    if (wordToTest === word) {
      setIsWon(true);
      setTimeout(() => {
        setIsOpenModal(true);
      }, 1500);
      return;
    } else {
    }
    if (wordToTest !== word && currentAttempt === 5) {
      setIsLost(true);
      setTimeout(() => {
        setIsOpenModal(true);
      }, 1000);
      return;
    }
    setCurrentAttempt((prev) => prev + 1);
  };

  const checkWordValidity = async () => {
    let isWordRepeatedValid = validGuessedWords.includes(wordToTest);
    if (isWordRepeatedValid) {
      handleCorrectWordChange();
    } else {
      const isValid = await checkWordIsValid(wordToTest);
      if (!isValid) {
        setWrongGuessedWords((prev) => [...prev, wordToTest]);
        handleShowError();
      } else {
        setValidGuessedWords((prev) => [...prev, wordToTest]);
        handleCorrectWordChange();
      }
    }
  };

  const onKeyPressed = (key: string) => {
    if (isLost || isWon) return;
    if (cursorAt >= WORD_LENGTH * (currentAttempt + 1)) return;
    if (mode === "HARD") {
      if (wrongGuessedLetters.includes(key)) return;
    }
    let cursorPos = getCursorPosition();
    setBoardTiles((prevTiles) => {
      return prevTiles.map((rowArr, rIndex) =>
        rIndex === cursorPos[0]
          ? rowArr.map((letter, cIndex) =>
              cIndex === cursorPos[1] ? { ...letter, value: key } : letter,
            )
          : rowArr,
      );
    });
    setCursorAt((prev) => prev + 1);
    setWordToTest((prev) => prev.concat(key));
  };

  const onBackspace = () => {
    if (cursorAt === 0) return;
    if (isLost || isWon) return;
    if (cursorAt <= currentAttempt * WORD_LENGTH) return;
    let cursorPos = getCursorPosition();
    setBoardTiles((prevTiles) => {
      return prevTiles.map((rowArr, rIndex) =>
        rIndex === cursorPos[0]
          ? rowArr.map((letter, cIndex) =>
              cIndex === cursorPos[1] - 1 ? { ...letter, value: null } : letter,
            )
          : rowArr,
      );
    });
    setCursorAt((prev) => prev - 1);
    setWordToTest((prev) => prev.substring(0, prev.length - 1));
  };

  const onEnter = () => {
    if (cursorAt === 0) return;
    if (isLost || isWon) return;
    if (cursorAt % WORD_LENGTH === 0 && wordToTest.length === WORD_LENGTH) {
      if (wrongGuessedWords.includes(wordToTest)) {
        handleShowError();
        return;
      }
      checkWordValidity();
    }
  };

  const handleKeyDown = (event: KeyboardEvent | KeyBoardResponse) => {
    if (event instanceof KeyboardEvent) {
      if (
        (65 > event.keyCode || event.keyCode > 90) &&
        event.keyCode !== 8 &&
        event.keyCode !== 13
      ) {
        return;
      }
      if (event.repeat) return;
    }
    switch (event.key) {
      case "Enter": {
        onEnter();
        break;
      }
      case "Backspace": {
        onBackspace();
        break;
      }
      default: {
        onKeyPressed(event.key);
      }
    }
  };

  useEventListener("keydown", handleKeyDown, document.documentElement, false);

  const resetGame = () => {
    setIsWon(false);
    setIsLost(false);
    setCurrentAttempt(0);
    setCursorAt(0);
    setWordToTest("");
    setWorngGuessedLetters([]);
    setBoardTiles(generateInitialTiles(TOTAL_ATTEMPT, WORD_LENGTH));
    getInitialRandomWord();
  };

  const handleResetGame = () => {
    if (currentAttempt === 0 && !isWon) return;
    resetGame();
  };

  const handleUpdateMode = (mode: WordleGameMode) => {
    setMode(mode);
  };

  useEffect(() => {
    getInitialRandomWord();
  }, []);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <PageMeta title="ManyGames | Wordle" description="Play online wordle" />
      <div className="flex flex-col gap-4 lg:flex-row-reverse">
        <div className="flex w-full justify-end gap-2 lg:flex-col-reverse">
          <button
            aria-label="reset game"
            type="button"
            className="rounded-md bg-zinc-900 p-2 shadow-sm transition-colors duration-100 ease-in hover:bg-zinc-700 dark:bg-emerald-400  dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 dark:hover:bg-emerald-400/80 dark:hover:ring-emerald-400 sm:px-4"
            onClick={handleResetGame}
          >
            <ArrowPathIcon className="block h-6 w-6 text-white dark:text-zinc-900" />
          </button>
          <button
            aria-label="game setting"
            type="button"
            className="rounded-md bg-zinc-900 p-2 shadow-sm transition-colors duration-100 ease-in hover:bg-zinc-700 dark:bg-emerald-400  dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 dark:hover:bg-emerald-400/80 dark:hover:ring-emerald-400 sm:px-4"
            onClick={() => setOpenSettingModal(true)}
          >
            <Cog6ToothIcon className="block h-6 w-6 text-white dark:text-zinc-900" />
          </button>
          <WordleSettingModal
            mode={mode}
            currentAttempt={currentAttempt}
            isOpen={openSettingModal}
            closeModal={setOpenSettingModal}
            submit={handleUpdateMode}
          />
          <button
            aria-label="How to play"
            onClick={() => setOpenInfoModal(true)}
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5"
          >
            <InformationCircleIcon className="h-8 w-8 stroke-zinc-900 dark:stroke-emerald-300" />
          </button>
          <WordleHowToPlay
            isOpen={openInfoModal}
            closeModal={setOpenInfoModal}
          />
        </div>
        <div className="relative flex flex-col gap-1">
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              ref={refNotValidText}
              style={{ animation: `1500ms linear 500ms ${styles.hide}` }}
              className="hidden rounded-md border border-zinc-400 bg-white px-4 py-2 text-xl font-semibold dark:bg-zinc-900"
            >
              Invalid word
            </span>
          </div>
          {boardTiles.map((row, rIndex) => {
            return (
              <div key={rIndex} className="flex flex-row gap-1">
                {row.map((letter, cIndex) => {
                  return (
                    <WorldLetter
                      key={rIndex * TOTAL_ATTEMPT + cIndex}
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
      </div>
      <div>
        <KeyBoard getValue={handleKeyDown} disabledKeys={wrongGuessedLetters} />
      </div>
      {isWon !== null && (
        <GameWonLostModal
          isOpen={isOpenModal}
          closeModal={setIsOpenModal}
          isWon={isWon ? true : false}
        >
          <div className="mt-4">
            <div className="text-md mb-1 text-gray-500">
              <div>
                {isLost ? "Word was " : ""}
                <span className="text-2xl font-extrabold text-emerald-500">
                  {word.charAt(0).toLocaleUpperCase() + word.substring(1)}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-sm text-gray-500">
              Definition{" "}
              <span className="text-md font-semibold text-emerald-500">
                "
                {wordDefination.replace(
                  wordDefination[0],
                  wordDefination[0].toLocaleUpperCase(),
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
