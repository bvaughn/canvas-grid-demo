import { Rect, SpreadsheetState } from "../../types";

export function transposeRect(
  rect: Rect,
  { offsetX, offsetY }: SpreadsheetState
) {
  return {
    ...rect,
    x: rect.x - offsetX,
    y: rect.y - offsetY,
  };
}
