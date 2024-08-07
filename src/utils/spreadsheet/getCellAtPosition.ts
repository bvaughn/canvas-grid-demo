import {
  Cell,
  Coordinates,
  SpreadsheetConfig,
  SpreadsheetState,
} from "../../types";

// TODO Cache computed size and offset info in "state"

export function getCellAtPosition({
  config,
  coordinates,
  findNearest,
  state,
}: {
  config: SpreadsheetConfig;
  coordinates: Coordinates;
  findNearest?: boolean;
  state: SpreadsheetState;
}): Cell | null {
  const { columnCount, getCellSize, rowCount } = config;
  const { x, y } = coordinates;

  let columnIndex = -1;
  let currentX = 0;
  while (true) {
    const { width } = getCellSize({ columnIndex, rowIndex: 0 });

    currentX += width;

    if (currentX >= x && currentX + width >= x) {
      break;
    } else if (columnIndex === columnCount - 1) {
      break;
    }

    columnIndex++;
  }

  let rowIndex = -1;
  let currentY = 0;
  while (true) {
    const { height } = getCellSize({ columnIndex: 0, rowIndex });

    currentY += height;

    if (currentY >= y && currentY + height >= y) {
      break;
    } else if (rowIndex === rowCount - 1) {
      break;
    }

    rowIndex++;
  }

  if (columnIndex < 0 || rowIndex < 0) {
    if (findNearest) {
      return {
        columnIndex: Math.max(columnIndex, 0),
        rowIndex: Math.max(rowIndex, 0),
      };
    } else {
      return null;
    }
  } else {
    return { columnIndex, rowIndex };
  }
}
