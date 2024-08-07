import { Cell, Rect, SpreadsheetConfig, SpreadsheetState } from "../../types";
import { getCellRect } from "./getCellRect";

export function getMergedRect({
  cells,
  config,
  state,
}: {
  cells: Cell[];
  config: SpreadsheetConfig;
  state: SpreadsheetState;
}): Rect {
  let minColumnIndex = Infinity;
  let minRowIndex = Infinity;
  let maxColumnIndex = 0;
  let maxRowIndex = 0;

  cells.forEach(({ columnIndex, rowIndex }) => {
    minColumnIndex = Math.min(minColumnIndex, columnIndex);
    minRowIndex = Math.min(minRowIndex, rowIndex);
    maxColumnIndex = Math.max(maxColumnIndex, columnIndex);
    maxRowIndex = Math.max(maxRowIndex, rowIndex);
  });

  const minCell = {
    columnIndex: minColumnIndex,
    rowIndex: minRowIndex,
  };
  const maxCell = {
    columnIndex: maxColumnIndex,
    rowIndex: maxRowIndex,
  };

  const minRect = getCellRect({
    cell: minCell,
    config,
    state,
  });
  const maxRect = getCellRect({
    cell: maxCell,
    config,
    state,
  });

  return {
    height: maxRect.y + maxRect.height - minRect.y,
    width: maxRect.x + maxRect.width - minRect.x,
    x: minRect.x,
    y: minRect.y,
  };
}
