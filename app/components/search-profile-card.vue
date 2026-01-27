<template>
  <article
    class="relative flex gap-4 rounded-2xl border border-purple-900/50 bg-slate-950/60 p-6 text-left shadow-lg shadow-black/40 transition hover:border-purple-500/60"
    data-testid="search-profile-card"
  >
    <NuxtLink
      :to="`/profile/${profile.id}`"
      class="absolute inset-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      :aria-label="`View profile for ${profile.name}`"
      @click="handleSelect"
    />
    <div class="flex-shrink-0">
      <ProfileAvatar
        :name="profile.name"
        :avatar-url="profile.avatarUrl"
        size-class="h-16 w-16"
        text-class="text-2xl"
      />
    </div>
    <div class="min-w-0 flex-1">
      <h2 class="text-lg text-white">
        <span
          v-for="(part, index) in getHighlightParts(profile.name)"
          :key="`name-${profile.id}-${index}`"
        >
          <mark v-if="part.isMatch" class="bg-purple-600/30 text-purple-300">
            {{ part.value }}
          </mark>
          <span v-else>{{ part.value }}</span>
        </span>
      </h2>
      <p class="mb-2 text-sm text-purple-400">
        <span
          v-for="(part, index) in getHighlightParts(profile.jobTitle)"
          :key="`job-${profile.id}-${index}`"
        >
          <mark v-if="part.isMatch" class="bg-purple-600/30 text-purple-300">
            {{ part.value }}
          </mark>
          <span v-else>{{ part.value }}</span>
        </span>
        <span aria-hidden="true"> · </span>
        <span
          v-for="(part, index) in getHighlightParts(profile.company)"
          :key="`company-${profile.id}-${index}`"
        >
          <mark v-if="part.isMatch" class="bg-purple-600/30 text-purple-300">
            {{ part.value }}
          </mark>
          <span v-else>{{ part.value }}</span>
        </span>
      </p>
      <p class="text-sm text-zinc-400">
        <span
          v-for="(part, index) in getHighlightParts(profile.bio)"
          :key="`bio-${profile.id}-${index}`"
        >
          <mark v-if="part.isMatch" class="bg-purple-600/30 text-purple-300">
            {{ part.value }}
          </mark>
          <span v-else>{{ part.value }}</span>
        </span>
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Profile } from "../../lib/types/profile-schema";
import ProfileAvatar from "./profile-avatar.vue";

type SearchProfileCardProps = {
  profile: Profile;
  query?: string;
};

const props = withDefaults(defineProps<SearchProfileCardProps>(), {
  query: "",
});

const emit = defineEmits<{
  select: [profile: Profile];
}>();

type HighlightPart = {
  value: string;
  isMatch: boolean;
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getHighlightParts = (text: string): HighlightPart[] => {
  const query = props.query;
  if (!query) {
    return [{ value: text, isMatch: false }];
  }

  const escaped = escapeRegExp(query);
  const regex = new RegExp(`(${escaped})`, "ig");
  const lowerQuery = query.toLowerCase();

  return text
    .split(regex)
    .filter((part) => part.length > 0)
    .map((part) => ({
      value: part,
      isMatch: part.toLowerCase() === lowerQuery,
    }));
};

const handleSelect = () => {
  emit("select", props.profile);
};
</script>
