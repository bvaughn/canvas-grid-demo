import { Cell, SpreadsheetConfig, SpreadsheetState } from "../../types";
import { activateCell } from "./activateCell";
import { drawSpreadsheet } from "./drawSpreadsheet";
import { getCellAtPosition } from "./getCellAtPosition";
import { resizeAndScaleElements } from "./resizeAndScaleElements";
import { resizeScrollableArea } from "./resizeScrollableArea";
import { scrollCellIntoView } from "./scrollCellIntoView";

export function createSpreadsheet(config: SpreadsheetConfig) {
  const { columnCount, inputElement, rowCount, scrollerElement } = config;

  const state: SpreadsheetState = {
    activeCell: null,
    activeCellRect: null,
    height: window.innerHeight,
    offsetX: 0,
    offsetY: 0,
    focusedCell: null,
    selectionState: null,
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

  scrollerElement.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowLeft":
      case "ArrowRight":
      case "ArrowUp": {
        if (state.activeCell) {
          return;
        }

        event.preventDefault();

        // TODO Maybe support event.metaKey for Home/End

        if (state.focusedCell) {
          const prevCell = event.shiftKey
            ? state.selectionState?.currentCell ?? state.focusedCell
            : state.focusedCell;

          let newCell: Cell | null = null;

          switch (event.key) {
            case "ArrowDown": {
              if (prevCell.rowIndex + 1 < rowCount) {
                newCell = {
                  columnIndex: prevCell.columnIndex,
                  rowIndex: prevCell.rowIndex + 1,
                };
              }
              break;
            }
            case "ArrowLeft": {
              if (prevCell.columnIndex > 0) {
                newCell = {
                  columnIndex: prevCell.columnIndex - 1,
                  rowIndex: prevCell.rowIndex,
                };
              }
              break;
            }
            case "ArrowRight": {
              if (prevCell.columnIndex + 1 < columnCount) {
                newCell = {
                  columnIndex: prevCell.columnIndex + 1,
                  rowIndex: prevCell.rowIndex,
                };
              }
              break;
            }
            case "ArrowUp": {
              if (prevCell.rowIndex > 0) {
                newCell = {
                  columnIndex: prevCell.columnIndex,
                  rowIndex: prevCell.rowIndex - 1,
                };
              }
              break;
            }
          }

          if (newCell) {
            if (event.shiftKey) {
              if (state.selectionState) {
                state.selectionState.currentCell = newCell;
              }
            } else {
              state.focusedCell = newCell;
              state.selectionState = {
                isDown: false,
                isDragging: false,
                currentCell: newCell,
                startCell: newCell,
              };
            }

            // Scroll the grid if needed to make sure the new cell is visible
            scrollCellIntoView({ cell: newCell, config, state });

            drawSpreadsheet(config, state);
          }
        }
        break;
      }
      case "Enter": {
        if (state.focusedCell) {
          activateCell({
            cell: state.focusedCell,
            config,
            state,
          });
        }
        break;
      }
    }
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

          scrollerElement.focus();
        }
        break;
      }
      case "Escape": {
        state.activeCell = null;
        state.activeCellRect = null;

        drawSpreadsheet(config, state);

        scrollerElement.focus();
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
      state.selectionState = {
        currentCell: cell,
        isDown: true,
        isDragging: false,
        startCell: cell,
      };
    }

    drawSpreadsheet(config, state);
  });

  scrollerElement.addEventListener("pointermove", (event) => {
    // TODO Update selection when moving outside of canvas (or within fixed cells)

    if (state.selectionState) {
      state.selectionState.isDragging = true;
    }

    if (state.selectionState?.isDown) {
      const cell = getCellAtPosition({
        config,
        coordinates: { x: event.offsetX, y: event.offsetY },
        state,
      });

      if (cell) {
        state.selectionState.currentCell = cell;

        drawSpreadsheet(config, state);
      }
    }
  });

  window.addEventListener("pointerup", () => {
    if (state.focusedCell && !state.selectionState?.isDragging) {
      activateCell({
        cell: state.focusedCell,
        config,
        state,
      });

      if (state.selectionState) {
        state.selectionState.isDown = false;
      }
    }
  });
}
