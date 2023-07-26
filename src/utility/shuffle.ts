export function shuffleTiles<T>(tiles: T[]) {
  let shuffledTiles = tiles
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
  return shuffledTiles;
}
