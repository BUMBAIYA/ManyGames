import { Dispatch, Fragment, ReactNode, useState } from "react";
import { Dialog, Switch, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { classNames } from "../../utility/css";

export type BasicModalProps = {
  title?: string;
  children?: ReactNode;
  isOpen: boolean;
  closeModal: Dispatch<React.SetStateAction<boolean>>;
  className?: string;
  confetti?: ReactNode;
  showInitially?: boolean;
  handleChangeVisiblity?: (show: boolean) => void;
};

export function BasicModal(props: BasicModalProps) {
  const {
    title,
    children,
    isOpen,
    closeModal,
    className,
    showInitially,
    handleChangeVisiblity,
  } = props;

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

        <div className="fixed inset-0">
          {props.confetti}
          <div className="flex h-screen items-center justify-center p-4 text-center">
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
                  "max-h-[calc(100vh-56px)] w-full transform overflow-y-auto rounded-xl bg-white p-4 text-left align-middle shadow-xl transition-all dark:bg-zinc-900",
                  className ?? "max-w-md",
                )}
              >
                <div className="flex items-center justify-between">
                  <Dialog.Title className="text-lg font-semibold dark:text-gray-200">
                    {title ?? "Basic modal"}
                  </Dialog.Title>
                  <button onClick={() => closeModal(false)}>
                    <XMarkIcon className="h-5 w-5 text-zinc-900 dark:text-white" />
                  </button>
                </div>
                {showInitially !== undefined && (
                  <div className="mt-2 flex w-full items-center justify-end gap-2 pt-2">
                    <span className="text-xs sm:text-sm">
                      Do not show again
                    </span>
                    <Switch
                      checked={showInitially}
                      onChange={handleChangeVisiblity}
                      className={classNames(
                        showInitially
                          ? "bg-gray-400 dark:bg-gray-500"
                          : "bg-emerald-600 dark:bg-emerald-500",
                        "bg-vsdark-500 dark:bg-vsdark-500 relative flex h-5 w-10 items-center gap-4 rounded-full px-1 py-3 text-xs font-semibold dark:ring-1 dark:ring-gray-300/20 sm:h-6 sm:w-12",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={classNames(
                          showInitially
                            ? "translate-x-0"
                            : "translate-x-4 sm:translate-x-6",
                          "pointer-events-none absolute inline-block h-4 w-4 transform rounded-full bg-white p-2 transition duration-200 ease-in-out",
                        )}
                      ></span>
                    </Switch>
                  </div>
                )}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
