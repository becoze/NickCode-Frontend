<template>
  <div id="userLayout">
    <div class="auth-topbar">
      <ThemeToggle />
    </div>
    <div class="auth-shell">
      <div class="auth-brand">
        <img class="logo" src="../assets/Stardew_Chicken.png" />
        <div class="auth-brand-text">
          <span class="auth-name">NICKCODE_OJ</span>
          <span class="d-code auth-sub">ACCESS TERMINAL // AUTH-01</span>
        </div>
      </div>

      <div class="auth-panel d-panel d-reg">
        <router-view />
      </div>

      <a
        class="auth-footer d-code"
        href="https://becoze.github.io/wiki"
        target="_blank"
      >
        NICKCODE // SECURE SESSION
      </a>
    </div>
  </div>
</template>

<style scoped>
#userLayout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--d-space-5);
}

.auth-topbar {
  position: fixed;
  top: var(--d-space-4);
  right: var(--d-space-4);
  z-index: 10;
}

.auth-shell {
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--d-space-5);
}

.auth-brand {
  display: flex;
  align-items: center;
  gap: var(--d-space-3);
}

.logo {
  height: 36px;
  width: 36px;
  object-fit: contain;
}

.auth-brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
  text-align: left;
}

.auth-name {
  font-family: var(--font-mono);
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--d-ink);
}

.auth-sub {
  font-size: 11px;
  letter-spacing: 0.1em;
}

.auth-panel {
  width: 100%;
  padding: var(--d-space-6) var(--d-space-6) var(--d-space-5);
}

.auth-footer {
  letter-spacing: 0.14em;
  color: var(--d-ink-muted);
  text-decoration: none;
}

.auth-footer:hover {
  color: var(--accent-orange);
}
</style>
<script setup lang="ts">
import ThemeToggle from "@/components/ThemeToggle.vue";
</script>
