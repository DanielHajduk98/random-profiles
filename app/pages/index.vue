<template>
  <div
    class="mx-auto flex min-h-screen max-w-7xl flex-col gap-10 px-6 py-12"
  >
    <ProfilesHeader />

    <section class="flex flex-col gap-6">
      <ProfilesLoader v-if="pending" :card-count="LOADING_CARD_COUNT" />

      <div
        v-else-if="error"
        class="rounded-2xl border border-red-500/30 bg-red-950/30 p-6 text-sm text-red-100"
        role="alert"
      >
        <p class="font-semibold">Unable to load profiles.</p>
        <p class="mt-2 text-red-200/80">{{ errorMessage }}</p>
      </div>

      <div
        v-else
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        <ProfileCard
          v-for="profile in profiles"
          :key="profile.id"
          :profile="profile"
          class="animate-fade-in"
        />
      </div>
    </section>
  </div>
</template>
  
<script setup lang="ts">
  import { computed } from "vue";
  import { ApiClientError, getProfiles } from "../utils/api-client";
  import type { Profile } from "../../lib/types/profile-schema";
  
  const PROFILE_COUNT = 16;
  const LOADING_CARD_COUNT = 16;
  
  const { data, pending, error } = await useAsyncData("profiles", () =>
    getProfiles({ count: PROFILE_COUNT }),
  );
  
  const profiles = computed<Profile[]>(() => data.value ?? []);
  
  const errorMessage = computed(() => {
    if (!error.value) {
      return "";
    }
  
    if (error.value instanceof ApiClientError) {
      return error.value.message;
    }
  
    if (error.value instanceof Error) {
      return error.value.message;
    }
  
    return "Unexpected error";
  });

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
  