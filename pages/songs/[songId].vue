<template>
    song detail
</template>

<script setup lang="ts">
definePageMeta({
  requiresAuth: true,
});
const route = useRoute();
const songId = route.params.songId;

</script>