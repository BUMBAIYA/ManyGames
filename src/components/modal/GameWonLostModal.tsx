import ConfettiComponent from "./ConfettiComponent";
import { BasicModal, BasicModalProps } from "./BasicModal";

export type GameWonLostModalProps = {
  isWon: boolean;
} & BasicModalProps;

export default function GameWonLostModal(props: GameWonLostModalProps) {
  return (
    <BasicModal
      title={props.isWon ? "You won" : "You Lost"}
      isOpen={props.isOpen}
      closeModal={props.closeModal}
      className={props.className}
      confetti={props.isWon && <ConfettiComponent />}
    >
      {props.children}
    </BasicModal>
  );
}
