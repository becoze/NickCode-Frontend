<template>
  <div class="userRegister">
    <h1 style="margin-bottom: 16px">Register</h1>
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
          placeholder="at least 4 character"
        />
      </a-form-item>

      <a-form-item
        field="userPassword"
        label="Password"
        :validate-status="passwordError ? 'error' : undefined"
        :help="passwordError ? 'Passwords do not match' : ''"
      >
        <a-input-password
          v-model="form.userPassword"
          placeholder="at least 8 character"
        />
      </a-form-item>

      <a-form-item
        field="checkPassword"
        label="Confirm Password"
        :validate-status="passwordError ? 'error' : undefined"
        :help="passwordError ? 'Passwords do not match' : ''"
      >
        <a-input-password
          v-model="form.checkPassword"
          placeholder="Confirm Password"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 120px"
          >Register
        </a-button>
      </a-form-item>
      <a-form-item>
        <a-button type="secondary" style="width: 140px" @click="goToHome">
          Back to Home
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { UserControllerService, UserRegisterRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

/**
 * Attributes to be submitted
 */
const form = reactive({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
} as UserRegisterRequest);

const passwordError = ref(false);
const router = useRouter();
const store = useStore();

/**
 * Submit
 * @param data
 */
const handleSubmit = async () => {
  passwordError.value = false;
  // check password match before calling API
  if (form.userPassword !== form.checkPassword) {
    passwordError.value = true;
    message.error("Password not match with confirm password");
    return;
  }

  // optional: simple empty check
  if (!form.userAccount || !form.userPassword || !form.checkPassword) {
    message.error("Please fill in all fields");
    return;
  }

  const res = await UserControllerService.userRegisterUsingPost(form);
  // redirect to Home page when success
  if (res.code === 0) {
    message.success("Register successful");
    await store.dispatch("user/getLoginUser");
    router.push({
      path: "/user/login",
      replace: true,
    });
  } else {
    message.error("Register fail " + res.message);
  }
};
const goToHome = () => {
  router.push({
    path: "/problems",
    replace: true,
  });
};
</script>
