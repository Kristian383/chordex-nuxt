<template>
  <form>
    <div class="form-container">
      <h3>Log In</h3>
      <section>
        <div class="input-group">
          <span>
            <ClientOnly>
              <font-awesome-icon icon="envelope"></font-awesome-icon>
            </ClientOnly>
          </span>
          <input
            v-model.trim="userEmail"
            type="email"
            class="form-control"
            placeholder="Email address"
            required
            :class="{ 'error-msg': !formIsValid }"
            @focus="clearValidity"
          />
        </div>

        <div class="input-group">
          <span
            class="icon"
          >
          <ClientOnly >
            <font-awesome-icon
              :icon="lockType"
              @click="togglePassword"
            >
            </font-awesome-icon>
          </ClientOnly>
          </span>
          <input
            v-model.trim="userPassword"
            :type="pswdType"
            required
            class="form-control"
            placeholder="Password"
            :class="{ 'error-msg': !formIsValid }"
            @focus="clearValidity"
          />
        </div>
        <div class="auth-btn-container">
          <google-btn @click="googleAuth"></google-btn>
        </div>
      </section>
      <p class="forgot" @click="openResetForm">Forgot password?</p>
      <p v-if="errorText" class="feedback-text" :class="{ valid: goodRequest }">
        {{ errorText }}
      </p>
    </div>
    <div class="form-footer">
      <button class="btn" :disabled="requestIsLoading" @click.prevent="submitForm">
        Log In
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, PropType } from "vue";
import GoogleBtn from "./GoogleBtn.vue";
import { useAuthStore } from "~/stores/auth";
import { useUIStore } from "~/stores/ui";
interface Props {
  requestIsLoading: boolean;
}

const { requestIsLoading } = defineProps<Props>();

// Define emits
const emit = defineEmits<{
  (e: "openResetForm"): void;
  (e: "isLoading", status: boolean): void;
}>();

const userEmail = ref<string>("");
const userPassword = ref<string>("");
const errorText = ref<string>("");
const goodRequest = ref<boolean>(false);
const formIsValid = ref<boolean>(true);
const showPswd = ref<boolean>(false);

const authStore = useAuthStore();
const uiStore = useUIStore();

const openResetForm = (): void => {
  emit("openResetForm");
};

const clearValidity = (): void => {
  formIsValid.value = true;
  errorText.value = "";
};

const togglePassword = (): void => {
  showPswd.value = !showPswd.value;
};

const lockType = computed<string>(() => (showPswd.value ? "lock-open" : "lock"));
const pswdType = computed<string>(() => (showPswd.value ? "text" : "password"));

const googleAuth = async (): Promise<void> => {
  emit("isLoading", true);

  const googleResponse = await authStore.signInWithGoogle(); // Replace with your Pinia action
  if (!googleResponse.google_token) {
    errorText.value = googleResponse.msg;
    emit("isLoading", false);
    return;
  }

  const backendResponse = await authStore.firebaseBackendCall(googleResponse.google_token);
  if (backendResponse.success) {
    emit("isLoading", false);

    navigateTo("/songs");
    uiStore.activateSidebar();
  } else {
    errorText.value = backendResponse.message;
    emit("isLoading", false);
  }
};

const submitForm = async (): Promise<void> => {
  formIsValid.value = true;
  errorText.value = "";
  goodRequest.value = false;
  emit("isLoading", true);

  if (!userEmail.value || !userPassword.value || !userEmail.value.includes("@")) {
    formIsValid.value = false;
    emit("isLoading", false);
    return;
  }

  const payload = {
    user: {
      email: userEmail.value,
      password: userPassword.value,
    },
    mode: "login",
  };

  const response = await authStore.auth(payload);
  if (authStore.token) {
    navigateTo("/songs"); 
    uiStore.activateSidebar();
  } else {
    formIsValid.value = false;
    errorText.value = response;
  }

  emit("isLoading", false);
};
</script>


<style lang="scss" scoped>
// @import "@/assets/styles/mixins.scss";
// @import "@/assets/styles/colors.scss";
// @import "@/assets/styles/auth.scss";

.form-container {
  background: #fefefe;
  padding: 25px 30px 12px 30px;
  .input-group {
    @include input-group;
  }
  .forgot {
    text-align: right;
    margin-top: 12px;
    cursor: pointer;
    font-size: 14px;
    a {
      color: inherit;
      text-decoration: none;
    }
  }
  .feedback-text {
    @include feedback-text;
  }
  .feedback-text.valid {
    color: var(--green);
  }
}

form .loader {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 50%;
}

.form-footer {
  @include form-footer;
}
</style>