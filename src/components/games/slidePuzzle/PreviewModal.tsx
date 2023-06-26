import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";
import { classNames } from "../../../utility/css";
import { dragElement } from "../../../utility/dragElement";

export interface IPreviewModalProps {
  isOpen: boolean;
  closeModal: () => void;
  imageUrl: string;
}

export default function PreviewModal(props: IPreviewModalProps) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      dragElement(divRef.current);
    }
  }, []);

  return (
    <div
      ref={divRef}
      className={classNames(
        props.isOpen ? "animate-show" : "hidden",
        "absolute top-20 left-4 z-[80] w-full min-w-[300px] max-w-md overflow-hidden rounded-xl border border-zinc-200 dark:border-emerald-900",
      )}
    >
      <div className="transform  bg-white p-4 text-left align-middle shadow-md transition-all dark:bg-zinc-800  sm:p-6">
        <div className="flex justify-between">
          <h3 className="text-base font-medium leading-6 text-gray-900 dark:text-white sm:text-lg">
            Preview
          </h3>
          <button
            onClick={() => props.closeModal()}
            className="hidden md:block"
          >
            <XMarkIcon className="h-5 w-5 text-zinc-900 dark:text-white" />
          </button>
        </div>
        <span className="text-xs text-emerald-600 dark:text-emerald-300">
          Drag to move
        </span>
        <div className="mt-4">
          <img
            src={props.imageUrl}
            alt="puzzle image"
            className="mt-1 rounded-md bg-cover"
          />
        </div>
      </div>
    </div>
  );
}
