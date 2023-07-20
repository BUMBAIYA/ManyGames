import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export interface IPreviewModalProps {
  isOpen: boolean;
  closeModal: () => void;
  imageUrl: string;
}

export default function PreviewModal(props: IPreviewModalProps) {
  return (
    <Transition appear show={props.isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[80]" onClose={props.closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-zinc-900 bg-opacity-40 dark:bg-zinc-700 dark:bg-opacity-50" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-4 text-left align-middle shadow-xl transition-all dark:bg-zinc-900">
                <div className="mt-2 flex items-center justify-between">
                  <Dialog.Title className="font-semibold dark:text-gray-200">
                    Puzzle preview
                  </Dialog.Title>
                  <button onClick={() => props.closeModal()}>
                    <XMarkIcon className="h-5 w-5 text-zinc-900 dark:text-white" />
                  </button>
                </div>
                <div className="mt-4">
                  <img
                    loading="lazy"
                    src={props.imageUrl}
                    alt="puzzle image"
                    className="mt-1 rounded-md bg-cover"
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
