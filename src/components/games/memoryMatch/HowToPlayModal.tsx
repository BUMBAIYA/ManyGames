import { BasicModal, BasicModalProps } from "../../modal/BasicModal";

type HowToPlayModalProps = {} & BasicModalProps;

export function HowToPlayModal(props: HowToPlayModalProps) {
  const {
    isOpen,
    className,
    closeModal,
    showInitially,
    handleChangeVisiblity,
  } = props;

  const handleClose = () => {
    closeModal(false);
  };

  return (
    <BasicModal
      title="How to play"
      closeModal={handleClose}
      isOpen={isOpen}
      className={className}
      showInitially={showInitially}
      handleChangeVisiblity={handleChangeVisiblity}
    >
      <div className="mt-2 border-t border-emerald-500 py-2">
        This is how to play
      </div>
    </BasicModal>
  );
}
