import type { Color, PerspectiveCamera, Scene } from "three";

/**
 * The only place the field is drawn.
 *
 * `initField` runs once. It receives the scene, the camera, and `color`.
 * `color` is gray in the light theme and near-white in the dark theme,
 * and it changes in place when the theme changes.
 *
 * `updateField` runs once a frame. `time` is seconds since the loop started.
 * It is not called when reduced motion is on, so the first frame stays still.
 */
export interface Field {
  scene: Scene;
  camera: PerspectiveCamera;
  color: Color;
}

export function initField(_field: Field): void {}

export function updateField(_field: Field, _time: number): void {}
