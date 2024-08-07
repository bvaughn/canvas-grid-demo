import { Cell, SpreadsheetConfig, SpreadsheetState } from "../../types";
import { drawSpreadsheet } from "./drawSpreadsheet";

export function confirmPendingEdit({
  cell,
  config,
  state,
  value,
}: {
  cell: Cell;
  config: SpreadsheetConfig;
  state: SpreadsheetState;
  value: string;
}) {
  config.setCellValue({ ...cell, value });

  state.activeCell = null;
  state.activeCellRect = null;

  drawSpreadsheet(config, state);
}
