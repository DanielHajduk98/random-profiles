<template>
  <div class="min-h-screen">
    <div class="mx-auto flex max-w-7xl flex-col px-6 py-12">
      <BackButton class="mb-8" />

      <section class="mb-8">
        <div class="mb-6 flex items-center">
          <h1 class="text-3xl text-white">Search Profiles</h1>
        </div>

        <SearchInput
          v-model="searchValue"
          :maxlength="MAX_QUERY_LENGTH"
          placeholder="Search by name, role, company, or bio..."
          autofocus
          @input="handleInput"
          @clear="handleClear"
        />

        <div class="flex items-center justify-between">
          <p class="text-zinc-400">
            <template v-if="hasQuery">
              <span class="text-purple-400">{{ displayProfiles.length }}</span>
              results found
            </template>
            <template v-else>
              Start typing to search
            </template>
            <span v-if="showingFirstTen" class="text-zinc-500">
              (showing first 10)
            </span>
          </p>
        </div>
      </section>

      <section>
        <div
          v-if="pending"
          class="grid grid-cols-1 gap-6 md:grid-cols-2"
          role="status"
          aria-live="polite"
        >
          <div
            v-for="index in SEARCH_COUNT"
            :key="`loading-${index}`"
            class="h-32 animate-pulse rounded-2xl border border-purple-900/40 bg-slate-950/50"
          />
        </div>

        <div
          v-else-if="showError"
          class="rounded-2xl border border-red-500/30 bg-red-950/30 p-6 text-sm text-red-100"
          role="alert"
        >
          <p class="font-semibold">Unable to load profiles.</p>
          <p class="mt-2 text-red-200/80">{{ errorMessage }}</p>
        </div>

        <div
          v-else-if="showNoQuery || showEmptyResults"
          class="rounded-2xl border border-purple-900/50 bg-slate-950/60 p-10 text-center"
          role="status"
        >
          <div class="mx-auto flex max-w-md flex-col items-center gap-3">
            <Search class="h-10 w-10 text-purple-400" aria-hidden="true" />
            <h2 class="text-xl font-semibold text-white">
              {{ emptyStateTitle }}
            </h2>
            <p class="text-sm text-zinc-400">
              {{ emptyStateDescription }}
            </p>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SearchProfileCard
            v-for="profile in displayProfiles"
            :key="profile.id"
            :profile="profile"
            :query="searchQuery"
            @select="handleSelect"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from "lucide-vue-next";
import { computed, ref, watch } from "vue";
import BackButton from "../components/back-button.vue";
import SearchInput from "../components/search-input.vue";
import SearchProfileCard from "../components/search-profile-card.vue";
import { useDebouncedCallback } from "../composables/use-debounced-callback";
import { useProfilesResults } from "../composables/use-profiles-results";
import { useProfileStore } from "../stores/profile-store";
import type { Profile } from "../../lib/types/profile-schema";
import { MAX_QUERY_LENGTH, normalizeQuery, parseQueryParam } from "../utils/search-query";

const SEARCH_COUNT = 10;

const route = useRoute();
const router = useRouter();
const profileStore = useProfileStore();

const searchQuery = computed(() => parseQueryParam(route.query.q));
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

  if (!normalized) {
    if (currentQuery) {
      router.replace({ path: "/search", query: {} });
    }
    return;
  }

  if (normalized === currentQuery) {
    return;
  }

  router.replace({ path: "/search", query: { q: normalized } });
}, 350);

const handleInput = (value: string) => {
  scheduleSearch(value);
};

const handleClear = () => {
  scheduleSearch("");
};

const {
  profiles,
  pending,
  error,
  errorMessage,
  hasQuery,
} = await useProfilesResults({
  count: SEARCH_COUNT,
  query: searchQuery,
  resultsKey: "profiles-search",
  skipEmpty: true,
});

const displayProfiles = computed(() => profiles.value.slice(0, SEARCH_COUNT));
const showNoQuery = computed(() => !hasQuery.value);
const showError = computed(() => Boolean(error.value));
const showEmptyResults = computed(
  () => hasQuery.value && !pending.value && !showError.value && displayProfiles.value.length === 0,
);
const showingFirstTen = computed(() => hasQuery.value && displayProfiles.value.length === SEARCH_COUNT);
const emptyStateTitle = computed(() =>
  showNoQuery.value ? "Start typing to search" : "No profiles found",
);
const emptyStateDescription = computed(() =>
  showNoQuery.value
    ? "Try a name, role, company, or bio."
    : "Try adjusting your search query.",
);

const handleSelect = (profile: Profile) => {
  profileStore.setSelectedProfile(profile);
};

useHead(() => ({
  title: searchQuery.value
    ? `Search - ${searchQuery.value} - Random Profiles Catalog`
    : "Search - Random Profiles Catalog",
  meta: [
    {
      name: "description",
      content: searchQuery.value
        ? `Search results for - ${searchQuery.value}`
        : "Search profiles",
    },
  ],
  link: [
    { rel: "preconnect", href: "https://testingbot.com" },
    { rel: "dns-prefetch", href: "https://testingbot.com" },
  ],
}));
</script>
