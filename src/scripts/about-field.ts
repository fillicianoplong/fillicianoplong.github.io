import { sheetSpan } from "./about-framing";

interface BatteryManager extends EventTarget {
  charging: boolean;
  level: number;
}

interface NavigatorWithHints extends Navigator {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
  getBattery?: () => Promise<BatteryManager>;
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const SMALL = "(max-width: 800px)";
const MOBILE = "(max-width: 767px), ((pointer: coarse) and (max-width: 1024px))";

function gridSize(width: number, height: number): { cols: number; rows: number } {
  const small = window.matchMedia(SMALL).matches;
  const hints = navigator as NavigatorWithHints;
  const cores = navigator.hardwareConcurrency;
  const lowCores = typeof cores === "number" && cores > 0 && cores <= 4;
  const lowMemory = typeof hints.deviceMemory === "number" && hints.deviceMemory > 0 && hints.deviceMemory <= 4;
  const low = lowCores || lowMemory || hints.connection?.saveData === true;
  if (small) return { cols: 110, rows: 72 };
  const span = sheetSpan(width, height);
  const rows = low ? 120 : 164;
  const baseCols = low ? 180 : 248;
  const cols = Math.round(baseCols * (span / 1.35));
  return { cols: Math.min(Math.max(cols, baseCols), low ? 480 : 960), rows };
}

function viewSize(canvas: HTMLCanvasElement): { width: number; height: number; pixelRatio: number } {
  const section = canvas.closest("section");
  const rect = section?.getBoundingClientRect();
  const width = Math.max(2, Math.round(rect?.width || canvas.clientWidth || 2));
  const height = Math.max(2, Math.round(rect?.height || canvas.clientHeight || 2));
  const cap = width < 800 ? 1 : 1.15;
  return {
    width,
    height,
    pixelRatio: Math.min(window.devicePixelRatio || 1, cap),
  };
}

/**
 * Point field behind the About section.
 * The renderer runs off the main thread, after the text paints.
 * A still frame is drawn when motion is reduced. Without WebGL, the
 * gray gradient underneath stays. The loop pauses while the tab is hidden.
 * Small and low-power screens draw fewer points.
 */
export function startAboutField(): void {
  const canvas = document.querySelector<HTMLCanvasElement>("[data-about-field]");
  if (!canvas || typeof canvas.transferControlToOffscreen !== "function") return;

  const boot = (): void => {
    const worker = new Worker(new URL("./about-worker.ts", import.meta.url), { type: "module" });
    const size = viewSize(canvas);
    const { cols, rows } = gridSize(size.width, size.height);
    const offscreen = canvas.transferControlToOffscreen();
    worker.postMessage(
      {
        type: "init",
        canvas: offscreen,
        ...size,
        span: sheetSpan(size.width, size.height),
        light: document.documentElement.dataset.theme === "dark" ? 0 : 1,
        reduced: window.matchMedia(REDUCED_MOTION).matches,
        cols,
        rows,
      },
      [offscreen],
    );

    let shown = true;
    let powered = true;
    const publish = (): void => {
      worker.postMessage({ type: "visible", visible: shown && powered && !document.hidden });
    };

    worker.addEventListener("message", (event: MessageEvent<{ type?: string }>) => {
      if (event.data?.type === "failed") canvas.remove();
    });
    worker.addEventListener("error", () => {
      canvas.remove();
    });

    const resizeObserver = new ResizeObserver(() => {
      const next = viewSize(canvas);
      worker.postMessage({ type: "resize", ...next, span: sheetSpan(next.width, next.height) });
    });
    resizeObserver.observe(canvas);

    const about = canvas.closest("section");
    if (about) {
      const visibility = new IntersectionObserver(
        (entries) => {
          shown = entries.some((entry) => entry.isIntersecting);
          publish();
        },
        { threshold: 0 },
      );
      visibility.observe(about);
    }

    document.addEventListener("visibilitychange", publish);

    const motion = window.matchMedia(REDUCED_MOTION);
    motion.addEventListener("change", () => {
      worker.postMessage({ type: "motion", reduced: motion.matches });
    });

    const themeObserver = new MutationObserver(() => {
      worker.postMessage({
        type: "theme",
        light: document.documentElement.dataset.theme === "dark" ? 0 : 1,
      });
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const hints = navigator as NavigatorWithHints;
    if (window.matchMedia(MOBILE).matches && hints.getBattery) {
      hints
        .getBattery()
        .then((battery) => {
          const check = (): void => {
            powered = battery.charging || battery.level > 0.2;
            publish();
          };
          check();
          battery.addEventListener("levelchange", check);
          battery.addEventListener("chargingchange", check);
        })
        .catch(() => {
          publish();
        });
    }
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(boot);
  });
}
