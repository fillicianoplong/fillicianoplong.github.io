const STORAGE_KEY = "theme";

type Theme = "light" | "dark";

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(theme: Theme, persist: boolean): void {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;

  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage can be blocked. The choice still applies for this view.
    }
  }

  const button = document.querySelector<HTMLButtonElement>("[data-theme-toggle]");
  if (button) {
    const next = theme === "dark" ? "light" : "dark";
    button.setAttribute("aria-label", `Switch to ${next} theme`);
  }

  const themeColor = document.querySelector<HTMLMetaElement>("[data-theme-color]");
  if (themeColor) themeColor.content = theme === "dark" ? "#0f0f0f" : "#f2f2f2";
}

function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "light" || value === "dark") return value;
  } catch {
    return null;
  }
  return null;
}

export function initThemeToggle(): void {
  applyTheme(readTheme(), false);

  document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
    applyTheme(readTheme() === "dark" ? "light" : "dark", true);
  });

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", () => {
    if (storedTheme()) return;
    applyTheme(media.matches ? "dark" : "light", false);
  });
}
