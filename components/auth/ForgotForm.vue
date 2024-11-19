<template>
  <form>
    <div class="form-container">
      <h3>Reset Password</h3>
      <div class="input-group">
        <span>
          <client-only>
            <font-awesome-icon icon="envelope"></font-awesome-icon>
          </client-only>
        </span>
        <input
          type="email"
          class="form-control"
          placeholder="Email Address"
          required
          v-model.trim="userEmail"
          :class="{ 'error-msg': !formIsValid }"
          @focus="clearValidity"
        />
      </div>
      <p class="forgot" @click="openLoginForm">Back to Log In</p>
      <p class="feedback-text" :class="{ valid: goodRequest }" v-if="errorText">
        {{ errorText }}
      </p>
    </div>

    <div class="form-footer">
      <button @click.prevent="submitForm" class="btn" :disabled="requestIsLoading">
        Send
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "~/stores/auth";

interface Props {
  requestIsLoading: boolean;
}

const { requestIsLoading } = defineProps<Props>();

const emit = defineEmits<{
  (event: "isLoading", value: boolean): void;
  (event: "openLogin"): void;
}>();

const userEmail = ref("");
const formIsValid = ref(true);
const errorText = ref("");
const goodRequest = ref(false);

const authStore = useAuthStore();

async function submitForm() {
  formIsValid.value = true;
  errorText.value = "";
  goodRequest.value = false;
  emit("isLoading", true);

  if (!userEmail.value || !userEmail.value.includes("@")) {
    formIsValid.value = false;
    emit("isLoading", false);
    return;
  }

  try {
    const res = await authStore.dispatch("forgotPassword", userEmail.value);

    if (res === true) {
      errorText.value =
        "We received your request. Please check your email (and spam folder).";
      goodRequest.value = true;
    } else if (!res) {
      errorText.value = "User with that email doesn't exist.";
    } else {
      errorText.value = "Something went wrong. Please let us know.";
    }
  } catch (error) {
    errorText.value = "An unexpected error occurred.";
    console.error(error);
  } finally {
    emit("isLoading", false);
    userEmail.value = "";
  }
}

function clearValidity() {
  formIsValid.value = true;
}

function openLoginForm() {
  emit("openLogin");
}
</script>

<style lang="scss" scoped>
.form-container {
  background: #fefefe;
  padding: 25px 30px 12px 30px;
  .input-group {
    @include input-group;
  }
  .feedback-text {
    @include feedback-text;
  }
  .feedback-text.valid {
    color: var(--green);
  }
  .forgot {
    text-align: right;
    margin-top: 12px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 14px;
    a {
      color: inherit;
      text-decoration: none;
    }
  }
}

.form-footer {
  @include form-footer;
}
</style>