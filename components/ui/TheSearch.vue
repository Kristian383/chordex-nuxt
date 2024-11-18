<template>
  <div ref="searchBoxRef" class="search-box">
    <input
      v-model.trim="searchText"
      type="text"
      placeholder="Search song or artist"
      @input="searchTextBox"
      @keydown.esc="searchText = ''"
    />
    <div v-if="searchMatch.length && searchText" class="match-list">
      <transition-group name="list">
        <li 
          v-for="match in searchMatch"
          :key="match.songId" 
          @keydown.enter.prevent="handleSelect(match.songId)"
          @keydown.esc="searchText = ''"
          @click.capture="handleSelect(match.songId)"
        >
          <NuxtLink :to="`/songs/${match.songId}`">
            <b>{{ match.artist }} - {{ match.songName }}</b>
          </NuxtLink>
        </li>
      </transition-group>
    </div>
    <client-only>
      <font-awesome-icon id="search-icon" icon="search" />
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useSongsStore, type Song } from "~/stores/songs";

const songsStore = useSongsStore();
const searchMatch = ref<Song[]>([]);
const searchBoxRef = ref<HTMLDivElement | null>(null);
const searchText = ref("");

const allSongs = computed(() => songsStore.getAllSongs);

const handleOutsideClick = (event: Event) => {
  if (!searchBoxRef.value?.contains(event.target as Node)) {
    searchMatch.value = [];
    searchText.value = "";
  }
};

onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});

const handleSelect = (songId: number) => {
  const router = useRouter();
  router.push(`/songs/${songId}`);
  searchMatch.value = [];
  searchText.value = "";
};

const searchTextBox = (e: Event) => {
  const textValue = (e.target as HTMLInputElement).value;
  const foundData = allSongs.value.filter((song) => {
    const regex = new RegExp(textValue, "gi");
    return song.songName.match(regex) || song.artist.match(regex);
  });
  searchMatch.value = foundData; // TODO
}; 

</script>

<style lang="scss" scoped>
.search-box {
  position: relative;
  height: 50px;
  width: 100%;
  max-width: 21rem;
  z-index:50;

  input {
    outline: none;
    width: 100%;
    background: var(--chips_gray);
    border: none;
    border-radius: 6px;
    font-size: 18px;
    padding: 0.875rem 3rem 0.875rem 0.875rem;

    &:focus {
      box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    }
  }

  #search-icon {
    position: absolute;
    height: 40px;
    padding: 6px;
    width: 40px;
    background: var(--burgundy);
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 4px;
    line-height: 40px;
    text-align: center;
    color: #fff;
  }
}

.search-box .match-list {
  max-height: 17.5rem;
  overflow-y: auto;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  margin-top: 0.375rem;
  padding: 0.125rem;

  li {
    list-style: none;
    width: 100%;
    border-radius: 3px;
    cursor: pointer;

    &:hover {
      background: #f2f2f2;
    }

    a {
      text-decoration: none;
      color: inherit;
      display: inline-block;
      width: 100%;
      padding: 10px 12px;
    }
  }
}

.list-enter-from {
  opacity: 0;
}
.list-enter-to {
  opacity: 1;
}
.list-enter-active {
  transition: all 0.4s ease;
}

.list-leave-from {
  opacity: 1;
}
.list-leave-to {
  opacity: 0;
}
.list-leave-active {
  transition: all 0.3s ease;
}
</style>