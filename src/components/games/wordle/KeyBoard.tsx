import { classNames } from "../../../utility/css";
import { BackspaceIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";

export type KeyBoardResponse = {
  key: string;
};

export interface IKeyBoardProps {
  getValue: ({ key }: KeyBoardResponse) => void;
  disabledKeys?: string[];
}

export interface IKeyBoardKeyProps {
  value: string;
  isDisable: boolean;
}

export const TopLevelKeys = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
export const MiddleLevelKeys = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
export const BottomLevelLKeys = ["z", "x", "c", "v", "b", "n", "m"];

export function KeyBoard(props: IKeyBoardProps) {
  const handleSubmitKey = (value: string) => {
    props.getValue({ key: value });
  };

  const isKeyDisabled = (key: string) => {
    if (!props.disabledKeys) return false;
    if (props.disabledKeys.includes(key)) return true;
    return false;
  };

  const Key = (props: IKeyBoardKeyProps) => {
    return (
      <button
        key={props.value}
        className={classNames(
          props.isDisable
            ? "bg-gray-300 dark:bg-emerald-400/20 dark:text-white"
            : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200 hover:text-emerald-800 dark:bg-emerald-400 dark:text-zinc-900 dark:hover:bg-emerald-400/40",
          "flex cursor-pointer items-center justify-center rounded-md border border-emerald-600 p-2 text-xs font-medium   dark:border-emerald-700 sm:rounded-lg sm:px-3 sm:py-2 sm:text-base md:py-1 lg:px-4 lg:py-1 lg:text-xl",
        )}
        onClick={() => handleSubmitKey(props.value)}
        disabled={props.isDisable}
      >
        {props.value.toUpperCase()}
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1 md:gap-1.5">
        {TopLevelKeys.map((key, index) => (
          <Key key={index} value={key} isDisable={isKeyDisabled(key)} />
        ))}
      </div>
      <div className="flex gap-1 md:gap-1.5">
        {MiddleLevelKeys.map((key, index) => {
          return <Key key={index} value={key} isDisable={isKeyDisabled(key)} />;
        })}
      </div>
      <div className="flex gap-1 md:gap-1.5">
        <button
          className="flex cursor-pointer items-center justify-center rounded-md border border-emerald-600 bg-emerald-100 p-2 text-xs font-medium text-emerald-600 hover:bg-emerald-200 hover:text-emerald-800 dark:border-emerald-700 dark:bg-emerald-400 dark:text-zinc-900   dark:hover:bg-emerald-400/40 sm:rounded-lg sm:px-3 sm:py-2 sm:text-base md:py-1 lg:px-4 lg:py-1 lg:text-xl"
          onClick={() => handleSubmitKey("Enter")}
        >
          <span className="hidden md:inline-block">ENTER</span>
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
        {BottomLevelLKeys.map((key, index) => {
          return <Key key={index} value={key} isDisable={isKeyDisabled(key)} />;
        })}
        <button
          className="flex cursor-pointer items-center justify-center rounded-md border border-emerald-600 bg-emerald-100 p-2 text-xs font-medium text-emerald-600 hover:bg-emerald-200 hover:text-emerald-800 dark:border-emerald-700 dark:bg-emerald-400 dark:text-zinc-900   dark:hover:bg-emerald-400/40 sm:rounded-lg sm:px-3 sm:py-2 sm:text-base md:py-1 lg:px-4 lg:py-1 lg:text-xl"
          onClick={() => handleSubmitKey("Backspace")}
        >
          <span className="hidden md:inline-block">BACKSPACE</span>
          <BackspaceIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
