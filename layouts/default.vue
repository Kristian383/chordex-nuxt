<template>
    <div>
      <LayoutTheHeader />
      <LayoutTheSidebar />
      <slot />
      <LayoutTheFooter />
    </div>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router';

const route = useRoute();
useHead({
  title: route.meta.title || 'ChordEx Music', // Default title if none is set
});
</script>