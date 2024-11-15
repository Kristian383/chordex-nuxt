<template>
  <header :class="{ 'scrolled-nav': scrolledNav }">
    <nav class="container">
      <span v-if="!hideLogo" class="logo">
        <NuxtLink to="/">
          <img src="~/assets/img/guitar.webp" alt="Guitar" title="Chordex Music" />
        </NuxtLink>
      </span>
      <div class="title"><h2>Chord<span style="color: var(--burgundy)">Ex</span> Music</h2></div>
      <ul class="navigation">
        <li>
          <NuxtLink class="link" active-class="active" to="/">
            Home
          </NuxtLink>
        </li>
        <li 
        :class="{
          pulsing: isNotChordex,
          'chordex-header-li': true
        }"
        >
          <NuxtLink
            class="link"
            :class="{ not_logged: isLogged }"
            active-class="active"
            to="/chordex"
          >
            ChordEx
          </NuxtLink>
        </li>
        <li>
          <NuxtLink class="link" active-class="active" to="/about">
            About
          </NuxtLink>
        </li>
        <li>
          <NuxtLink class="link" active-class="active" to="/metronome">
            Metronome
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
// import { useStore } from "vuex";
import { useRoute } from 'vue-router';

const route = useRoute();

// const store = useStore();

const scrolledNav = ref(false);  // TypeScript infers this as a boolean
const hideLogo = ref(false);     // TypeScript infers this as a boolean
const windowWidth = ref(0);      // Default as 0, to be set on the client side

const isLogged = computed(() => {
  // return !store.getters.token; TODO: replace with PINIA
  return false;
});

const isNotChordex = computed(() => route.path !== '/chordex');

const checkScreen = () => {
  if (process.client) {
    windowWidth.value = window.innerWidth;
    if (windowWidth.value <= 900) {
      // store.commit("setMobile", true);
      hideLogo.value = true;
    } else {
      // store.commit("setMobile", false);
      hideLogo.value = false;
    }
  }
};

const updateScroll = () => {
  if (process.client) {
    const scrollPosition = window.scrollY;
    if (scrollPosition >= 50) {
      scrolledNav.value = true;
    } else {
      scrolledNav.value = false;
    }
  }
};

onMounted(() => {
  if (process.client) {
    window.addEventListener("resize", checkScreen);
    window.addEventListener("scroll", updateScroll);
    checkScreen();
  }
});

onBeforeUnmount(() => {
  if (process.client) {
    window.removeEventListener("resize", checkScreen);
    window.removeEventListener("scroll", updateScroll);
  }
});
</script>



<style lang="scss" scoped>
.pulsing {
  animation: pulse-shadow 1.5s infinite ease-in-out;
}

@keyframes pulse-shadow {
  0% {
    box-shadow: 0 0 4px 1px rgba(194, 42, 42, 0.4); /* Slightly bigger initial shadow */
  }
  50% {
    box-shadow: 0 0 8px 3px rgba(194, 42, 42, 0.5); /* Slightly bigger, but still subtle shadow */
  }
  100% {
    box-shadow: 0 0 4px 1px rgba(194, 42, 42, 0.4); /* Back to slightly bigger shadow */
  }
}



header {
  background-color: var(--white);
  z-index: 70;
  width: 100%;
  transition: 0.5s ease all;
  position: sticky;
  top: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
header nav {
  display: flex;
  flex-direction: column;
  padding: 0.75rem 0;
  transition: 0.5s ease all;
  margin: 0 auto;
  width: 100%;
  position: relative;
}

header .navigation {
  display: flex;
  align-items: center;
  flex: 1;
  overflow-x: auto;
  .pulsing {
    background: var(--burgundy);
    border-radius: 25rem;

    .link {
      color: var(--white);
    }
  }
}
header .navigation::-webkit-scrollbar {
  display: none;
}
/*  */
@media (min-width: 71.25rem) {
  header nav {
    max-width: 1140px;
  }
}

@media (min-width: 40rem) {
  header nav {
    flex-direction: row;
    width: 90%;
  }

  .title {
    padding-left: 1.5625rem;
  }
  header .navigation {
    justify-content: flex-end;
  }
}

.title {
  align-self: center;
}

header nav ul,
header nav .link {
  color: #000;
  font-weight: 600;
  list-style: none;
  text-decoration: none;
}
header nav li {
  text-transform: uppercase;
  padding: 0.5rem;
  margin-left: 1rem;
  user-select: none;
}
header nav .link {
  font-size: 1rem;
  transition: 0.5s ease all;
  padding-bottom: 0.25rem;
  border-bottom: 0.25rem solid transparent;
}
header nav .link:hover {
  color: #d8323c;
}
header nav .link.not_logged {
  color: var(--mid_gray);
  pointer-events: none;
}
header nav .link.active {
  border-color: #d8323c;
}
header nav .logo {
  display: flex;
  align-items: center;
}
header nav .logo img {
  width: 3.125rem;
  height: 3.125rem;
  transition: 0.5s ease all;
}
.scrolled-nav nav {
  padding: 0.5rem 0;
}
.scrolled-nav nav .logo img {
  width: 2.5rem;
}
.mobile-nav-enter-active,
.mobile-nav-leave-active {
  transition: 1s ease all;
}
.mobile-nav-enter-from,
.mobile-nav-leave-to {
  transform: translateX(-250px);
}
.mobile-nav-enter-to {
  transform: translateX(0);
}
</style>