import { useEffect, useRef, useState } from "react";
import {
  ArrowPathIcon,
  InformationCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import PageMeta from "../../utility/PageMeta";
import { WorldLetter } from "./WordleLetter";
import { KeyBoard, KeyBoardResponse } from "./KeyBoard";
import useLocalStorage from "../../../hooks/useLocalStorage";
import { WordleSettingModal } from "./SettingModal";
import { BasicModal } from "../../modal/BasicModal";
import { WordleHowToPlay } from "./HowToPlay";
import ConfettiComponent from "../../modal/ConfettiComponent";
import { useEventListener } from "../../../hooks/useEventListener";
import { useCypherText, useDictionaryApi } from "../../../utility/word";
import { generateInitialTiles } from "./helper";
import styles from "./style.module.css";

export type LetterType = {
  value: string | null;
  status: "ALMOST" | "CORRECT" | "WRONG" | null;
};

export type WordleGameMode = "NORMAL" | "HARD";

export const GAME_MODES = ["NORMAL", "HARD"] as const;

type WordleBoardState = {
  w: string;
  wl: string[];
  m: WordleGameMode;
  ct: number;
  cu: number;
  smi: boolean;
};

const TOTAL_ATTEMPT = 6 as const;
const WORD_LENGTH = 5 as const;

export default function TestingWordleBoard() {
  const refNotValidText = useRef<HTMLDivElement>(null);
  const [word, setWord] = useState<string>("");
  const [wordToTest, setWordToTest] = useState<string>("");
  const [wordDefination, setWordDefination] = useState<string>("");

  const [isWon, setIsWon] = useState<boolean>(false);
  const [isLost, setIsLost] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [boardState, setBoardState] = useLocalStorage(
    "wordle-state",
    generateInitialTiles(TOTAL_ATTEMPT, WORD_LENGTH),
  );

  const { encryptText, decryptText } = useCypherText();

  const [boardData, setBoardData] = useLocalStorage<WordleBoardState>(
    "wordle-data",
    {
      w: "",
      wl: [],
      m: "NORMAL",
      ct: 0,
      cu: 0,
      smi: true,
    },
  );

  const [wrongGuessedWords, setWrongGuessedWords] = useState<string[]>([]);
  const [validGuessedWords, setValidGuessedWords] = useState<string[]>([]);

  const [openInfoModal, setOpenInfoModal] = useState<boolean>(boardData.smi);
  const [openSettingModal, setOpenSettingModal] = useState<boolean>(false);

  const { checkWordIsValid, generateWord } = useDictionaryApi();

  const getInitialRandomWord = async (type: "initial" | "reset") => {
    if (type === "initial") {
      if (boardData.w.length !== 0) {
        let word = decryptText(boardData.w);
        const data = await checkWordIsValid(word);
        if (data) {
          setWord(word);
          setWordDefination(data.definition);
          return;
        }
      } else {
        let word = await generateWord();
        const data = await checkWordIsValid(word);
        if (data) {
          setWord(word);
          setWordDefination(data.definition);
          setBoardData((prev) => {
            return { ...prev, w: encryptText(word) };
          });
          return;
        }
      }
    } else {
      let word = await generateWord();
      let data = await checkWordIsValid(word);
      if (data) {
        setWord(word);
        setWordDefination(data.definition);
        setBoardData((prev) => {
          return { ...prev, w: encryptText(word), wl: [], ct: 0, cu: 0 };
        });
        return;
      }
    }
  };

  const getCursorPosition = () => {
    return [boardData.ct, boardData.cu - boardData.ct * WORD_LENGTH];
  };

  const handleShowError = () => {
    refNotValidText.current!.style.display = "inline-block";
    setTimeout(() => {
      refNotValidText.current!.style.display = "none";
    }, 2000);
  };

  const handleCorrectWordChange = () => {
    setBoardState((prevTiles) => {
      return prevTiles.map((rowArr, rIndex) =>
        rIndex === boardData.ct
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
    if (wordToTest !== word && boardData.ct === 5) {
      setIsLost(true);
      setTimeout(() => {
        setIsOpenModal(true);
      }, 1000);
      return;
    }
    if (boardData.m === "HARD") {
      setBoardData((prev) => {
        return {
          ...prev,
          ct: prev.ct + 1,
          wl: [
            ...prev.wl,
            ...Array.from(new Set(wordToTest)).filter(
              (letter) => !word.includes(letter),
            ),
          ],
        };
      });
    } else {
      setBoardData((prev) => {
        return { ...prev, ct: prev.ct + 1 };
      });
    }
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
        handleCorrectWordChange();
        setValidGuessedWords((prev) => [...prev, wordToTest]);
      }
    }
  };

  const onKeyPressed = (key: string) => {
    if (isLost || isWon) return;
    if (boardData.cu >= WORD_LENGTH * (boardData.ct + 1)) return;
    if (boardData.m === "HARD") {
      if (boardData.wl.includes(key)) return;
    }
    let cursorPos = getCursorPosition();
    setBoardState((prevTiles) => {
      return prevTiles.map((rowArr, rIndex) =>
        rIndex === cursorPos[0]
          ? rowArr.map((letter, cIndex) =>
              cIndex === cursorPos[1] ? { ...letter, value: key } : letter,
            )
          : rowArr,
      );
    });
    setBoardData((prev) => {
      return { ...prev, cu: prev.cu + 1 };
    });
    setWordToTest((prev) => prev.concat(key));
  };

  const onBackspace = () => {
    if (boardData.cu === 0) return;
    if (isLost || isWon) return;
    if (boardData.cu <= boardData.ct * WORD_LENGTH) return;
    let cursorPos = getCursorPosition();
    setBoardState((prevTiles) => {
      return prevTiles.map((rowArr, rIndex) =>
        rIndex === cursorPos[0]
          ? rowArr.map((letter, cIndex) =>
              cIndex === cursorPos[1] - 1 ? { ...letter, value: null } : letter,
            )
          : rowArr,
      );
    });
    setBoardData((prev) => {
      return { ...prev, cu: prev.cu - 1 };
    });
    setWordToTest((prev) => prev.substring(0, prev.length - 1));
  };

  const onEnter = () => {
    if (boardData.cu === 0) return;
    if (isLost || isWon) return;
    if (boardData.cu % WORD_LENGTH === 0 && wordToTest.length === WORD_LENGTH) {
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
    setWordToTest("");
    setBoardState(generateInitialTiles(TOTAL_ATTEMPT, WORD_LENGTH));
    getInitialRandomWord("reset");
  };

  const handleResetGame = () => {
    if (boardData.ct === 0 && !isWon) return;
    resetGame();
  };

  const handleUpdateMode = (mode: WordleGameMode) => {
    setBoardData((prev) => {
      return { ...prev, m: mode };
    });
  };

  useEffect(() => {
    getInitialRandomWord("initial");
  }, []);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <PageMeta title="ManyGames | Wordle" description="Play online wordle" />
      <div className="flex flex-col gap-4 lg:flex-row-reverse">
        <div className="flex w-full justify-end gap-2 lg:flex-col-reverse">
          <button
            aria-label="How to play"
            onClick={handleResetGame}
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5"
          >
            <ArrowPathIcon className="h-8 w-8 stroke-zinc-900 dark:stroke-emerald-300" />
          </button>
          <button
            aria-label="How to play"
            onClick={() => setOpenSettingModal(true)}
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5"
          >
            <Cog6ToothIcon className="h-8 w-8 stroke-zinc-900 dark:stroke-emerald-300" />
          </button>
          <WordleSettingModal
            mode={boardData.m}
            currentAttempt={boardData.ct}
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
            showInitially={boardData.smi}
            handleChangeVisiblity={(vis) =>
              setBoardData((prev) => {
                return { ...prev, smi: vis };
              })
            }
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
          {boardState.map((row, rIndex) => {
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
        <KeyBoard getValue={handleKeyDown} disabledKeys={boardData.wl} />
      </div>
      {isWon !== null && (
        <BasicModal
          title={isWon ? "You won" : "You Lost"}
          isOpen={isOpenModal}
          closeModal={setIsOpenModal}
          confetti={isWon && <ConfettiComponent />}
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
            <div className="text-base text-gray-500">
              Definition{" "}
              {wordDefination && (
                <span className="text-md font-semibold text-emerald-500">
                  "
                  {wordDefination.replace(
                    wordDefination[0],
                    wordDefination[0].toLocaleUpperCase(),
                  )}
                  "
                </span>
              )}
            </div>
          </div>
        </BasicModal>
      )}
    </div>
  );
}
