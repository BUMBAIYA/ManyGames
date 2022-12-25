import { classNames } from "../../utility/css";
import { GameTile } from "./GameLogic";

type NewTileProps = {
  tile: GameTile;
};

const colors =
  "bg-2 bg-4 bg-8 bg-16 bg-32 bg-64 bg-128 bg-256 bg-512 bg-1024 bg-2048";

export default function NewTile({ tile }: NewTileProps) {
  let classArray: string[] = [];
  classArray.push("bg-" + tile.value);
  if (tile.isNew()) classArray.push("animate-show");
  if (tile.hasMoved() && tile.mergeToTile) classArray.push("display-none");
  let styles: React.CSSProperties = !tile.mergeToTile
    ? {
        top: `calc(${tile.row} * (14vmin + 1vmin))`,
        left: `calc(${tile.column} * (14vmin + 1vmin))`,
      }
    : {
        top: `calc(${tile.toRow()} * (14vmin + 1vmin))`,
        left: `calc(${tile.toColumn()} * (14vmin + 1vmin))`,
      };
  if (tile.hasMoved()) classArray.push("display-inline");
  let classes = classArray.join(" ");
  return (
    <div
      style={styles}
      className={classNames(
        classes,
        "absolute flex h-[14vmin] w-[14vmin] animate-show items-center justify-center rounded-[1vmin] text-[7vmin] font-bold text-white transition-all duration-100 ease-in-out"
      )}
    >
      {tile.value}
    </div>
  );
}
