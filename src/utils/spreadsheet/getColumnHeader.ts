const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function getColumnHeader({
  columnIndex,
}: {
  columnIndex: number;
}): string {
  let text = "";

  while (columnIndex >= 0) {
    text += letters[columnIndex % letters.length];

    columnIndex -= letters.length;
  }

  return text;
}
