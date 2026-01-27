<template>
  <div
    class="mx-auto flex min-h-screen max-w-7xl flex-col gap-10 px-6 py-12"
  >
    <ProfilesHeader />

    <ProfilesResults :count="PROFILE_COUNT" results-key="profiles-home" />
  </div>
</template>
  
<script setup lang="ts">
const PROFILE_COUNT = 16;

useHead({
  title: "Random Profiles Catalog",
  meta: [
    { name: "description", content: "Random Profiles Catalog" },
  ],
  link: [
    { rel: "preconnect", href: "https://testingbot.com" },
    { rel: "dns-prefetch", href: "https://testingbot.com" },
  ],
});
</script>
  