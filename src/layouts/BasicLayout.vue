<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>

      <a-layout-content class="content">
        <div class="content-inner">
          <router-view />
        </div>
      </a-layout-content>

      <a-layout-footer class="footer">
        <div class="footer-inner">
          <span class="d-code footer-meta">NICKCODE-OJ // SYS-ONLINE</span>
          <a
            class="footer-link"
            href="https://becoze.github.io/wiki"
            target="_blank"
          >
            NICKCODE
          </a>
          <span class="d-code footer-meta">v1.2.2</span>
        </div>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#basicLayout :deep(.arco-layout) {
  background: transparent;
}

#basicLayout .header {
  height: 56px;
  padding: 0;
  background: var(--d-surface);
  border-bottom: 1px solid var(--d-line);
  position: sticky;
  top: 0;
  z-index: 100;
}

#basicLayout .content {
  padding: var(--d-space-5) var(--d-space-4);
}

.content-inner {
  max-width: 1280px;
  margin: 0 auto;
}

#basicLayout .footer {
  padding: 0;
  border-top: 1px solid var(--d-line);
  background: var(--d-surface);
}

.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--d-space-3) var(--d-space-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--d-space-4);
}

.footer-meta {
  white-space: nowrap;
}

.footer-link {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.14em;
  color: var(--accent-orange);
  text-decoration: none;
}

.footer-link:hover {
  color: var(--accent-orange-alt);
}
</style>
<script>
import GlobalHeader from "@/components/GlobalHeader.vue";

export default {
  components: { GlobalHeader },
};
</script>
