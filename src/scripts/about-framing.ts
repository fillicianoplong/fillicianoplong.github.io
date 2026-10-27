/** Radians per second. One breath and one drift cycle take about 90 seconds. */
export const MOTION = 0.07;

const WIDE_ASPECT = 1.05;
const BASE_SPAN = 1.35;
const HALF_FOV = (32 * Math.PI) / 180 / 2;

export function viewAspect(width: number, height: number): number {
  return width / Math.max(height, 1);
}

const CONTENT_MAX = 72 * 16;

/** Half-width of the sheet. Portrait stays as it is. Wide screens match the text column. */
export function sheetSpan(width: number, height: number): number {
  const aspect = viewAspect(width, height);
  if (aspect < WIDE_ASPECT) return BASE_SPAN;
  const tanHalf = Math.tan(HALF_FOV);
  const distH = 1.85 / tanHalf;
  const visibleHalf = tanHalf * distH * aspect;
  const pad = width >= 640 ? 32 : 20;
  const column = Math.min(width, CONTENT_MAX) - pad * 2;
  return visibleHalf * (column / width);
}

export function cameraDistance(width: number, height: number): number {
  const aspect = viewAspect(width, height);
  const tanHalf = Math.tan(HALF_FOV);
  const distH = 1.85 / tanHalf;
  const distW = 1.55 / (tanHalf * Math.max(aspect, 0.2));
  return aspect < WIDE_ASPECT ? Math.max(distH, distW) : distH;
}
