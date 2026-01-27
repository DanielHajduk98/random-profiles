<template>
  <div class="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-6 py-12">
    <BackButton />

    <section class="flex flex-col gap-6">
      <div
        v-if="isLoading"
        class="rounded-3xl border border-purple-900/40 bg-slate-950/60 p-6 shadow-lg shadow-black/40"
        role="status"
        aria-live="polite"
      >
        <div class="flex flex-col gap-4 animate-pulse">
          <div class="h-8 w-48 rounded-full bg-purple-900/40" />
          <div class="h-4 w-72 rounded-full bg-purple-900/30" />
          <div class="h-24 rounded-2xl bg-purple-900/20" />
        </div>
        <p class="mt-4 text-sm text-slate-300">Loading profile...</p>
      </div>

      <div
        v-else-if="showNotFound"
        class="rounded-2xl border border-purple-900/50 bg-slate-950/60 p-6 text-sm text-slate-200"
        role="alert"
      >
        <p class="text-lg font-semibold text-slate-100">Profile not found.</p>
        <p class="mt-2 text-slate-300">
          Try heading back to the catalog and selecting another profile.
        </p>
      </div>

      <div
        v-else-if="error"
        class="rounded-2xl border border-red-500/30 bg-red-950/30 p-6 text-sm text-red-100"
        role="alert"
      >
        <p class="font-semibold">Unable to load profile.</p>
        <p class="mt-2 text-red-200/80">{{ errorMessage }}</p>
      </div>

      <div v-else-if="profile" class="flex flex-col">
        <div
          class="mb-6 rounded-2xl border border-purple-900/50 bg-slate-950/60 p-8 backdrop-blur-sm"
        >
          <div class="flex flex-col items-center text-center">
            <ProfileAvatar
              :name="profile.name"
              :avatar-url="profile.avatarUrl"
              size-class="h-32 w-32 ring-4 ring-purple-400/80 ring-offset-2 ring-offset-black"
              text-class="text-5xl"
            />
            <div class="mt-6 flex flex-col gap-2">
              <h1 class="text-3xl font-semibold text-white">
                {{ profile.name }} ({{ profile.age }})
              </h1>
              <p class="text-xl text-purple-400">
                {{ profile.bio }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="mb-6 rounded-2xl border border-purple-900/50 bg-slate-950/60 p-8 backdrop-blur-sm"
        >
          <div class="mb-6 flex items-center gap-3 text-purple-400">
            <Briefcase class="h-5 w-5" aria-hidden="true" />
            <h2 class="text-base font-semibold text-white">Professional</h2>
          </div>
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2 text-zinc-500">
                <IdCardLanyard class="h-4 w-4 text-purple-400" aria-hidden="true" />
                <p class="text-xs uppercase tracking-wide">Job title</p>
              </div>
              <p class="text-lg text-white">{{ profile.jobTitle }}</p>
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2 text-zinc-500">
                <Building2 class="h-4 w-4 text-purple-400" aria-hidden="true" />
                <p class="text-xs uppercase tracking-wide">Company</p>
              </div>
              <div class="flex items-center gap-2 text-lg text-white">
                <span>{{ profile.company }}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          class="rounded-2xl border border-purple-900/50 bg-slate-950/60 p-8 backdrop-blur-sm"
        >
          <div class="mb-6 flex items-center gap-3 text-purple-400">
            <Mail class="h-5 w-5" aria-hidden="true" />
            <h2 class="text-base font-semibold text-white">
              Contact Information
            </h2>
          </div>
          <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div class="space-y-6">
              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-2 text-zinc-500">
                  <Mail class="h-4 w-4 text-purple-400" aria-hidden="true" />
                  <p class="text-xs uppercase tracking-wide">Email</p>
                </div>
                <a
                  :href="`mailto:${profile.email}`"
                  class="text-white transition hover:text-purple-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  {{ profile.email }}
                </a>
              </div>

              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-2 text-zinc-500">
                  <Phone class="h-4 w-4 text-purple-400" aria-hidden="true" />
                  <p class="text-xs uppercase tracking-wide">Phone</p>
                </div>
                <a
                  :href="`tel:${profile.phone}`"
                  class="text-white transition hover:text-purple-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  {{ profile.phone }}
                </a>
              </div>
            </div>

            <div class="space-y-6">
              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-2 text-zinc-500">
                  <MapPin class="h-4 w-4 text-purple-400" aria-hidden="true" />
                  <p class="text-xs uppercase tracking-wide">Address</p>
                </div>
                <p class="text-white">{{ profile.address }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  Briefcase,
  Building2,
  IdCardLanyard,
  Mail,
  MapPin,
  Phone,
} from "lucide-vue-next";
import { computed } from "vue";
import type { Profile } from "../../../lib/types/profile-schema";
import { useProfileStore } from "../../stores/profile-store";
import { ApiClientError, getProfileById } from "../../utils/api-client";

const route = useRoute();
const profileStore = useProfileStore();

const profileId = computed(() => {
  const idParam = route.params.id;
  if (Array.isArray(idParam)) {
    return idParam[0] ?? "";
  }
  return idParam ?? "";
});

const cachedProfile = computed(() => profileStore.profileById(profileId.value));

const { data, pending, error } = await useAsyncData<Profile | null>(
  () => `profile-${profileId.value}`,
  async () => {
    if (!profileId.value) {
      return null;
    }

    const cached = profileStore.profileById(profileId.value);
    if (cached) {
      return cached;
    }

    const profile = await getProfileById(profileId.value);
    profileStore.setSelectedProfile(profile);
    return profile;
  },
  {
    watch: [profileId],
  },
);

const profile = computed(() => cachedProfile.value ?? data.value ?? null);
const isLoading = computed(() => pending.value && !profile.value);
const isMissingId = computed(() => !profileId.value);

const isNotFound = computed(() => {
  if (isMissingId.value) {
    return true;
  }

  return error.value instanceof ApiClientError && error.value.type === "not-found";
});

const showNotFound = computed(() => {
  if (isNotFound.value) {
    return true;
  }

  return !isLoading.value && !error.value && !profile.value;
});

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

useHead(() => ({
  title: profile.value ? `${profile.value.name} - Profile` : "Profile Details",
  meta: [
    {
      name: "description",
      content: profile.value
        ? `Profile details for ${profile.value.name}`
        : "Profile details",
    },
  ],
  link: [
      { rel: "preconnect", href: "https://testingbot.com" },
      { rel: "dns-prefetch", href: "https://testingbot.com" },
    ],
  }));
</script>
