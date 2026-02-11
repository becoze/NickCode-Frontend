<template>
  <div id="app">
    <a-config-provider :locale="enUS">
      <template v-if="route.path.startsWith('/user')">
        <router-view />
      </template>
      <template v-else>
        <BasicLayout />
      </template>
    </a-config-provider>
  </div>
</template>

<style>
#app {
}
</style>
<script setup lang="ts">
import enUS from "@arco-design/web-vue/es/locale/lang/en-us";
import BasicLayout from "@/layouts/BasicLayout.vue";
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
/**
 * Global initialization method (suitable for one times code/method)
 */
const doInit = () => {
  console.log("HelloWorld");
};

onMounted(() => {
  doInit();
});
</script>
