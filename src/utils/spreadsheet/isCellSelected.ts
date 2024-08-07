import { Cell, SpreadsheetState } from "../../types";

export function isCellSelected({
  cell,
  state,
}: {
  cell: Partial<Cell>;
  state: SpreadsheetState;
}) {
  if (!state.selectionState) {
    return false;
  }

  const { columnIndex, rowIndex } = cell;

  if (columnIndex != null) {
    const maxColumnIndex = Math.max(
      state.selectionState.currentCell.columnIndex,
      state.selectionState.startCell.columnIndex
    );
    const minColumnIndex = Math.min(
      state.selectionState.currentCell.columnIndex,
      state.selectionState.startCell.columnIndex
    );

    if (columnIndex < minColumnIndex || columnIndex > maxColumnIndex) {
      return false;
    }
  }

  if (rowIndex != null) {
    const maxRowIndex = Math.max(
      state.selectionState.currentCell.rowIndex,
      state.selectionState.startCell.rowIndex
    );
    const minRowIndex = Math.min(
      state.selectionState.currentCell.rowIndex,
      state.selectionState.startCell.rowIndex
    );

    if (rowIndex < minRowIndex || rowIndex > maxRowIndex) {
      return false;
    }
  }

  return true;
}
