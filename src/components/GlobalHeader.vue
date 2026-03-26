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

          <a-menu-item v-for="item in visibleRoutes" :key="item.path">
            {{ item.name }}
          </a-menu-item>
        </a-menu>
      </div>
    </a-col>

    <a-col flex="220px">
      <div class="user-area">
        <!-- not login -->
        <template v-if="!isLogin">
          <a-space>
            <a-button type="primary" @click="goToLogin">Sign in</a-button>
            <a-button type="text" @click="goToRegister">Sign up</a-button>
          </a-space>
        </template>

        <!-- logged in -->
        <template v-else>
          <a-space>
            <span class="user-name">{{ loginUserName }}</span>
            <a-button type="text" status="danger" @click="doLogout"
              >Logout
            </a-button>
          </a-space>
        </template>
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { routes } from "@/router/routes";
import checkAccess from "@/access/checkAccesss";
import message from "@arco-design/web-vue/es/message";
import { UserControllerService } from "../../generated";

const store = useStore();
const router = useRouter();

/**
 * Current login user from store
 */
const loginUser = computed(() => store.state.user?.loginUser || {});

/**
 * Whether user is logged in
 * Adjust this condition if your backend uses a different field to identify login status
 */
const isLogin = computed(() => {
  return !!loginUser.value?.id;
});

/**
 * Username display
 */
const loginUserName = computed(() => {
  return loginUser.value?.userName || "User";
});

/**
 * Click menu item
 */
const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};

/**
 * Header menu routes
 */
const visibleRoutes = computed(() => {
  return routes.filter((item) => {
    if (item.meta?.hideInMenu) {
      return false;
    }

    if (!checkAccess(loginUser.value, item.meta?.access as string)) {
      return false;
    }

    return true;
  });
});

/**
 * Current selected menu
 */
const selectedKeys = ref([router.currentRoute.value.path]);

router.afterEach((to) => {
  selectedKeys.value = [to.path];
});

/**
 * Init login user info when header mounted
 */
onMounted(async () => {
  await store.dispatch("user/getLoginUser");
});

/**
 * Redirect buttons
 */
const goToLogin = () => {
  router.push({
    path: "/user/login",
  });
};

const goToRegister = () => {
  router.push({
    path: "/user/register",
  });
};

/**
 * Logout
 */
const doLogout = async () => {
  const res = await UserControllerService.userLogoutUsingPost();

  if (res.code === 0) {
    message.success("Logout successful");
    await store.dispatch("user/getLoginUser");
    router.push({
      path: "/problem",
    });
    window.location.reload();
  } else {
    message.error("Logout failed: " + res.message);
  }
};
</script>

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

.user-area {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.user-name {
  color: #333;
  font-weight: 500;
}
</style>
