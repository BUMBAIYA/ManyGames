import { classNames } from "../../../utility/css";

export interface IWorldLetterProps {
  value: string | null;
  status: "ALMOST" | "CORRECT" | "WRONG" | null;
  isActive: boolean;
  colIndex: number;
}

export function WorldLetter(props: IWorldLetterProps) {
  return (
    <div
      className={classNames(
        props.status === "CORRECT"
          ? "animate-bounce bg-emerald-300 dark:bg-emerald-500"
          : "",
        props.status === "ALMOST" ? "bg-yellow-300 dark:bg-yellow-600" : "",
        props.status === "WRONG" ? "bg-gray-400 dark:bg-gray-500" : "",
        "flex h-14 w-14 animate-show items-center justify-center rounded-md border border-solid border-emerald-600 text-2xl font-bold text-zinc-900 dark:border-emerald-700 dark:bg-zinc-900 dark:text-white md:h-16 md:w-16 md:text-3xl",
      )}
      style={
        props.status === "WRONG"
          ? {
              animation: `200ms linear ${props.colIndex * 80}ms wrong-ziggle`,
            }
          : props.status === "CORRECT"
          ? { animation: `800ms linear ${props.colIndex * 80}ms spinx` }
          : {}
      }
    >
      {props.value?.toLocaleUpperCase()}
    </div>
  );
}
