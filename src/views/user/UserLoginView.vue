<template>
  <div class="userLogin">
    <div class="form-head">
      <span class="d-kicker">SESSION // SIGN-IN</span>
      <h1 class="form-title">Login</h1>
    </div>
    <a-form
      auto-label-width
      label-align="left"
      :model="form"
      @submit="handleSubmit"
    >
      <a-form-item field="userAccount" label="User account">
        <a-input v-model="form.userAccount" placeholder="User name" />
      </a-form-item>
      <a-form-item field="userPassword" label="Password">
        <a-input-password v-model="form.userPassword" placeholder="Password" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" long>Login </a-button>
      </a-form-item>
      <a-form-item>
        <a-button type="secondary" long @click="redirectHome">
          Back to Home
        </a-button>
      </a-form-item>
      <div class="form-switch">
        <span>No account yet?</span>
        <a-link @click="goToRegister">Create one</a-link>
      </div>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService, UserLoginRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

/**
 * Attributes to be submitted
 */
const form = reactive({
  userAccount: "",
  userPassword: "",
} as UserLoginRequest);

const router = useRouter();
const store = useStore();

/**
 * Submit
 * @param data
 */
const handleSubmit = async () => {
  const res = await UserControllerService.userLoginUsingPost(form);
  // redirect to Home page when success
  if (res.code === 0) {
    message.success("Login successful");
    await store.dispatch("user/getLoginUser");
    router.push({
      path: "/problems",
      replace: true,
    });
  } else {
    message.error("Login fail " + res.message);
  }
};
const redirectHome = () => {
  router.push({
    path: "/problems",
    replace: true,
  });
};
const goToRegister = () => {
  router.push({
    path: "/user/register",
  });
};
</script>

<style scoped>
.form-head {
  margin-bottom: var(--d-space-5);
}

.form-title {
  margin: var(--d-space-1) 0 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--d-ink);
}

.form-switch {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--d-space-2);
  margin-top: var(--d-space-3);
  font-size: 13px;
  color: var(--d-ink-muted);
}
</style>
