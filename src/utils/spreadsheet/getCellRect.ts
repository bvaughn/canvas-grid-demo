import { SIZES } from "../../constants";
import { Cell, SpreadsheetConfig, SpreadsheetState } from "../../types";

// TODO Cache computed size and offset info in "state"

export function getCellRect({
  cell,
  config: { getCellSize },
  state: {},
}: {
  cell: Cell;
  config: SpreadsheetConfig;
  state: SpreadsheetState;
}) {
  const { columnIndex, rowIndex } = cell;

  let x = 0;
  for (
    let prevColumnIndex = -1;
    prevColumnIndex < columnIndex;
    prevColumnIndex++
  ) {
    const { width } = getCellSize({
      columnIndex: prevColumnIndex,
      rowIndex: 0,
    });

    x += width;
  }

  let y = 0;
  for (let prevRowIndex = -1; prevRowIndex < rowIndex; prevRowIndex++) {
    const { height } = getCellSize({ columnIndex: 0, rowIndex: prevRowIndex });

    y += height;
  }

  const size = getCellSize({ columnIndex, rowIndex });
  const height = size.height;
  const width = size.width;

  return {
    height,
    width,
    x,
    y,
  };
}
