import { Cell, SpreadsheetConfig, SpreadsheetState } from "../../types";
import { getCellRect } from "./getCellRect";

export function scrollCellIntoView({
  cell,
  config,
  state,
}: {
  cell: Cell;
  config: SpreadsheetConfig;
  state: SpreadsheetState;
}) {
  const { scrollerElement } = config;
  const { height, width } = state;

  const fixedRect = getCellRect({
    cell: { columnIndex: -1, rowIndex: -1 },
    config,
    state,
  });
  const rect = getCellRect({ cell, config, state });

  const maxX = rect.x - fixedRect.width;
  const maxY = rect.y - fixedRect.height;
  const minX = rect.x + rect.width - width;
  const minY = rect.y + rect.height - height;

  const offsetX = Math.min(Math.max(state.offsetX, minX), maxX);
  const offsetY = Math.min(Math.max(state.offsetY, minY), maxY);

  scrollerElement.scroll(offsetX, offsetY);
}
