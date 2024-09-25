<template>
  <div id="basiclayout">
    <a-layout style="height: 400px">
      <a-layout-header class="header">
        <GlobalHalder />
      </a-layout-header>

      <a-layout-content class="content">
        <router-view />
      </a-layout-content>

      <a-layout-footer class="footer">
        <a href="https://becoze.github.io/wiki" target="_blank"> Becoze </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#basiclayout {
}

#basiclayout .header {
  background: #42b983;
  margin-bottom: 16px;
}

#basiclayout .content {
  background: linear-gradient(to right, #eee, #fff);
  margin-bottom: 16px;
}

#basiclayout .footer {
  background: #efefef;
  padding: 16px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
<script setup lang="ts">
import GlobalHalder from "@/components/GlobalHalder.vue";
</script>
