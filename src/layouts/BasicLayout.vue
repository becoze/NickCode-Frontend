<template>
  <div class="basiclayout">
    <a-layout style="height: 400px">
      <a-layout-header class="header">OJ</a-layout-header>

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
  background: linear-gradient(to right, #aaa, #fff);
  margin-bottom: 16px;
}

#basiclayout .footer {
  background: #efefef;
}
</style>
<script setup lang="ts"></script>
