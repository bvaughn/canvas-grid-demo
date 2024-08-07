import { SpreadsheetConfig, SpreadsheetState } from "../../types";
import { scaleForDevicePixelRatio } from "../canvas/scaleForDevicePixelRatio";
import { drawSpreadsheet } from "./drawSpreadsheet";

export function resizeAndScaleElements({
  config,
  state,
}: {
  config: SpreadsheetConfig;
  state: SpreadsheetState;
}) {
  const { canvasElement, context, scrollerElement } = config;

  state.height = window.innerHeight;
  state.width = window.innerWidth;

  canvasElement.style.height = `${state.height}px`;
  canvasElement.style.width = `${state.width}px`;

  scrollerElement.style.height = `${state.height}px`;
  scrollerElement.style.width = `${state.width}px`;

  scaleForDevicePixelRatio({
    canvasElement,
    context,
  });
}
