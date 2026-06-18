import { ref } from "vue";

export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "oj-theme-mode";

/**
 * Read the persisted theme. Defaults to Terminal Dark (developer console).
 */
const getInitialMode = (): ThemeMode => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") {
      return saved;
    }
  } catch {
    // localStorage may be unavailable (private mode); fall through to default.
  }
  return "dark";
};

// Shared, app-wide reactive theme state.
const mode = ref<ThemeMode>(getInitialMode());

/**
 * Apply a theme by toggling attributes only — no remount, so component
 * state (form inputs, editor contents, etc.) is preserved.
 */
const applyMode = (next: ThemeMode) => {
  mode.value = next;
  const body = document.body;
  const root = document.documentElement;
  // `data-theme` is present in BOTH modes so our Arco palette overrides
  // (defined on `body[data-theme]`) outrank Arco's own `body` declarations.
  body.setAttribute("data-theme", next);
  root.setAttribute("data-mode", next);
  if (next === "dark") {
    body.setAttribute("arco-theme", "dark");
  } else {
    body.removeAttribute("arco-theme");
  }
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // ignore persistence failures
  }
};

/** Apply the persisted theme on startup. */
export const initTheme = () => applyMode(mode.value);

export const useTheme = () => {
  const setMode = (next: ThemeMode) => applyMode(next);
  const toggleMode = () => applyMode(mode.value === "dark" ? "light" : "dark");
  return { mode, setMode, toggleMode };
};
