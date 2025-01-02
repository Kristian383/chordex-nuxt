<template>
  <div>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import {  onMounted } from 'vue';

useSeoMeta({
  title: 'My Amazing Site',
  ogTitle: 'My Amazing Site',
  description: 'ChordEx music is a powerful web application designed for musicians to organize their music library, analyze chord progressions, and track their practice songs. Key features include a metronome, YouTube video integration, creating custom playlists.',
  ogDescription: 'ChordEx music is a powerful web application designed for musicians to organize their music library, analyze chord progressions, and track their practice songs. Key features include a metronome, YouTube video integration, creating custom playlists.',
  // ogImage: 'https://example.com/image.png',
  // twitterCard: 'summary_large_image',
})

const authStore = useAuthStore();

onMounted(() => {
  // authStore.tryLogin();
  authStore.checkAuthStatus();
});
</script>
