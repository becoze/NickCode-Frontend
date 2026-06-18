<template>
  <div id="globalHeader">
    <div class="brand" @click="goToHome">
      <img class="logo" src="../assets/Stardew_Chicken.png" />
      <div class="brand-text">
        <span class="brand-name">NICKCODE_OJ</span>
        <span class="brand-tag d-code">ONLINE JUDGE // v1.2.2</span>
      </div>
    </div>

    <div class="nav">
      <a-menu
        mode="horizontal"
        :selected-keys="selectedKeys"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          <span
            class="menu-label"
            :class="{ 'menu-label--locked': isLocked(item) }"
          >
            {{ item.name }}
            <LockdownBar v-if="isLocked(item)" />
          </span>
        </a-menu-item>
      </a-menu>
    </div>

    <div class="user-area">
      <!-- theme toggle: flips attributes only, no remount / no data loss -->
      <ThemeToggle />

      <!-- not login -->
      <template v-if="!isLogin">
        <a-space :size="8">
          <span class="status-dot status-dot--idle" />
          <span class="d-code status-text">GUEST</span>
          <a-button type="primary" size="small" @click="goToLogin"
            >Sign in</a-button
          >
          <a-button type="text" size="small" @click="goToRegister"
            >Sign up</a-button
          >
        </a-space>
      </template>

      <!-- logged in -->
      <template v-else>
        <a-space :size="10">
          <span class="status-dot status-dot--live" />
          <span class="user-name">{{ loginUserName }}</span>
          <a-button type="text" size="small" status="danger" @click="doLogout"
            >Logout
          </a-button>
        </a-space>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { routes } from "@/router/routes";
import checkAccess from "@/access/checkAccesss";
import message from "@arco-design/web-vue/es/message";
import { UserControllerService } from "../../generated";
import ThemeToggle from "@/components/ThemeToggle.vue";
import LockdownBar from "@/components/LockdownBar.vue";
import type { RouteRecordRaw } from "vue-router";

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
  // Notify the visitor when the target page is locked behind login.
  // Navigation still proceeds; the route guard sends them to the login page.
  const target = routes.find((item) => item.path === key);
  if (target && isLocked(target)) {
    message.warning("Login required — please sign in to access this page");
  }
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
 * A menu item is "locked" when the route requires authentication
 * (meta.access is set) but the current visitor is not logged in.
 * Used only to render the decorative lockdown overlay; routing is
 * still enforced by the route guard in @/access.
 */
const isLocked = (item: RouteRecordRaw) => {
  return !!item.meta?.access && !isLogin.value;
};

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
const goToHome = () => {
  router.push({
    path: "/problems",
  });
};

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
#globalHeader {
  height: 100%;
  display: flex;
  align-items: center;
  gap: var(--d-space-5);
  padding: 0 var(--d-space-4);
}

/* ---- brand block ---- */
.brand {
  display: flex;
  align-items: center;
  gap: var(--d-space-3);
  cursor: pointer;
  padding-right: var(--d-space-5);
  border-right: 1px solid var(--d-line);
  height: 100%;
}

.logo {
  height: 30px;
  width: 30px;
  object-fit: contain;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.brand-name {
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--d-ink);
}

.brand-tag {
  font-size: 10px;
  letter-spacing: 0.1em;
}

/* ---- nav ---- */
.nav {
  flex: 1;
  min-width: 0;
}

#globalHeader :deep(.arco-menu-horizontal) {
  background: transparent;
  line-height: 54px;
}

#globalHeader :deep(.arco-menu-horizontal .arco-menu-item) {
  font-size: 13px;
  letter-spacing: 0.04em;
  color: var(--d-ink-secondary);
}

#globalHeader :deep(.arco-menu-horizontal .arco-menu-selected) {
  color: var(--d-ink);
}

/* anchor for the lockdown overlay; keeps the label text readable underneath */
.menu-label {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.menu-label--locked {
  color: var(--d-ink-secondary);
}

/* ---- user area ---- */
.user-area {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--d-space-4);
}

.user-name {
  color: var(--d-ink);
  font-weight: 500;
  font-size: 13px;
}

.status-text {
  letter-spacing: 0.1em;
}

.status-dot {
  width: 7px;
  height: 7px;
  display: inline-block;
  border-radius: 50%;
}

.status-dot--live {
  background: var(--accent-green);
  box-shadow: 0 0 6px var(--accent-green);
}

.status-dot--idle {
  background: var(--d-ink-muted);
}
</style>
