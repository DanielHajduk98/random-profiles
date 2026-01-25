<template>
    <main
      class="min-h-screen bg-fixed bg-gradient-to-tr from-purple-950 to-black text-slate-100"
    >
      <div
        class="mx-auto flex min-h-screen max-w-7xl flex-col gap-10 px-6 py-12"
      >
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
              <p class="mt-2 text-sm text-purple-100/70">
                Search and filters land here soon.
              </p>
            </div>
            <div class="w-full md:max-w-md">
              <div
                class="flex h-12 items-center rounded-full border border-purple-800/50 bg-black/40 px-4 text-sm text-purple-200/60"
              >
                Search placeholder
              </div>
            </div>
          </div>
        </header>
  
        <section class="flex flex-col gap-6">
          <div
            v-if="pending"
            class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            role="status"
            aria-live="polite"
          >
            <div
              v-for="index in LOADING_CARD_COUNT"
              :key="`loading-${index}`"
              class="h-56 animate-pulse rounded-2xl border border-purple-900/40 bg-slate-950/50"
            />
          </div>
  
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
    </main>
  </template>
  
<script setup lang="ts">
  import { computed } from "vue";
  import { ApiClientError, getProfiles } from "../utils/api-client";
  import type { Profile } from "../../lib/types/profile-schema";
  
  const PROFILE_COUNT = 16;
  const LOADING_CARD_COUNT = 8;
  
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
  });
</script>
  