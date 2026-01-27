<template>
  <header
    class="rounded-3xl border border-purple-900/40 bg-slate-950/40 p-6 shadow-lg shadow-black/40"
  >
    <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div>
        <p class="text-xs uppercase tracking-[0.3em] text-purple-300/80">
          Profiles
        </p>
        <h1 class="mt-2 text-3xl font-semibold text-white">
          Random Profiles Catalog
        </h1>
      </div>
      <div class="w-full md:max-w-md">
        <div
          class="flex h-12 items-center rounded-full border border-purple-800/50 bg-black/40 px-4 text-sm text-slate-100 focus-within:border-purple-500/70 focus-within:ring-2 focus-within:ring-purple-400/70 focus-within:ring-offset-2 focus-within:ring-offset-black"
        >
          <label class="sr-only" for="profiles-search-input">
            Search profiles
          </label>
          <input
            id="profiles-search-input"
            v-model="searchValue"
            type="search"
            :maxlength="MAX_QUERY_LENGTH"
            class="w-full bg-transparent text-sm text-slate-100 placeholder:text-purple-200/60 focus-visible:outline-none"
            placeholder="Search profiles..."
            aria-label="Search profiles"
            @input="handleInput"
          >
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useDebouncedCallback } from "../composables/use-debounced-callback";
import { MAX_QUERY_LENGTH, normalizeQuery, parseQueryParam } from "../utils/search-query";

const route = useRoute();
const router = useRouter();

const searchValue = ref("");

const syncFromRoute = () => {
  const normalized = parseQueryParam(route.query.q);
  if (normalized !== searchValue.value) {
    searchValue.value = normalized;
  }
};

watch(() => route.query.q, syncFromRoute, { immediate: true });

const { debounced: scheduleSearch } = useDebouncedCallback((rawValue: string) => {
  const normalized = normalizeQuery(rawValue);
  const currentQuery = parseQueryParam(route.query.q);
  const isOnSearchPage = route.path === "/search";

  if (!normalized) {
    if (isOnSearchPage && currentQuery) {
      router.replace({ path: "/search", query: {} });
    }
    return;
  }

  if (isOnSearchPage) {
    if (normalized === currentQuery) {
      return;
    }
    router.replace({ path: "/search", query: { q: normalized } });
    return;
  }

  router.push({ path: "/search", query: { q: normalized } });
}, 350);

const handleInput = () => {
  scheduleSearch(searchValue.value);
};
</script>
