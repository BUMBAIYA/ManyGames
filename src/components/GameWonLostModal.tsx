import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, ReactNode } from "react";
import ConfettiComponent from "./ConfettiComponent";

export interface IGameWonLostModalProps<T> {
  children?: ReactNode | T;
  type: "won" | "lost";
  isOpen: boolean;
  closeModal: () => void;
}

export default function GameWonLostModal<T extends ReactNode>(
  props: IGameWonLostModalProps<T>
) {
  return (
    <Transition appear show={props.isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[80]" onClose={props.closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300 delay-1000"
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
              enter="ease-out duration-300 delay-1000"
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
                  <button onClick={props.closeModal} className="outline-none">
                    <XMarkIcon className="h-5 w-5 text-zinc-900 dark:text-white" />
                  </button>
                </div>
                {props.children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
          {props.type === "won" && <ConfettiComponent />}
        </div>
      </Dialog>
    </Transition>
  );
}
