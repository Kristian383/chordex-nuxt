<template>
  <div class="form-wrapper">
    <div class="form-header">
      <ul class="tab-group">
        <li
          class="tab"
          :class="{ active: showLogin }"
          @click.prevent="openLoginForm"
        >
          <a href="">Log In</a>
        </li>
        <li
          class="tab"
          :class="{ active: !showLogin && !showReset }"
          @click.prevent="openRegisterForm"
        >
          <a href="">Sign Up</a>
        </li>
      </ul>
    </div>
    <div class="tab-content">
      <transition name="fade" tag="section" mode="out-in">
        <!-- login -->
        <div v-if="showLogin" id="login" key="login">
          <LoginForm
            :request-is-loading="reqIsLoading"
            @open-reset-form="openResetForm"
            @is-loading="setRequestLoading"
            :captchaToken="captchaToken"
          />
        </div>
        <!-- reset -->
        <div v-else-if="showReset" id="reset" key="reset">
          <ForgotForm
            :request-is-loading="reqIsLoading"
            @open-login="openLoginForm"
            @is-loading="setRequestLoading"
            :captchaToken="captchaToken"
          />
        </div>
        <!-- signup -->
        <div v-else id="signup" key="signup">
          <RegisterForm
            :request-is-loading="reqIsLoading"
            @is-loading="setRequestLoading"
            :captchaToken="captchaToken"
          />
        </div>
      </transition>
       <!-- NuxtTurnstile Captcha -->
        <!-- <NuxtTurnstile
          @error="onCaptchaError"
          @expired="onCaptchaExpired"
          v-model="captchaToken"
          ref="turnstile"
          class="chordex-turnstile"
        /> -->
      <div v-if="reqIsLoading" class="loader">
        <TheLoader />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent  } from 'vue';
import TheLoader from '~/components/ui/TheLoader.vue';
import LoginForm from '~/components/auth/LoginForm.vue';
const ForgotForm = defineAsyncComponent(() => import('~/components/auth/ForgotForm.vue'));
const RegisterForm = defineAsyncComponent(() => import('~/components/auth/RegisterForm.vue'));
// import ForgotForm from '~/components/auth/ForgotForm.vue';
// import RegisterForm from '~/components/auth/RegisterForm.vue';


const showLogin = ref(true);
const showReset = ref(false);
const reqIsLoading = ref(false);

const captchaToken = ref('');
const turnstile = ref();

function onCaptchaError(error: any) {
  console.error("Turnstile Error:", error);
  captchaToken.value = '';
}

function onCaptchaExpired() {
  console.warn("Turnstile token expired.");
  captchaToken.value = '';
}

function openRegisterForm() {
  showReset.value = false;
  showLogin.value = false;
}

function openLoginForm() {
  showLogin.value = true;
  showReset.value = false;
}

function openResetForm() {
  showLogin.value = false;
  showReset.value = true;
}

function setRequestLoading(status: boolean) {
  reqIsLoading.value = status;
}
</script>

<style lang="scss" scoped>
.form-wrapper {
  @include form-wrapper;
  .form-header {
    background: var(--dark_blue_sidebar);
    border-radius: 8px 8px 0 0;
    padding: 10px 17px;

    .tab-group {
      list-style: none;
      margin: 20px 5px;
      &:after {
        content: "";
        display: table;
        clear: both;
      }
      li a {
        display: block;
        text-decoration: none;
        padding: 15px;
        background: rgba(160, 179, 176, 0.25);

        color: var(--white);
        float: left;
        width: 50%;
        text-align: center;
        cursor: pointer;
        -webkit-transition: 0.3s ease;
        transition: 0.3s ease;
        &:hover {
          background: #b62730;
        }
      }
      .active a {
        background: var(--burgundy);
      }
    }
  }
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.6);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

/* loader */
.tab-content {
  position: relative;
}

.loader {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 50%;
}

.chordex-turnstile {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}
</style>
