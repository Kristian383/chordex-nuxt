<template>
  <form>
    <div class="form-container">
      <h3>Log In</h3>
      <section>
        <div class="input-group">
          <span>
            <client-only>
              <font-awesome-icon icon="envelope"></font-awesome-icon>
            </client-only>
          </span>
          <input
            v-model.trim="userEmail"
            autocomplete="email"
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
          <client-only>
            <font-awesome-icon
              :icon="lockType"
              @click="togglePassword"
            >
            </font-awesome-icon>
          </client-only>
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
            <google-btn @click="handleGoogleSignIn"></google-btn>
        </div>
      </section>
      <p class="forgot" @click="openResetForm">Forgot password?</p>
      <p  class="feedback-text" :class="{ valid: goodRequest }">
        {{ errorText }}
      </p>
    </div>
    <div class="form-footer">
      <button class="btn" :disabled="requestIsLoading" @click.prevent="handleLogin">
        Log In
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import GoogleBtn from "./GoogleBtn.vue";
import { useAuthStore } from "~/stores/auth";
import { useUIStore } from "~/stores/ui";
import { useGoogleAuth } from "~/composables/useGoogleAuth";
import { useFirebaseBackendAuth } from "~/composables/useFirebaseBackendAuth";
// import { useTurnstile } from '~/composables/useTurnstile';

interface Props {
  requestIsLoading: boolean;
  captchaToken?: string,
}

const { requestIsLoading } = defineProps<Props>();
const { signInWithGoogle } = useGoogleAuth();
const { firebaseBackendAuth } = useFirebaseBackendAuth();

// const { verifyTurnstile } = useTurnstile();

// Define emits
const emit = defineEmits<{
  (e: "openResetForm"): void;
  (e: "is-loading", status: boolean): void;
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

const handleLogin = async (): Promise<void> => {
  // TODO: Uncomment this when Turnstile is enabled
  // if (!captchaToken) {
  //    formIsValid.value = false;
  //    errorText.value = "Captcha verification failed. Please try again.";
  //     return;
  // }

  // const isValidTurnstile = await verifyTurnstile(captchaToken);
  // if (!isValidTurnstile) {
  //   formIsValid.value = false;
  //    errorText.value = "Captcha verification failed. Please try again.";
  //   return;
  // }

  formIsValid.value = true;
  errorText.value = "";
  goodRequest.value = false;
  emit("is-loading", true);

  if (!userEmail.value || !userPassword.value || !userEmail.value.includes("@")) {
    formIsValid.value = false;
    emit("is-loading", false);
    errorText.value = "Please enter a valid email and password.";
    return;
  }

  const payload = {
    user: {
      email: userEmail.value,
      password: userPassword.value,
    },
    mode: "login",
  };

  try {
    const response = await authStore.authenticateUser(payload);
    if (response.success) {
      navigateTo("/songs"); 
      uiStore.activateSidebar();
    } else {
      formIsValid.value = false;
      errorText.value = response.message;;
    }
    } catch (error) {
      console.error("Error during authentication:", error);
      formIsValid.value = false;
      errorText.value = "An unexpected error occurred. Please try again.";
    } finally {
      emit("is-loading", false);
    }
};

const handleGoogleSignIn = async () => {
  try {
    emit("is-loading", true);
    const { google_token, msg } = await signInWithGoogle();

    // If there's no Google token, handle the error
    if (!google_token) {
      errorText.value = msg || "Google sign-in failed.";
      console.error("Sign-in failed:", msg || "No Google token received.");
      return;
    }

    // Authenticate with the backend using the Google token
    const backendResponse = await firebaseBackendAuth(google_token);
    const { success, message } = backendResponse;

    // Handle backend authentication response
    if (success) {
      navigateTo("/songs");
      uiStore.activateSidebar();
    } else {
      errorText.value = message || "Backend authentication failed.";
      console.error("Backend sign-in failed:", message || "Unknown error.");
    }
  } catch (error) {
    errorText.value = "An unexpected error occurred.";
    console.error("An unexpected error occurred during sign-in:", error);
  } finally {
    emit("is-loading", false);
  }
};
</script>

<style lang="scss" scoped>
.form-container {
  background: #fefefe;
  min-height: 290px;
  padding: 1.25rem 1.25rem;
  
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