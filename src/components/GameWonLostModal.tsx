import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import ConfettiComponent from "./ConfettiComponent";

type SlidePuzzleStatsType = {
  game: "slidePuzzle";
  row: number;
  col: number;
  isLowestScore: boolean;
  totalMoves: number;
};

type Puzzle2048StatsType = {
  game: "2048";
  isHighScore: boolean;
  score: number;
};

export interface IGameWonLostModalProps {
  type: "won" | "lost";
  isOpen: boolean;
  closeModal: () => void;
  stats?: SlidePuzzleStatsType | Puzzle2048StatsType;
}

export default function GameWonLostModal(props: IGameWonLostModalProps) {
  const handleCloseModal = () => {
    props.closeModal();
  };

  const renderStats = () => {
    switch (props.stats?.game) {
      case "slidePuzzle": {
        return (
          <div className="mt-4">
            <p className="mb-1 text-sm text-gray-500">
              {`${
                props.stats?.isLowestScore ? "New Lowest Score" : "Score"
              } for ${props.stats?.row}x${props.stats?.col} board`}
            </p>
            <p className="text-3xl font-bold text-emerald-500">
              {props.stats?.totalMoves}
            </p>
          </div>
        );
      }
      case "2048": {
        return (
          <div className="mt-4">
            <p className="mb-1 text-sm text-gray-500">
              {`${props.stats?.isHighScore ? "New High Score" : "Score"}`}
            </p>
            <p className="text-3xl font-bold text-emerald-500">
              {props.stats?.score}
            </p>
          </div>
        );
      }
    }
  };

  return (
    <Transition appear show={props.isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[80]" onClose={handleCloseModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-zinc-900 bg-opacity-50 dark:bg-zinc-700 dark:bg-opacity-70" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
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
              <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-zinc-900">
                <div className="flex justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    {props.type === "won" ? "You Won" : "You Lost"}
                  </Dialog.Title>
                  <button
                    onClick={() => props.closeModal()}
                    className="outline-none"
                  >
                    <XMarkIcon className="h-5 w-5 text-zinc-900 dark:text-white" />
                  </button>
                </div>
                {renderStats()}
              </Dialog.Panel>
            </Transition.Child>
          </div>
          {props.type === "won" && <ConfettiComponent />}
        </div>
      </Dialog>
    </Transition>
  );
}
