<template>
    <div>
      <LayoutTheHeader />
      <client-only>
        <LayoutTheSidebar v-if="isAuthenticated" />
      </client-only>
      <slot />
      <LayoutTheFooter />
    </div>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { useAuthStore } from "~/stores/auth";

const LayoutTheSidebar = defineAsyncComponent(() => import('~/components/layout/TheSidebar.vue'));

const authStore = useAuthStore();
const isAuthenticated = computed(() => {
  return authStore.isAuthenticated;
});

const route = useRoute();
useHead({
  title: route.meta.title || 'ChordEx Music', // Default title if none is set
});
</script>