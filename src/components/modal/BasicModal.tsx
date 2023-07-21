import { Dispatch, Fragment, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { classNames } from "../../utility/css";

export type BasicModal = {
  title?: string;
  children: ReactNode;
  isOpen: boolean;
  closeModal: Dispatch<React.SetStateAction<boolean>>;
  className?: string;
};

export function BasicModal(props: BasicModal) {
  const { title, children, isOpen, closeModal, className } = props;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[80]" onClose={closeModal}>
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
              <Dialog.Panel
                className={classNames(
                  "w-full transform overflow-hidden rounded-xl bg-white p-4 text-left align-middle shadow-xl transition-all dark:bg-zinc-900",
                  className ?? "max-w-md",
                )}
              >
                <div className="flex items-center justify-between">
                  <Dialog.Title className="font-semibold dark:text-gray-200">
                    {title ?? "Basic modal"}
                  </Dialog.Title>
                  <button onClick={() => closeModal(false)}>
                    <XMarkIcon className="h-5 w-5 text-zinc-900 dark:text-white" />
                  </button>
                </div>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
