import { GameTile } from "./GameLogic";
import styles from "./styles.module.scss";

type NewTileProps = {
  tile: GameTile;
};

const colorss: any = {
  2: "bg-emerald-200 text-emerald-800 dark:text-emerald-800",
  4: "bg-emerald-300 text-emerald-800",
  8: "bg-emerald-400 text-emerald-800",
  16: "bg-emerald-500 text-emerald-100",
  32: "bg-emerald-600 text-emerald-100",
  64: "bg-emerald-700 text-emerald-300",
  128: "bg-teal-400 text-teal-800",
  256: "bg-teal-600 text-teal-200",
  512: "bg-green-500 text-emerald-800",
  1024: "bg-yellow-200 text-emerald-800",
  2048: "bg-blue-600 text-white",
};

export default function NewTile({ tile }: NewTileProps) {
  let classArray: string[] = [
    `${styles.tile} inline-flex items-center justify-center font-bold w-[76px] h-[76px] rounded-md sm:w-32 sm:h-32 border border-emerald-600 dark:border-none text-3xl sm:text-5xl`,
  ];
  classArray.push(colorss[tile.value]);
  if (!tile.mergeToTile)
    classArray.push(`${styles[`position_${tile.row}_${tile.column}`]}`);
  else classArray.push(`${styles.merged}`);
  if (tile.isNew()) classArray.push(`${styles.new}`);
  if (tile.hasMoved()) {
    classArray.push(
      `${styles[`row_from_${tile.fromRow()}_to_${tile.toRow()}`]}`,
    );
    classArray.push(
      `${styles[`column_from_${tile.fromColumn()}_to_${tile.toColumn()}`]}`,
    );
    classArray.push(`${styles.isMoving}`);
  }
  let classes = classArray.join(" ");
  return <div className={classes}>{tile.value}</div>;
}
