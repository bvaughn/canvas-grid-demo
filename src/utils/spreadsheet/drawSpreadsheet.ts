import { SIZES, STYLES } from "../../constants";
import { SpreadsheetConfig, SpreadsheetState } from "../../types";
import { assert } from "../assert";
import {
  drawRect,
  STROKE_SIDE_BOTTOM,
  STROKE_SIDE_RIGHT,
} from "../canvas/drawRect";
import { fillText } from "../canvas/fillText";
import { getCellAtPosition } from "./getCellAtPosition";
import { getCellRect } from "./getCellRect";
import { getColumnHeader } from "./getColumnHeader";
import { transposeRect } from "./transposeRect";

export function drawSpreadsheet(
  config: SpreadsheetConfig,
  state: SpreadsheetState
) {
  const { context, getCellValue, inputElement } = config;
  const { focusedCell, height, offsetX, offsetY, selection, width } = state;

  context.clearRect(0, 0, width, height);

  const topLeftCell = getCellAtPosition({
    config,
    coordinates: { x: offsetX, y: offsetY },
    findNearest: true,
    state,
  });

  const bottomRightCell = getCellAtPosition({
    config,
    coordinates: { x: offsetX + width, y: offsetY + height },
    findNearest: true,
    state,
  });

  assert(topLeftCell != null, "Expected topLeftCell to be defined");
  assert(bottomRightCell != null, "Expected bottomRightCell to be defined");

  const visibleBounds = {
    start: {
      columnIndex: topLeftCell.columnIndex,
      rowIndex: topLeftCell.rowIndex,
    },
    stop: {
      columnIndex: bottomRightCell.columnIndex,
      rowIndex: bottomRightCell.rowIndex,
    },
  };

  // Draw visible spreadsheet cells
  for (
    let rowIndex = visibleBounds.start.rowIndex;
    rowIndex <= visibleBounds.stop.rowIndex;
    rowIndex++
  ) {
    for (
      let columnIndex = visibleBounds.start.columnIndex;
      columnIndex <= visibleBounds.stop.columnIndex;
      columnIndex++
    ) {
      const isSelected =
        selection &&
        rowIndex >= selection.start.rowIndex &&
        rowIndex <= selection.stop.rowIndex &&
        columnIndex >= selection.start.columnIndex &&
        columnIndex <= selection.stop.columnIndex;

      const cell = { columnIndex, rowIndex };

      const rect = transposeRect(
        getCellRect({
          cell,
          config,
          state,
        }),
        state
      );
      const text = getCellValue({ columnIndex, rowIndex });

      let fillStyle;
      let lineWidth;
      let strokeStyle;

      if (isSelected) {
        fillStyle = STYLES.background.selected;
        lineWidth = 1;
        strokeStyle = STYLES.border.default;
      } else {
        fillStyle = STYLES.background.default;
        lineWidth = 1;
        strokeStyle = STYLES.border.default;
      }

      drawRect({
        context,
        fillStyle,
        lineWidth,
        rect,
        strokeSides: STROKE_SIDE_BOTTOM | STROKE_SIDE_RIGHT,
        strokeStyle,
      });

      fillText({
        context,
        padding: SIZES.cellPadding,
        rect,
        text,
        textAlign: "right",
      });
    }
  }

  // Draw selection outline above base grid
  if (selection) {
    const topLeftCell = transposeRect(
      getCellRect({
        cell: {
          columnIndex: selection.start.columnIndex,
          rowIndex: selection.start.rowIndex,
        },
        config,
        state,
      }),
      state
    );
    const bottomRightCell = transposeRect(
      getCellRect({
        cell: {
          columnIndex: selection.stop.columnIndex,
          rowIndex: selection.stop.rowIndex,
        },
        config,
        state,
      }),
      state
    );

    drawRect({
      context,
      rect: {
        height: bottomRightCell.y + bottomRightCell.height - topLeftCell.y,
        width: bottomRightCell.x + bottomRightCell.width - topLeftCell.x,
        x: topLeftCell.x,
        y: topLeftCell.y,
      },
      strokeStyle: STYLES.border.selected,
    });
  }

  // Draw focused cell on top of everything else
  if (focusedCell) {
    const { columnIndex, rowIndex } = focusedCell;
    const rect = transposeRect(
      getCellRect({
        cell: { rowIndex, columnIndex },
        config,
        state,
      }),
      state
    );

    drawRect({
      context,
      rect: {
        height: rect.height,
        width: rect.width,
        x: rect.x,
        y: rect.y,
      },
      strokeStyle: STYLES.border.focused,
    });
  }

  // Draw fixed row headers
  for (
    let columnIndex = visibleBounds.start.columnIndex;
    columnIndex <= visibleBounds.stop.columnIndex;
    columnIndex++
  ) {
    const isSelected =
      selection &&
      selection.start.columnIndex <= columnIndex &&
      selection.stop.columnIndex >= columnIndex;
    const rect = {
      ...transposeRect(
        getCellRect({
          cell: { columnIndex, rowIndex: -1 },
          config,
          state,
        }),
        state
      ),
      y: 0,
    };

    drawRect({
      context,
      fillStyle: isSelected
        ? STYLES.background.selectedFixed
        : STYLES.background.fixedRow,
      lineWidth: 1,
      rect,
      strokeSides: STROKE_SIDE_BOTTOM | STROKE_SIDE_RIGHT,
      strokeStyle: STYLES.border.fixedRow,
    });

    fillText({
      context,
      font: isSelected ? STYLES.fonts.fixedRowSelected : STYLES.fonts.fixedRow,
      padding: SIZES.cellPadding,
      rect,
      text: columnIndex >= 0 ? getColumnHeader({ columnIndex }) : "",
      textAlign: "center",
    });
  }

  // Draw fixed column labels
  for (
    let rowIndex = visibleBounds.start.rowIndex;
    rowIndex <= visibleBounds.stop.rowIndex;
    rowIndex++
  ) {
    const isSelected =
      selection &&
      selection.start.rowIndex <= rowIndex &&
      selection.stop.rowIndex >= rowIndex;

    const rect = {
      ...transposeRect(
        getCellRect({
          cell: { columnIndex: -1, rowIndex },
          config,
          state,
        }),
        state
      ),
      x: 0,
    };

    drawRect({
      context,
      fillStyle: isSelected
        ? STYLES.background.selectedFixed
        : STYLES.background.default,
      rect,
      strokeSides: STROKE_SIDE_BOTTOM | STROKE_SIDE_RIGHT,
      strokeStyle: STYLES.border.fixedColumn,
    });

    fillText({
      context,
      fillStyle: STYLES.text.default,
      font: isSelected
        ? STYLES.fonts.fixedColumnSelected
        : STYLES.fonts.fixedColumn,
      padding: SIZES.cellPadding,
      rect,
      text: "" + (rowIndex + 1),
      textAlign: "center",
    });
  }

  if (state.activeCell && state.activeCellRect) {
    const { activeCell, activeCellRect } = state;

    inputElement.style.display = "block";
    inputElement.style.font = STYLES.fonts.default;
    inputElement.style.left = `${activeCellRect.x}px`;
    inputElement.style.top = `${activeCellRect.y}px`;
    inputElement.style.height = `${activeCellRect.height}px`;
    inputElement.style.width = `${activeCellRect.width}px`;
    inputElement.value = getCellValue({
      columnIndex: activeCell.columnIndex,
      rowIndex: activeCell.rowIndex,
    });
  } else {
    inputElement.style.display = "none";
  }

  drawRect({
    context,
    fillStyle: STYLES.background.fixedRow,
    rect: getCellRect({
      cell: {
        columnIndex: -1,
        rowIndex: -1,
      },
      config,
      state,
    }),
    strokeSides: STROKE_SIDE_BOTTOM | STROKE_SIDE_RIGHT,
    strokeStyle: STYLES.border.fixedRow,
  });
}
