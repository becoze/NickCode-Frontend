<template>
  <button
    type="button"
    class="theme-toggle"
    role="switch"
    :aria-checked="mode === 'dark'"
    aria-label="Toggle light/dark theme"
    @click="toggleMode"
  >
    <span class="theme-seg" :class="{ 'theme-seg--active': mode === 'light' }">
      LGT
    </span>
    <span class="theme-seg" :class="{ 'theme-seg--active': mode === 'dark' }">
      DRK
    </span>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";

// The whole control is one button: a single click anywhere flips the theme,
// while both labels stay visible with the active mode highlighted. Flips
// attributes only — no remount, so typed inputs and editor state persist.
const { mode, toggleMode } = useTheme();
</script>

<style scoped>
.theme-toggle {
  appearance: none;
  cursor: pointer;
  display: inline-flex;
  padding: 0;
  border: 1px solid var(--d-line);
  border-radius: var(--d-radius);
  background: transparent;
  overflow: hidden;
}

.theme-seg {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--d-ink-muted);
  transition: background-color 0.15s linear, color 0.15s linear;
}

.theme-seg + .theme-seg {
  border-left: 1px solid var(--d-line);
}

.theme-toggle:hover .theme-seg {
  color: var(--d-ink-secondary);
}

.theme-seg--active,
.theme-toggle:hover .theme-seg--active {
  background: var(--accent-orange);
  color: #1a1a1a;
}
</style>
