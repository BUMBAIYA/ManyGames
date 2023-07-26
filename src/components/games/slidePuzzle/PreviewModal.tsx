import { BasicModal, BasicModalProps } from "../../modal/BasicModal";

type PreviewModalProps = {
  imageUrl: string;
} & BasicModalProps;

export function PreviewModal(props: PreviewModalProps) {
  return (
    <BasicModal
      title="Puzzle preview"
      isOpen={props.isOpen}
      closeModal={props.closeModal}
      className={props.className}
    >
      <div className="mt-4">
        <img
          loading="lazy"
          src={props.imageUrl}
          alt="puzzle image"
          className="mt-1 rounded-md bg-cover"
        />
      </div>
    </BasicModal>
  );
}
