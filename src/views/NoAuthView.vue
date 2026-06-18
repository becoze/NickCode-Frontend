<template>
  <div class="noAuth">
    <section class="d-panel d-reg status-card">
      <div class="status-code">403</div>
      <span class="d-kicker">ACCESS DENIED</span>
      <p class="status-msg">You do not have clearance to view this resource.</p>
      <a-button type="primary" @click="goProblems"
        >Return to Problem Set</a-button
      >
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const goProblems = () => router.push({ path: "/problems" });
</script>

<style scoped>
.noAuth {
  display: flex;
  justify-content: center;
  padding: var(--d-space-8, 64px) var(--d-space-4);
}

.status-card {
  width: 100%;
  max-width: 440px;
  padding: var(--d-space-6) var(--d-space-6) var(--d-space-5);
  text-align: center;
}

.status-code {
  font-family: var(--font-mono);
  font-size: 48px;
  font-weight: 500;
  color: var(--accent-orange);
  letter-spacing: 0.04em;
}

.status-msg {
  color: var(--d-ink-secondary);
  margin: var(--d-space-2) 0 var(--d-space-5);
}
</style>
