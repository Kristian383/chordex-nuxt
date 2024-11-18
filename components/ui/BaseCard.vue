<template>
  <section
    class="home-section"
    :class="{ expand_home_section: sidebarIsActive && isDesktop }"
  >
    <nav v-if="!isMetronomeView">
      <TheSearch />
      <div class="filter_categories">
        <slot name="filters" />
      </div>
    </nav>
    <div class="home-content" :class="{ reduce_content_padding: isMetronomeView }">
      <div :style="{ justifyContent: titleJustifyStyle }" class="sort-section-title">
        <slot name="playlist_name_edit" />
        <slot name="song_detail_title" />
        <div class="title">
          <div v-if="route.query?.artist && !route.params.songId" class="active-artist-chip" @click="goToSongs">
            <span>{{ route.query?.artist }}</span>
            <client-only>
              <font-awesome-icon class="chip-icon" icon="times" />
             </client-only>
          </div>
          <span v-else-if="!route.query?.artist" class="title-text">{{ getTitle }}</span>
        </div>
        <slot name="sort_select_box" />
      </div>
      <slot />
      <scroll-up :class="{ show: showBackToTop }" />
    </div>
  </section>
</template>

<script setup lang="ts">
const TheSearch = defineAsyncComponent(() => import('~/components/ui/TheSearch.vue'));

import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useUIStore } from '~/stores/ui';

const route = useRoute()
const router = useRouter()

const showBackToTop = ref(false)

const titleJustifyStyle = computed(() => {
  if (route.name === "SongDetail") return "center"
  return route.path !== "/songs" ? "space-around" : "space-between"
})

const uiStore = useUIStore();

const sidebarIsActive = computed(() => uiStore.isSidebarActive);
const isDesktop = computed(() => !uiStore.isMobile)

const isMetronomeView = computed(() => route.path === "/metronome")

const getTitle = computed(() => {
  const { name, query } = route
  if (query?.artist) return `Songs by: ${query?.artist}`
  if (query?.playlist || name === "SongDetail") return
  return name
})

function showButtonUp() {
  if (window.scrollY > 800) {
    showBackToTop.value = true
  } else if (window.scrollY < 800) {
    showBackToTop.value = false
  }
}

onMounted(() => {
  window.addEventListener("scroll", showButtonUp)
})

onBeforeUnmount(() => {
  window.removeEventListener("scroll", showButtonUp)
})

const goToSongs = () => {
  router.push('/songs')
}
</script>

<style lang="scss" scoped>
.home-section {
  position: relative;
  background: var(--white);
  min-height: 100vh;
  transition: all 0.5s ease;
}

.home-section nav {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: var(--white);
  align-items: center;
  position: fixed;
  width: 100%;
  z-index: 40;
  padding: 0.625rem 1.25rem;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  transition: all 0.5s ease-in-out;
}
.expand_home_section {
  left: 15rem;
  width: calc(100% - 15rem);
}
.expand_home_section nav {
  left: 15rem;
  width: calc(100% - 15rem);
}

@media (min-width: 87.5rem) {
  .home-section nav {
    flex-direction: row;
    height: 5rem;
    justify-content: center;
  }
}

.filter_categories {
  min-width: 15.625rem;
  max-width: 50rem;
  display: flex;
  width: 100%;
  order: 2;
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 1.25rem;
  gap: 0.25rem;
}

@media (min-width: 87.5rem) {
  .filter_categories {
    order: 0;
  }
}

.filter_categories::-webkit-scrollbar {
  display: none;
}

/* Content under header */
.home-section .home-content {
  position: relative;
  padding: 8.75rem 1rem 1rem 1rem;
  margin: 0 auto;
  background-color: var(--white);
  height: 100%;
  max-width: 106.25rem;
}

.active-artist-chip {
  display: inline-block;
  border: 2px solid #ccc;
  border-radius: 1.25rem;
  padding: 0.3125rem 0.625rem;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--dark_gray_chips);
  &:hover {
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    .chip-icon {
      color: var(--dark_gray_chips);
    }
  }
}

@media (min-width: 1400px) {
  .home-section .home-content {
    padding: 6rem 1rem 1rem 1rem;
  }
}
.home-content.reduce_content_padding {
  padding: 1rem;
}

.sort-section-title {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  margin-bottom: 0.5rem;
  color: var(--font_black);
  align-items: center;
  padding: 0 2rem;
}

@media (min-width: 90rem) {
  .home-section .home-content {
    padding-left: 2.5rem;
  }
}

.sort-section-title .title {
  flex-shrink: 0;
  font-size: 1.3125rem;
  font-weight: 600;
  text-align: center;
}

.arrow-right,
.arrow-left {
  display: inline-block;
  width: 3.125rem;
  text-align: center;
  color: var(--burgundy);
  transition: all ease-in 0.3s;
}

.arrow-right:hover,
.arrow-left:hover {
  cursor: pointer;
  color: #222;
}
</style>
