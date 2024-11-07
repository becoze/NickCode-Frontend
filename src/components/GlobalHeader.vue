<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="auto">
      <div id="globalHeader">
        <a-menu
          mode="horizontal"
          :selected-keys="selectedKeys"
          @menu-item-click="doMenuClick"
        >
          <a-menu-item
            key="0"
            :style="{ padding: 0, marginRight: '38px' }"
            disabled
          >
            <div class="title-bar">
              <img class="logo" src="../assets/Stardew_Chicken.png" />
              <div class="title">Becoze OJ</div>
            </div>
          </a-menu-item>
          <a-menu-item v-for="item in visibleRoutes" :key="item.path"
            >{{ item.name }}
          </a-menu-item>
        </a-menu>
      </div>
    </a-col>
    <a-col flex="100px">
      <div>{{ store.state.user?.loginUser?.userName ?? "Not Login" }}</div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { routes } from "@/router/routes";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccesss";
import ACCESS_ENUM from "@/access/accessEnum";

const store = useStore();
const router = useRouter();

const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};

/**
 * Filter what routes/pages to display
 */
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }

    if (!checkAccess(store.state.user.loginUser, item.meta?.access as string)) {
      return false;
    }
    return true;
  });
});

/**
 * Set default redirect page as homepage, and remember current page after each page route, for use stay current page after refresh
 */
const selectedKeys = ref(["/"]);
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});

console.log(store.state.user.loginUser);

/**
 * TEST user.ts action getLoginUser()
 */
// setTimeout(() => {
//   store.dispatch("user/getLoginUser", {
//     userName: "Nick",
//     userRole: ACCESS_ENUM.ADMIN,
//   });
// }, 3000);
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.logo {
  height: 35px;
}

.title {
  color: #444;
  margin-left: 15px;
  font-size: 20px;
  font-weight: bold;
}
</style>
