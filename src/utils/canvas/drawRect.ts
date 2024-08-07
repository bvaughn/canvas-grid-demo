import { Rect } from "../../types";

export const STROKE_SIDE_BOTTOM = 0b0001;
export const STROKE_SIDE_LEFT = 0b0010;
export const STROKE_SIDE_RIGHT = 0b0100;
export const STROKE_SIDE_TOP = 0b1000;

export function drawRect({
  context,
  fillStyle,
  lineCap = "square",
  lineWidth = 1,
  rect,
  strokeSides = STROKE_SIDE_BOTTOM |
    STROKE_SIDE_LEFT |
    STROKE_SIDE_RIGHT |
    STROKE_SIDE_TOP,
  strokeStyle,
}: {
  context: CanvasRenderingContext2D;
  fillStyle?: CanvasRenderingContext2D["fillStyle"];
  lineCap?: CanvasRenderingContext2D["lineCap"];
  lineWidth?: CanvasRenderingContext2D["lineWidth"];
  rect: Rect;
  strokeSides?: number;
  strokeStyle?: CanvasRenderingContext2D["strokeStyle"];
}) {
  if (fillStyle != null) {
    context.fillStyle = fillStyle;
  }
  context.lineCap = lineCap;
  context.lineWidth = lineWidth;
  if (strokeStyle != null) {
    context.strokeStyle = strokeStyle;
  }

  let x0 = Math.floor(rect.x);
  let x1 = Math.ceil(rect.x + rect.width);
  let y0 = Math.floor(rect.y);
  let y1 = Math.ceil(rect.y + rect.height);

  if (fillStyle) {
    context.moveTo(x0, y0);
    context.lineTo(x1, y0);
    context.lineTo(x1, y1);
    context.lineTo(x0, y1);
    context.lineTo(x0, y0);
    context.fill();
  }

  x0 = Math.floor(x0 + lineWidth / 2);
  x1 = Math.ceil(x1 - lineWidth / 2);
  y0 = Math.floor(y0 + lineWidth / 2);
  y1 = Math.ceil(y1 - lineWidth / 2);

  if (strokeStyle) {
    context.beginPath();
    if (strokeSides) {
      if (strokeSides & STROKE_SIDE_BOTTOM) {
        context.moveTo(x0, y1);
        context.lineTo(x1, y1);
      }
      if (strokeSides & STROKE_SIDE_LEFT) {
        context.moveTo(x0, y0);
        context.lineTo(x0, y1);
      }
      if (strokeSides & STROKE_SIDE_RIGHT) {
        context.moveTo(x1, y0);
        context.lineTo(x1, y1);
      }
      if (strokeSides & STROKE_SIDE_TOP) {
        context.moveTo(x0, y0);
        context.lineTo(x1, y0);
      }
    }
    context.stroke();
    context.closePath();
  }
}
