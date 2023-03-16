import Confetti from "react-confetti";

export default function ConfettiComponent() {
  return (
    <Confetti
      numberOfPieces={100}
      width={window.innerWidth - 40}
      height={window.innerHeight - 56}
    />
  );
}
