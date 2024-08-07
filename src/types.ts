export type Cell = {
  columnIndex: number;
  rowIndex: number;
};

export type Coordinates = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type Rect = Coordinates & Size;

export type SpreadsheetConfig = {
  columnCount: number;
  canvasElement: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  getCellSize: (rest: Cell) => Size;
  getCellValue: (rest: Cell) => string;
  inputElement: HTMLInputElement;
  rowCount: number;
  scrollerElement: HTMLDivElement;
  setCellValue: (
    rest: Cell & {
      value: string;
    }
  ) => void;
  sizingElement: HTMLDivElement;
};

export type SpreadsheetState = {
  activeCell: Cell | null;
  activeCellRect: Rect | null;
  height: number;
  offsetX: number;
  offsetY: number;
  focusedCell: Cell | null;
  pointerState: {
    currentCell: Cell;
    isDown: boolean;
    isDragging: boolean;
    startCell: Cell;
  } | null;
  selection: {
    start: Cell;
    stop: Cell;
  } | null;
  width: number;
};
