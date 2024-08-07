import { Cell, SpreadsheetConfig, SpreadsheetState } from "../../types";
import { drawSpreadsheet } from "./drawSpreadsheet";
import { getCellRect } from "./getCellRect";

export function activateCell({
  cell,
  config,
  state,
}: {
  cell: Cell;
  config: SpreadsheetConfig;
  state: SpreadsheetState;
}) {
  const { inputElement } = config;

  const rect = getCellRect({ cell, config, state });

  state.activeCell = cell;
  state.activeCellRect = {
    ...rect,
    x: rect.x - state.offsetX,
    y: rect.y - state.offsetY,
  };

  inputElement.style.display = "block";
  inputElement.focus();

  drawSpreadsheet(config, state);
}
