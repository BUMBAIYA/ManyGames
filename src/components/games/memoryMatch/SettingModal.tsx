import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { BasicModal, BasicModalProps } from "../../modal/BasicModal";
import { MemoryMatchHelper as MMH } from "./helper";

type MemoryMatchSettingModalProps = {
  size: number;
  handleSubmit: (size: number) => void;
} & BasicModalProps;

export function MemoryMatchSettingModal(props: MemoryMatchSettingModalProps) {
  const { closeModal, isOpen, className, handleSubmit, size } = props;
  const [puzzleSize, setPuzzleSize] = useState(size);

  const handleSave = () => {
    handleSubmit(puzzleSize);
    closeModal(false);
  };

  const handleClose = () => {
    setPuzzleSize(size);
    closeModal(false);
  };

  return (
    <BasicModal
      title="Setting"
      closeModal={handleClose}
      isOpen={isOpen}
      className={className}
    >
      <div className="mt-4 w-full">
        <RadioGroup value={puzzleSize} onChange={setPuzzleSize}>
          <RadioGroup.Label className="text-sm text-zinc-600 dark:text-zinc-400">
            Puzzle difficulty mode
          </RadioGroup.Label>
          <div className="mt-1 grid grid-cols-3 gap-2 sm:grid-cols-3">
            {[4, 5, 6].map((size) => (
              <RadioGroup.Option key={size} value={size}>
                {({ active, checked }) => (
                  <div
                    style={{
                      gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
                      gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
                    }}
                    className={`grid aspect-square w-full items-center justify-center rounded-md border ${
                      active || checked
                        ? "border-emerald-500"
                        : "border-zinc-300 dark:border-zinc-700"
                    }`}
                  >
                    {generateEmptyArray(size).map((_, index) => (
                      <span
                        key={index}
                        className={`h-full w-full border ${
                          active || checked
                            ? "border-emerald-500"
                            : "border-zinc-300 dark:border-zinc-700"
                        }`}
                      ></span>
                    ))}
                  </div>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
      <div className="mt-4">
        {puzzleSize === 4 && (
          <div className="text-sm lg:text-base">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Normal Mode:
            </span>{" "}
            Match 2 pair of same emojis by clicking conservative tile with same
            emoji.
          </div>
        )}
        {puzzleSize === 5 && (
          <div className="text-sm lg:text-base">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Bomb Mode:
            </span>{" "}
            <span>
              Match 2 pair of same emojis by clicking conservative tile with
              same emoji.
            </span>
            <br />
            <span>
              There is a single Bomb{" "}
              <span className="text-2xl">{MMH.MEMORY_MATCH_INVALID_TEXT}</span>.
              Game will be lost if the bomb is clicked second time.
            </span>
          </div>
        )}
        {puzzleSize === 6 && (
          <div className="text-sm lg:text-base">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Bomb Mode:
            </span>{" "}
            <span>
              Match 3 pair of same emojis by clicking conservative tile with
              same emoji.
            </span>
            <br />
            <span>
              There are 3 Bombs{" "}
              <span className="text-2xl">{MMH.MEMORY_MATCH_INVALID_TEXT}</span>.
              Game will be lost if any of the bomb is clicked second time.
            </span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <span className="text-sm font-semibold text-red-500">
          Note: Changing mode will reset the current game
        </span>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          className="rounded-md border border-transparent bg-emerald-400 px-3 py-2 text-emerald-900 hover:bg-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:px-4 sm:py-2"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          type="button"
          className="rounded-md bg-zinc-900 px-2 py-1 text-white shadow-sm transition-colors duration-100 ease-in hover:bg-zinc-700 dark:bg-zinc-800 dark:ring-1 dark:ring-inset dark:ring-white dark:hover:bg-zinc-800 dark:hover:ring-emerald-400 sm:px-4 sm:py-2"
          onClick={handleClose}
        >
          Close
        </button>
      </div>
    </BasicModal>
  );
}

const generateEmptyArray = (size: number) => {
  let arr = Array.from({ length: size * size }, (_, index) => index);
  return arr;
};
