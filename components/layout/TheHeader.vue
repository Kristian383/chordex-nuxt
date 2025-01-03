<template>
  <header :class="{ 'scrolled-nav': scrolledNav }">
    <nav class="header-container">
      <span v-if="!hideLogo" class="logo">
        <NuxtLink to="/">
          <img width="50" height="50" src="~/assets/img/guitar.webp" alt="Guitar" title="Chordex Music" >
        </NuxtLink>
      </span>
      <div class="title"><h2>Chord<span style="color: var(--burgundy)">Ex</span> Music</h2></div>
      <ul class="navigation">
        <li>
          <NuxtLink class="link" active-class="active" to="/">
            Home
          </NuxtLink>
        </li>
        <li :class="{ pulsing: routeIsNotChordex }"   :title="!isLogged ? 'Please login to enter the app.' : 'Chordex App'">
          <NuxtLink
            class="link"
            :class="{ not_logged: !isLogged}"
            to="/songs"
            >
            ChordEx
          </NuxtLink>
          <!-- TODO: add tooltip (and lock icon) saying You have to be logged in. -->
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

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useAuthStore } from "~/stores/auth";

const route = useRoute();

const authStore = useAuthStore();

const scrolledNav = ref(false);
const hideLogo = ref(true);
const windowWidth = ref(0); // Default as 0, to be set on the client side

const isLogged = computed(() => {
  return authStore.isAuthenticated;
});

const routeIsNotChordex = computed(() => route.path !== '/chordex');

const checkScreen = () => {
  if (import.meta.client) {
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
  if (import.meta.client) {
    const scrollPosition = window.scrollY;
    if (scrollPosition >= 50) {
      scrolledNav.value = true;
    } else {
      scrolledNav.value = false;
    }
  }
};

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener("resize", checkScreen);
    window.addEventListener("scroll", updateScroll);
    checkScreen();
  }
});

onBeforeUnmount(() => {
  if (import.meta.client) {
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
  gap:0.5rem;
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

      &.not_logged {
        cursor: not-allowed;
        pointer-events: none;
      }
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
header nav .link.active {
  border-color: #d8323c;
}
header nav .logo {
  display: flex;
  align-items: center;
}
.scrolled-nav nav {
  padding: 0.5rem 0;
}
</style>