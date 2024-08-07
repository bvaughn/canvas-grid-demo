import { SpreadsheetConfig } from "../../types";

export function resizeScrollableArea({
  config,
}: {
  config: SpreadsheetConfig;
}) {
  const { columnCount, getCellSize, rowCount, sizingElement } = config;

  let totalHeight = 0;
  let totalWidth = 0;

  for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
    const { width } = getCellSize({ columnIndex, rowIndex: 0 });

    totalWidth += width;
  }

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    const { height } = getCellSize({ columnIndex: 0, rowIndex });

    totalHeight += height;
  }

  sizingElement.style.height = `${totalHeight}px`;
  sizingElement.style.width = `${totalWidth}px`;
}
