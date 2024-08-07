import { SIZES } from "./constants";
import {
  getCanvasElement,
  getInputElement,
  getScrollerDivElement,
  getSizingElement,
} from "./dom";
import { createSpreadsheet } from "./utils/spreadsheet/createSpreadsheet";

const inputElement = getInputElement();
const scrollerElement = getScrollerDivElement();
const sizingElement = getSizingElement();
const canvasElement = getCanvasElement();

{
  // Fake grid data for demo purposes

  const columnCount = 100;
  const rowCount = 1_000;
  const defaultCellWidth = 60;
  const fixedCellWidth = 25;
  const randomData = new Array(rowCount * columnCount)
    .fill(true)
    .map(() => "" + Math.round(Math.random() * 10_000));
  const randomCellWidths = new Array(rowCount * columnCount).fill(
    defaultCellWidth
  );

  createSpreadsheet({
    canvasElement,
    columnCount,
    context: canvasElement.getContext("2d") as CanvasRenderingContext2D,
    getCellSize: ({ columnIndex, rowIndex }) => {
      return {
        height: SIZES.defaultCellHeight,
        width: columnIndex < 0 ? fixedCellWidth : randomCellWidths[columnIndex],
      };
    },
    getCellValue: ({ columnIndex, rowIndex }) => {
      const index = rowIndex * columnCount + columnIndex;
      return randomData[index];
    },
    inputElement,
    rowCount,
    scrollerElement,
    setCellValue({ columnIndex, rowIndex, value }) {
      const index = rowIndex * columnCount + columnIndex;
      return (randomData[index] = value);
    },
    sizingElement,
  });
}
