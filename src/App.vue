<template>
  <div id="app">
    <BasicLayout />
  </div>
</template>

<style>
#app {
}
</style>

<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout.vue";
import { onMounted } from "vue";

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
