import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import useAutosizeTextArea from "../../hooks/useAutosizeTextarea";
import { verifyImageUrl } from "../../utility/image";

export interface ISlidePuzzleSettingModalProps {
  isOpen: boolean;
  imageUrl: string;
  col: number;
  row: number;
  closeModal: () => void;
  submit: (imageurl: string, col: number, row: number) => void;
}

export function SlidePuzzleSettingModal(props: ISlidePuzzleSettingModalProps) {
  const DEFAULT_IMG_URL = "/assets/puzzle.jpg";
  const imageErrorP = useRef<HTMLParagraphElement>(null);
  const textareaImageUrl = useRef<HTMLTextAreaElement>(null);
  const [imageUrl, setImageUrl] = useState<string>(props.imageUrl);
  const [verifiedImageUrl, setVerifiedImageUrl] = useState<string>(
    props.imageUrl
  );
  const [puzzleCol, setPuzzleCol] = useState<number>(props.col);
  const [puzzleRow, setPuzzleRow] = useState<number>(props.row);
  const [showVerifyImage, setShowVerifyImage] = useState<boolean>(false);
  useAutosizeTextArea(textareaImageUrl, imageUrl);

  const handleSave = () => {
    if (imageUrl === "") return;
    if (
      props.imageUrl === imageUrl &&
      props.col === puzzleCol &&
      props.row === puzzleRow
    ) {
      setShowVerifyImage(false);
      props.closeModal();
      return;
    }
    props.closeModal();
    setShowVerifyImage(false);
    setImageUrl(verifiedImageUrl);
    props.submit(verifiedImageUrl, puzzleCol, puzzleRow);
  };

  const handleVerifyImage = async () => {
    const isValidUrl = await verifyImageUrl(imageUrl, DEFAULT_IMG_URL);
    if (imageErrorP.current) {
      if (!isValidUrl) {
        imageErrorP.current.innerHTML =
          "Incorrect Image Url default image loaded";
        imageErrorP.current.style.color = "red";
        setVerifiedImageUrl(DEFAULT_IMG_URL);
        setShowVerifyImage(true);
        return;
      } else {
        imageErrorP.current.innerHTML = "Image loaded successfully";
        imageErrorP.current.style.color = "green";
        setVerifiedImageUrl(imageUrl);
        setShowVerifyImage(true);
      }
    }
  };

  const handleCloseModal = () => {
    props.closeModal();
    setPuzzleCol(props.col);
    setPuzzleRow(props.row);
    setImageUrl(props.imageUrl);
    setVerifiedImageUrl(props.imageUrl);
    setShowVerifyImage(false);
  };

  return (
    <Transition appear show={props.isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleCloseModal}>
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
                  <div className="flex gap-2">
                    <textarea
                      ref={textareaImageUrl}
                      className="max-h-28 w-full rounded-lg placeholder:font-light dark:bg-zinc-800 dark:text-white dark:placeholder:text-slate-400 dark:hover:border"
                      value={imageUrl}
                      onChange={(e) => {
                        e.stopPropagation();
                        setImageUrl(e.target.value);
                      }}
                    ></textarea>
                    <button
                      className="h-fit rounded-md border border-transparent bg-emerald-400 px-3 py-2 text-emerald-900 hover:bg-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:px-4 sm:py-2"
                      onClick={handleVerifyImage}
                    >
                      Verify
                    </button>
                  </div>
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
                  <p className="mt-2 text-sm" ref={imageErrorP}></p>
                  {showVerifyImage && (
                    <>
                      <img
                        src={verifiedImageUrl}
                        alt="puzzle image"
                        className="mt-1 w-full rounded-md bg-cover"
                      />
                    </>
                  )}
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
                    onClick={handleCloseModal}
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
