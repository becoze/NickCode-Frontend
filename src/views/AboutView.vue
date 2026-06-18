<template>
  <div class="about">
    <section class="d-panel d-reg about-card">
      <header class="d-panel__head">
        <div class="d-panel__title">
          <span class="d-label">System Info</span>
          <span class="d-code">DOC // ABOUT-01</span>
        </div>
        <span class="d-code">v1.2.2</span>
      </header>
      <div class="d-panel__body">
        <dl class="meta-grid">
          <dt class="d-label">Project</dt>
          <dd class="d-code">NICKCODE OJ — Online Judge</dd>
          <dt class="d-label">Stack</dt>
          <dd class="d-code">Vue 3 // Arco Design // Monaco</dd>
          <dt class="d-label">Status</dt>
          <dd class="d-code status-ok">SYSTEM ONLINE</dd>
        </dl>
        <a-button type="outline" @click="openRepo">Open Repository</a-button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const openRepo = () => window.open("https://becoze.github.io/wiki", "_blank");
</script>

<style scoped>
.about {
  max-width: 720px;
  margin: 0 auto;
}

.meta-grid {
  display: grid;
  grid-template-columns: 140px 1fr;
  row-gap: var(--d-space-3);
  column-gap: var(--d-space-4);
  margin: 0 0 var(--d-space-5);
}

.meta-grid dt {
  align-self: center;
}

.meta-grid dd {
  margin: 0;
  align-self: center;
  color: var(--d-ink);
}

.status-ok {
  color: var(--accent-green) !important;
}
</style>
