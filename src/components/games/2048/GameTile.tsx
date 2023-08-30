import styles from "./styles.module.scss";

export type GameTile = {
  value: number;
  row: number;
  column: number;
  oldRow: number;
  oldColumn: number;
  mergeToTile: GameTile | null;
};

export type NewGameTileProps = {
  tile: GameTile;
};

const colors: any = {
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

export function NewGameTile({ tile }: NewGameTileProps) {
  const { column, mergeToTile, oldColumn, oldRow, row, value } = tile;

  const isNew = () => {
    return (oldRow === -1 || oldColumn === -1) && !mergeToTile;
  };

  const fromRow = () => {
    if (mergeToTile !== null) return row;
    return oldRow;
  };

  const fromColumn = () => {
    if (mergeToTile !== null) return column;
    return oldColumn;
  };

  const toRow = () => {
    if (mergeToTile !== null) return mergeToTile.row;
    return row;
  };

  const toColumn = () => {
    if (mergeToTile !== null) return mergeToTile.column;
    return column;
  };

  const hasMoved = () => {
    return (
      (fromRow() !== -1 &&
        (fromRow() !== toRow() || fromColumn() !== toColumn())) ||
      mergeToTile
    );
  };

  let classArray: string[] = [
    `${styles.tile} inline-flex h-[22vw] w-[22vw] lg:w-[18vh] lg:h-[18vh] items-center justify-center font-bold rounded-[1.5vw] lg:rounded-[1vh] border border-emerald-600 dark:border-none text-[8vw] lg:text-[7vh]`,
  ];
  classArray.push(colors[value]);
  if (!mergeToTile) classArray.push(`${styles[`pos_${row}_${column}`]}`);
  else classArray.push(`${styles.merged}`);
  if (isNew()) classArray.push(`${styles.new}`);
  if (hasMoved()) {
    classArray.push(`${styles[`row_from_${fromRow()}_to_${toRow()}`]}`);
    classArray.push(
      `${styles[`column_from_${fromColumn()}_to_${toColumn()}`]}`,
    );
    classArray.push(`${styles.isMoving}`);
  }
  let classes = classArray.join(" ");
  return (
    <div style={mergeToTile ? { zIndex: -1 } : {}} className={classes}>
      {value}
    </div>
  );
}
