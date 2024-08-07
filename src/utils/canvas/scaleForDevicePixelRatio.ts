export function scaleForDevicePixelRatio({
  canvasElement,
  context,
}: {
  canvasElement: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
}) {
  const dpr = window.devicePixelRatio || 2;

  const { width, height } = canvasElement.getBoundingClientRect();

  if (
    canvasElement.width !== width * dpr ||
    canvasElement.height !== height * dpr
  ) {
    canvasElement.width = width * dpr;
    canvasElement.height = height * dpr;
  }

  // Reset scale to identical matrix to allow multiple re-scales.
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.scale(dpr, dpr);
}
