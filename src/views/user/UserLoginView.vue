<template>
  <div class="userLogin">
    <h1 style="margin-bottom: 16px">Login</h1>
    <a-form
      auto-label-width
      label-align="left"
      :model="form"
      style="max-width: 480px; margin: 0 auto"
      @submit="handleSubmit"
    >
      <a-form-item field="userAccount" label="User account">
        <a-input
          v-model="form.userAccount"
          placeholder="please enter your User account..."
        />
      </a-form-item>
      <a-form-item
        field="userPassword"
        label="Password"
        tooltip="Password at least 8 characters"
      >
        <a-input-password
          v-model="form.userPassword"
          placeholder="please enter your Password..."
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 120px"
          >Login</a-button
        >
      </a-form-item>
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
    await store.dispatch("user/getLoginUser");
    router.push({
      path: "/",
      replace: true,
    });
  } else {
    message.error("Login fail" + res.message);
  }
  alert(JSON.stringify(form));
};
</script>
