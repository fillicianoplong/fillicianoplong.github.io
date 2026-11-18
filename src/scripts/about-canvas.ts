import { Color, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { initField, updateField, type Field } from "./about-field";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const LIGHT = "#5c5c5c";
const DARK = "#d8d8d8";

function themeColor(target: Color): void {
  const dark = document.documentElement.dataset.theme === "dark";
  target.set(dark ? DARK : LIGHT);
}

export function startAboutCanvas(): void {
  const canvas = document.querySelector<HTMLCanvasElement>("[data-about-canvas]");
  if (!canvas) return;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
  } catch {
    canvas.remove();
    return;
  }

  if (!renderer.getContext()) {
    renderer.dispose();
    canvas.remove();
    return;
  }

  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 6);
  const color = new Color(LIGHT);
  themeColor(color);
  scene.userData.color = color;

  const field: Field = { scene, camera, color };
  initField(field);

  const resize = (): void => {
    const width = Math.max(1, Math.round(canvas.clientWidth));
    const height = Math.max(1, Math.round(canvas.clientHeight));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const motion = window.matchMedia(REDUCED_MOTION);
  let frame = 0;
  const started = performance.now();

  const render = (): void => {
    renderer.render(scene, camera);
  };

  const stop = (): void => {
    cancelAnimationFrame(frame);
    frame = 0;
  };

  const loop = (now: number): void => {
    updateField(field, (now - started) / 1000);
    render();
    frame = requestAnimationFrame(loop);
  };

  const play = (): void => {
    stop();
    if (document.hidden || motion.matches) {
      render();
      return;
    }
    frame = requestAnimationFrame(loop);
  };

  resize();
  play();

  const onResize = new ResizeObserver(() => {
    resize();
    if (document.hidden || motion.matches) render();
  });
  onResize.observe(canvas);

  const onVisibility = (): void => {
    if (document.hidden) {
      stop();
      return;
    }
    play();
  };
  document.addEventListener("visibilitychange", onVisibility);

  const onMotion = (): void => {
    play();
  };
  motion.addEventListener("change", onMotion);

  const onTheme = (): void => {
    themeColor(color);
    if (document.hidden || motion.matches) render();
  };
  const themeObserver = new MutationObserver(onTheme);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  const cleanup = (): void => {
    stop();
    onResize.disconnect();
    themeObserver.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    motion.removeEventListener("change", onMotion);
    renderer.dispose();
  };
  window.addEventListener("pagehide", cleanup, { once: true });
}
