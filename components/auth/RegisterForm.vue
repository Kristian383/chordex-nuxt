<template>
  <form>
    <div class="form-container">
      <h3>Sign Up</h3>
      <div class="input-group">
        <span>
          <client-only>
            <font-awesome-icon icon="user-alt"></font-awesome-icon>
          </client-only>
        </span>
        <input
          v-model.trim="userName"
          type="text"
          class="form-control"
          placeholder="User Name"
          required
          :class="{ 'error-msg': !formIsValid }"
          @focus="clearValidity"
        />
      </div>

      <div class="input-group">
        <span>
          <client-only>
            <font-awesome-icon icon="envelope"></font-awesome-icon>
          </client-only>
        </span>
        <input
          v-model.trim="userEmail"
          type="email"
          class="form-control"
          placeholder="Email Address"
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
            <font-awesome-icon :icon="lockType" @click="togglePassword"></font-awesome-icon>
          </client-only>
        </span>
        <input
          v-model.trim="userPassword"
          :type="pswdType"
          class="form-control"
          placeholder="Set Password"
          required
          :class="{ 'error-msg': !formIsValid }"
          @focus="clearValidity"
        />
      </div>
      <p v-if="errorText" class="feedback-text" :class="{ valid: goodRequest }">
        {{ errorText }}
      </p>
      <!-- <re-captcha @recaptcha-check="setReCaptchaValidity"></re-captcha> -->
    </div>
    <div class="form-footer">
      <button :disabled="requestIsLoading" class="btn" @click.prevent="submitForm">
        Sign Up
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useUIStore } from "~/stores/ui";
// import ReCaptcha from "./../ReCaptcha.vue"; // TODO: implement captcha

interface Props {
  requestIsLoading: boolean;
}

const { requestIsLoading } = defineProps<Props>();

defineEmits(["isLoading"]);

const userEmail = ref("");
const userName = ref("");
const userPassword = ref("");
const errorText = ref("");
const goodRequest = ref(false);
const formIsValid = ref(true);
const recaptchaIsValid = ref(false);

const showPswd = ref(false);
const lockType = computed(() => (showPswd.value ? "lock-open" : "lock"));
const pswdType = computed(() => (showPswd.value ? "text" : "password"));

const router = useRouter();
const authStore = useAuthStore();
const uiStore = useUIStore();

function clearValidity() {
  formIsValid.value = true;
  errorText.value = "";
}

function togglePassword() {
  showPswd.value = !showPswd.value;
}

function setReCaptchaValidity(validity: boolean) {
  recaptchaIsValid.value = validity;
}

function validateForm() {
  if (!userEmail.value || !userName.value || !userPassword.value) {
    errorText.value = "All fields are required.";
    return false;
  }
  if (!userEmail.value.includes("@")) {
    errorText.value = "Invalid email address.";
    return false;
  }
  if (userName.value.length < 3) {
    errorText.value = "Username must have at least 3 characters.";
    return false;
  }
  if (userPassword.value.length < 6) {
    errorText.value = "Password must have at least 6 characters.";
    return false;
  }
  if (!recaptchaIsValid.value) {
    errorText.value = "Please complete the reCAPTCHA.";
    return false;
  }
  return true;
}


const submitForm = async (): Promise<void> => {
  formIsValid.value = true;
  errorText.value = "";
  goodRequest.value = false;
  emit("isLoading", true);

  formIsValid.value = validateForm();

  const payload = {
    user: {
      email: userEmail.value,
      password: userPassword.value,
      username: userName.value,
    },
    mode: "signup",
  };

  const response = await authStore.auth(payload);
  if (authStore.getters.token) {
      router.push("/songs");
      uiStore.activateSidebar();
      errorText.value = "Successfully registered.";
      goodRequest.value = true;
    } else {
      userName.value = "";
      userEmail.value = "";
      errorText.value = res;
    }

  // authStore.dispatch("auth", payload).then((res) => {
  //   if (authStore.getters.token) {
  //     router.push("/songs");
  //     uiStore.activateSidebar();
  //     errorText.value = "Successfully registered.";
  //     goodRequest.value = true;
  //   } else {
  //     userName.value = "";
  //     userEmail.value = "";
  //     errorText.value = res;
  //   }
    emit("isLoading", false);
};

</script>

<style lang="scss" scoped>
.form-container {
  background: #fefefe;
  padding: 1.5625rem 1.875rem 5.625rem;
  position: relative;


  .input-group {
    @include input-group;
  }
  .feedback-text {
    @include feedback-text;
  }
  .feedback-text.valid {
    color: var(--green);
  }
}

.form-footer {
  @include form-footer;
}
</style>