import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";

export interface IPreviewModalProps {
  isOpen: boolean;
  closeModal: () => void;
  imageUrl: string;
}

export default function PreviewModal(props: IPreviewModalProps) {
  const handleCloseModal = () => {
    props.closeModal();
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
          <div className="fixed inset-0 top-14 bg-zinc-900 bg-opacity-40 dark:bg-zinc-700 dark:bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 top-12 overflow-y-auto">
          <div className="flex min-h-full justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative h-fit w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-4 text-left align-middle shadow-xl transition-all dark:bg-zinc-900 sm:p-6">
                <div className="flex justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-base font-medium leading-6 text-gray-900 dark:text-white sm:text-lg"
                  >
                    Preview
                  </Dialog.Title>
                  <button
                    onClick={() => props.closeModal()}
                    className="outline-none"
                  >
                    <XMarkIcon className="h-5 w-5 text-zinc-900 dark:text-white" />
                  </button>
                </div>
                <div className="mt-4">
                  <img
                    src={props.imageUrl}
                    alt="puzzle image"
                    className="mt-1 w-full rounded-md bg-cover"
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
