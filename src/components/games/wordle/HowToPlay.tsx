import { BasicModal, BasicModalProps } from "../../modal/BasicModal";

type WordleHowToPlayProps = BasicModalProps;

export function WordleHowToPlay(props: WordleHowToPlayProps) {
  const { isOpen, closeModal, showInitially, handleChangeVisiblity } = props;
  return (
    <BasicModal
      title="How to play"
      isOpen={isOpen}
      closeModal={closeModal}
      showInitially={showInitially}
      handleChangeVisiblity={handleChangeVisiblity}
      className="max-w-3xl"
    >
      <div className="mt-2 flex w-full flex-col gap-2 border-t border-emerald-500 py-2 text-base">
        <span>You have six attempts to guess a five letter word.</span>
        <span>Use onscreen keyboard or desktop keyboard to enter word.</span>
        <span>Only a valid word will be considered.</span>
        <span>For example word (hello)</span>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="w-full">
            <img
              src="/assets/wordleIcon.png"
              alt="worle icon"
              className="w-full bg-cover"
            />
          </div>
          <div className="flex flex-col gap-2">
            <span>What different color block represent?</span>
            <div className="flex flex-row items-center gap-2 text-sm">
              <div className="aspect-square w-full max-w-[30px] rounded-md border border-gray-700 bg-emerald-300 dark:border-white dark:bg-emerald-500"></div>
              <div>
                Guessed letter is in the word and in the correct position.
              </div>
            </div>
            <div className="flex flex-row items-center gap-2 text-sm">
              <div className="aspect-square w-full max-w-[30px] rounded-md border border-gray-700 bg-yellow-300 dark:border-white dark:bg-yellow-600"></div>
              <div>
                Guessed letter is in the word but not in the correct position.
              </div>
            </div>
            <div className="flex flex-row items-center gap-2 text-sm">
              <div className="aspect-square w-full max-w-[30px] rounded-md border border-gray-700 bg-gray-400 dark:border-white dark:bg-gray-500"></div>
              <div>Guessed letter is not in the word.</div>
            </div>
            <div className="mt-2 border-t border-emerald-500">
              <div className="mt-2">
                <span>Game Mode?</span>
                <div className="mt-1 text-sm">
                  <span className="text-base font-semibold text-emerald-500 dark:text-emerald-400">
                    Normal
                  </span>
                  : Wrong guessed letters from previous guess attempts can be
                  used again.
                </div>
                <div className="text-sm">
                  <span className="text-base font-semibold text-emerald-500  dark:text-emerald-400">
                    Hard
                  </span>
                  : Wrong guessed letters from previous guess attempts are not
                  allowed to be used again.
                </div>
                <span className="text-sm">
                  Mode can be changed from setting
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BasicModal>
  );
}
