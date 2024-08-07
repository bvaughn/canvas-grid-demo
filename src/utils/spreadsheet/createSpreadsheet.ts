import { SpreadsheetConfig, SpreadsheetState } from "../../types";
import { confirmPendingEdit } from "./confirmPendingEdit";
import { drawSpreadsheet } from "./drawSpreadsheet";
import { getCellAtPosition } from "./getCellAtPosition";
import { getCellRect } from "./getCellRect";
import { resizeAndScaleElements } from "./resizeAndScaleElements";
import { resizeScrollableArea } from "./resizeScrollableArea";

export function createSpreadsheet(config: SpreadsheetConfig) {
  const { inputElement, scrollerElement } = config;

  const state: SpreadsheetState = {
    activeCell: null,
    activeCellRect: null,
    height: window.innerHeight,
    offsetX: 0,
    offsetY: 0,
    focusedCell: null,
    pointerState: null,
    selection: null,
    width: window.innerWidth,
  };

  resizeAndScaleElements({ config, state });
  resizeScrollableArea({ config });
  drawSpreadsheet(config, state);

  window.addEventListener("resize", () => {
    resizeAndScaleElements({ config, state });
    drawSpreadsheet(config, state);
  });

  // Let the browser manage (elastic) scrolling for us
  scrollerElement.addEventListener("scroll", (event) => {
    event.preventDefault();

    state.offsetX = scrollerElement.scrollLeft;
    state.offsetY = scrollerElement.scrollTop;

    drawSpreadsheet(config, state);
  });

  inputElement.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "Enter":
      case "Tab": {
        if (state.activeCell) {
          config.setCellValue({
            ...state.activeCell,
            value: inputElement.value,
          });

          state.activeCell = null;
          state.activeCellRect = null;

          drawSpreadsheet(config, state);
        }
        break;
      }
      case "Escape": {
        state.activeCell = null;
        state.activeCellRect = null;

        drawSpreadsheet(config, state);
        break;
      }
    }
  });

  scrollerElement.addEventListener("pointerdown", (event) => {
    if (state.activeCell) {
      config.setCellValue({ ...state.activeCell, value: inputElement.value });

      state.activeCell = null;
      state.activeCellRect = null;

      drawSpreadsheet(config, state);
    }

    const cell = getCellAtPosition({
      config,
      coordinates: { x: event.offsetX, y: event.offsetY },
      state,
    });

    state.activeCell = null;
    state.activeCellRect = null;
    state.focusedCell = cell;

    if (cell) {
      state.pointerState = {
        currentCell: cell,
        isDown: true,
        isDragging: false,
        startCell: cell,
      };
    }

    if (state.focusedCell) {
      state.selection = {
        start: state.focusedCell,
        stop: state.focusedCell,
      };
    }

    drawSpreadsheet(config, state);
  });

  scrollerElement.addEventListener("pointermove", (event) => {
    // TODO Update selection when moving outside of canvas (or within fixed cells)

    if (state.pointerState) {
      state.pointerState.isDragging = true;
    }

    if (state.pointerState) {
      const cell = getCellAtPosition({
        config,
        coordinates: { x: event.offsetX, y: event.offsetY },
        state,
      });

      if (cell) {
        state.pointerState.currentCell = cell;

        // Re-calculate all selected cells based on start point and current point
        state.selection = {
          start: {
            columnIndex: Math.min(
              state.pointerState.startCell.columnIndex,
              cell.columnIndex
            ),
            rowIndex: Math.min(
              state.pointerState.startCell.rowIndex,
              cell.rowIndex
            ),
          },
          stop: {
            columnIndex: Math.max(
              state.pointerState.startCell.columnIndex,
              cell.columnIndex
            ),
            rowIndex: Math.max(
              state.pointerState.startCell.rowIndex,
              cell.rowIndex
            ),
          },
        };

        drawSpreadsheet(config, state);
      }
    }
  });

  window.addEventListener("pointerup", () => {
    if (state.focusedCell && !state.pointerState?.isDragging) {
      state.activeCell = state.focusedCell;

      const rect = getCellRect({ cell: state.activeCell, config, state });
      state.activeCellRect = {
        ...rect,
        x: rect.x - state.offsetX,
        y: rect.y - state.offsetY,
      };

      inputElement.style.display = "block";
      inputElement.focus();

      drawSpreadsheet(config, state);
    }

    state.pointerState = null;
  });

  // TODO Add more event listeners
  // TODO Support keyboard navigation also
}
