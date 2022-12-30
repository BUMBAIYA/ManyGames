import { GameTile } from "./GameLogic";

type NewTileProps = {
  tile: GameTile;
};

const colors =
  "bg-2 bg-4 bg-8 bg-16 bg-32 bg-64 bg-128 bg-256 bg-512 bg-1024 bg-2048";

export default function NewTile({ tile }: NewTileProps) {
  let classArray: string[] = ["tile"];
  classArray.push("bg-" + tile.value);
  if (!tile.mergeToTile) classArray.push(`position_${tile.row}_${tile.column}`);
  else classArray.push("merged");
  if (tile.isNew()) classArray.push("new");
  if (tile.hasMoved()) {
    classArray.push(`row_from_${tile.fromRow()}_to_${tile.toRow()}`);
    classArray.push(`column_from_${tile.fromColumn()}_to_${tile.toColumn()}`);
    classArray.push("isMoving");
  }
  let classes = classArray.join(" ");
  return <div className={classes}>{tile.value}</div>;
}
