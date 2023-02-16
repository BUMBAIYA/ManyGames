import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import useAutosizeTextArea from "../../hooks/useAutosizeTextarea";

export interface ISlidePuzzleSettingModalProps {
  isOpen: boolean;
  imageUrl: string;
  col: number;
  row: number;
  closeModal: () => void;
  submit: (imageurl: string, col: number, row: number) => void;
}

export function SlidePuzzleSettingModal(props: ISlidePuzzleSettingModalProps) {
  const textareaImageUrl = useRef<HTMLTextAreaElement>(null);
  const [imageurl, setImageurl] = useState<string>(props.imageUrl);
  const [puzzleCol, setPuzzleCol] = useState<number>(props.col);
  const [puzzleRow, setPuzzleRow] = useState<number>(props.row);
  useAutosizeTextArea(textareaImageUrl, imageurl);

  const handleSave = () => {
    if (imageurl === "") return;
    props.submit(imageurl, puzzleCol, puzzleRow);
    props.closeModal();
  };

  return (
    <Transition appear show={props.isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={props.closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 top-14 bg-zinc-900 bg-opacity-40 dark:bg-zinc-700 dark:bg-opacity-70" />
        </Transition.Child>

        <div className="fixed inset-0 top-12 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-zinc-900">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                >
                  Puzzle settings
                </Dialog.Title>
                <div className="mt-4">
                  <p className="mb-1 text-sm text-gray-500">Image url</p>
                  <textarea
                    ref={textareaImageUrl}
                    className="max-h-28 w-full rounded-lg placeholder:font-light dark:bg-zinc-800 dark:text-white dark:placeholder:text-slate-400 dark:hover:border"
                    value={imageurl}
                    onChange={(e) => setImageurl(e.target.value)}
                  ></textarea>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    No. of columns: {puzzleCol}
                  </p>
                  <input
                    type="range"
                    min={3}
                    max={10}
                    value={puzzleCol}
                    onChange={(e) => setPuzzleCol(parseInt(e.target.value))}
                    className="accent-emerald-500"
                  />
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    No. of rows: {puzzleRow}
                  </p>
                  <input
                    type="range"
                    min={3}
                    max={10}
                    value={puzzleRow}
                    onChange={(e) => setPuzzleRow(parseInt(e.target.value))}
                    className="accent-emerald-500"
                  />
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-500">Preview</p>
                  <img
                    src={imageurl}
                    alt="puzzle image"
                    className="mt-1 w-full rounded-md bg-cover"
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = `/puzzle/puzzle.jpg`;
                    }}
                  />
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-red-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    onClick={props.closeModal}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
