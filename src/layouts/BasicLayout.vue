<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
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
#basicLayout {
}

#basiclayout .header {
  background: #42b983;
  box-shadow: #eee 1px 1px 5px;
}

#basiclayout .content {
  background: linear-gradient(to right, #eee, #fff);
  margin-bottom: 16px;
  padding: 16px;
}

#basiclayout .footer {
  background: #efefef;
  padding: 16px;
  position: sticky;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
<script>
import GlobalHeader from "@/components/GlobalHeader.vue";

export default {
  components: { GlobalHeader },
};
</script>
