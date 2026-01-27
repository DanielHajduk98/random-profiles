<template>
  <div class="mx-auto flex min-h-screen max-w-7xl flex-col gap-10 px-6 py-12">
    <BackButton />

    <ProfilesHeader />
    
    <ProfilesResults
      :count="SEARCH_COUNT"
      :query="query"
      results-key="profiles-search"
      empty-state="search"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { parseQueryParam } from "../utils/search-query";
import ProfilesHeader from "../components/profiles-header.vue";

const SEARCH_COUNT = 10;

const route = useRoute();
const query = computed(() => parseQueryParam(route.query.q));

useHead({
  title: `Search - ${query.value} - Random Profiles Catalog`,
  meta: [
    { name: "description", content: `Search results for - ${query.value}` },
  ],
  link: [
    { rel: "preconnect", href: "https://testingbot.com" },
    { rel: "dns-prefetch", href: "https://testingbot.com" },
  ],
});
</script>
