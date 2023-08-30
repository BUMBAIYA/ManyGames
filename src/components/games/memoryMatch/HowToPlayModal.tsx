import { BasicModal, BasicModalProps } from "../../modal/BasicModal";

type HowToPlayModalProps = {} & BasicModalProps;

export function HowToPlayModal(props: HowToPlayModalProps) {
  const { isOpen, className, closeModal } = props;

  const handleClose = () => {
    closeModal(false);
  };

  return (
    <BasicModal
      title="How to play"
      closeModal={handleClose}
      isOpen={isOpen}
      className={className}
    >
      <div className="mt-4">This is how to play</div>
    </BasicModal>
  );
}
