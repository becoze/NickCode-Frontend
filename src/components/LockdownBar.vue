<template>
  <!--
    Reusable, self-contained "lockdown zone" overlay.
    Purely decorative: pointer-events are disabled so it never blocks
    clicks, routing, or the host control underneath.
  -->
  <span
    class="lockdown-bar"
    role="presentation"
    :title="title"
    aria-hidden="true"
  >
    <span class="lockdown-bar__stripes" />
    <span v-if="label" class="lockdown-bar__label d-code">{{ label }}</span>
    <svg
      class="lockdown-bar__lock"
      viewBox="0 0 24 24"
      width="11"
      height="11"
      fill="none"
    >
      <rect x="4" y="10" width="16" height="11" rx="1" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  </span>
</template>

<script setup lang="ts">
import { withDefaults, defineProps } from "vue";

interface Props {
  /** Optional text rendered inside the bar (kept empty in tight spaces). */
  label?: string;
  /** Native tooltip describing why the target is locked. */
  title?: string;
}

withDefaults(defineProps<Props>(), {
  label: "",
  title: "LOGIN REQUIRED",
});
</script>

<style scoped>
.lockdown-bar {
  position: absolute;
  inset: -1px -6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  overflow: hidden;
  pointer-events: none; /* never intercept clicks / routing */
  /* Soft, low-opacity frame: present enough to read as a "bar" but not
     loud or attention-grabbing in either light or dark theme. */
  border-top: 1px solid rgba(255, 192, 30, 0.4);
  border-bottom: 1px solid rgba(255, 192, 30, 0.4);
  z-index: 2;
}

/* moving "///" hazard stripes — slow, low-opacity so text stays readable */
.lockdown-bar__stripes {
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    45deg,
    rgba(255, 192, 30, 0.32) 0,
    rgba(255, 192, 30, 0.32) 8px,
    rgba(255, 192, 30, 0) 8px,
    rgba(255, 192, 30, 0) 16px
  );
  /* tile = one horizontal repeat period (16px / cos45°) for a seamless loop */
  background-size: 22.627px 22.627px;
  animation: lockdown-slide 2.8s linear infinite;
}

@keyframes lockdown-slide {
  to {
    background-position: 22.627px 0;
  }
}

.lockdown-bar__label {
  position: relative;
  color: var(--accent-orange, #fa8500);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.lockdown-bar__lock {
  position: relative;
  stroke: var(--accent-orange, #fa8500);
  stroke-width: 2;
  flex: none;
}

@media (prefers-reduced-motion: reduce) {
  .lockdown-bar__stripes {
    animation: none;
  }
}
</style>
