import { STYLES } from "../../constants";
import { Rect } from "../../types";

export function fillText({
  context,
  fillStyle = STYLES.text.default,
  font = STYLES.fonts.default,
  padding,
  rect,
  text,
  textAlign,
  textBaseline = "middle",
}: {
  context: CanvasRenderingContext2D;
  fillStyle?: CanvasRenderingContext2D["fillStyle"];
  font?: CanvasRenderingContext2D["font"];
  padding: number;
  rect: Rect;
  text: string;
  textAlign: "center" | "left" | "right";
  textBaseline?: CanvasRenderingContext2D["textBaseline"];
}) {
  let { height, width, x, y } = rect;

  while (text.length > 0) {
    const { width: measuredWidth } = context.measureText(text);

    if (measuredWidth > width - padding * 2) {
      text = text.substring(0, text.length - 1);
    } else {
      break;
    }
  }

  const verticalCenter = y + height / 2;

  context.font = font;
  context.textBaseline = textBaseline;
  context.fillStyle = fillStyle;

  switch (textAlign) {
    case "center": {
      context.textAlign = "center";
      context.fillText(text, x + width / 2, verticalCenter);
      break;
    }
    case "left": {
      context.textAlign = "left";
      context.fillText(text, x + padding, verticalCenter);
      break;
    }
    case "right": {
      context.textAlign = "right";
      context.fillText(text, x + width - padding, verticalCenter);
      break;
    }
    default: {
      throw `Unsupported alignment "${textAlign}"`;
    }
  }
}
