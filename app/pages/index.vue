<template>
  <div class="mx-auto max-w-7xl px-6 py-12">
    <section class="text-center mb-16">
      <div
        class="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/20 rounded-full border border-purple-500/30 mb-6"
      >
        <Sparkles class="w-4 h-4 text-purple-400" />
        <span class="text-purple-400 text-sm">Welcome to our community</span>
      </div>
      <h1 class="text-5xl md:text-6xl text-white mb-4">
        Meet Amazing People
      </h1>
      <p class="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
        Discover talented professionals from around the world. Connect, collaborate, and grow together.
      </p>
      <NuxtLink
        to="/search"
        class="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors shadow-lg shadow-purple-600/20"
      >
        <Search class="w-5 h-5" />
        <span>Search Profiles</span>
      </NuxtLink>
    </section>
    <ProfilesResults :count="PROFILE_COUNT" results-key="profiles-home" />
  </div>
</template>
  
<script setup lang="ts">
import { Search, Sparkles } from "lucide-vue-next";

const PROFILE_COUNT = 8;

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
  