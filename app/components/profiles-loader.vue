<template>
  <div
    class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
    role="status"
    aria-live="polite"
  >
    <div
      v-for="index in cardCount"
      :key="`loading-${index}`"
      class="h-56 animate-pulse rounded-2xl border border-purple-900/40 bg-slate-950/50"
    />
  </div>
</template>

<script setup lang="ts">
type ProfilesLoaderProps = {
  cardCount: number;
};

defineProps<ProfilesLoaderProps>();
</script>
