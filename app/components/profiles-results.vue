<template>
  <section class="flex flex-col gap-6">
    <div
      v-if="showNoQuery"
      class="rounded-2xl border border-purple-900/50 bg-slate-950/60 p-6 text-sm text-slate-200"
      role="status"
    >
      <p class="text-lg font-semibold text-slate-100">
        Start typing to search.
      </p>
      <p class="mt-2 text-slate-300">
        Try a name, company, or job title.
      </p>
    </div>

    <ProfilesLoader v-else-if="pending" :card-count="count" />

    <div
      v-else-if="showError"
      class="rounded-2xl border border-red-500/30 bg-red-950/30 p-6 text-sm text-red-100"
      role="alert"
    >
      <p class="font-semibold">Unable to load profiles.</p>
      <p class="mt-2 text-red-200/80">{{ errorMessage }}</p>
    </div>

    <div
      v-else-if="showEmptyResults"
      class="rounded-2xl border border-purple-900/50 bg-slate-950/60 p-6 text-sm text-slate-200"
      role="status"
    >
      <p class="text-lg font-semibold text-slate-100">No profiles found.</p>
      <p class="mt-2 text-slate-300">Try a different search.</p>
    </div>

    <div
      v-else
      class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      <ProfileCard
        v-for="profile in displayProfiles"
        :key="profile.id"
        :profile="profile"
        class="animate-fade-in"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useProfilesResults } from "../composables/use-profiles-results";

type ProfilesResultsProps = {
  count: number;
  query?: string;
  resultsKey?: string;
  emptyState?: "none" | "search";
};

const props = withDefaults(defineProps<ProfilesResultsProps>(), {
  query: "",
  resultsKey: "profiles-results",
  emptyState: "none",
});

const {
  profiles,
  pending,
  error,
  errorMessage,
  hasQuery,
} = await useProfilesResults({
  count: props.count,
  query: computed(() => props.query ?? ""),
  resultsKey: props.resultsKey,
  skipEmpty: props.emptyState === "search",
});

const displayProfiles = computed(() => profiles.value.slice(0, props.count));
const showNoQuery = computed(
  () => props.emptyState === "search" && !hasQuery.value,
);
const showError = computed(
  () => Boolean(error.value) && (props.emptyState !== "search" || hasQuery.value),
);
const showEmptyResults = computed(
  () =>
    hasQuery.value &&
    !pending.value &&
    !showError.value &&
    displayProfiles.value.length === 0,
);
</script>
