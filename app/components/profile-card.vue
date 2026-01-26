<template>
  <div
    class="group relative flex h-full flex-col items-center gap-1 rounded-2xl border border-purple-900/50 bg-slate-950/60 p-6 text-center text-slate-100 shadow-lg shadow-black/40 transform transition duration-200 ease-out focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-400/70 focus-within:ring-offset-2 focus-within:ring-offset-black focus-within:-translate-y-0.5 focus-within:scale-[1.05] hover:-translate-y-0.5 hover:scale-[1.05] hover:border-purple-500/60 hover:shadow-purple-900/40"
  >
    <NuxtLink
      :to="`/profile/${profile.id}`"
      class="absolute inset-0 rounded-2xl focus-visible:outline-none"
      :aria-label="`View profile for ${profile.name}`"
    />
    <div class="flex flex-col items-center gap-3">
      <div
        class="relative flex h-24 w-24 items-center justify-center rounded-full bg-purple-800/60 text-base font-semibold text-purple-100 shadow-inner shadow-purple-950/60"
      >
        <img
          v-if="!imageError"
          ref="imageRef"
          :src="profile.avatarUrl"
          :alt="`${profile.name} avatar`"
          class="absolute inset-0 h-24 w-24 rounded-full object-cover transition-opacity duration-200"
          :class="imageLoaded ? 'opacity-100' : 'opacity-0'"
          loading="lazy"
          @load="onImageLoad"
          @error="onImageError"
        >
        <span
          v-if="!imageLoaded || imageError"
          class="text-4xl"
          aria-hidden="true"
        >
          {{ initials }}
        </span>
      </div>
      <h3 class="text-lg font-semibold text-slate-100">
        {{ profile.name }}
      </h3>
    </div>

    <p class="line-clamp-3 text-slate-200/80">
      {{ profile.bio }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { type Profile } from "../../lib/types/profile-schema";

type ProfileCardProps = {
  profile: Profile;
};

const props = defineProps<ProfileCardProps>();
const imageError = ref(false);
const imageLoaded = ref(false);
const imageRef = ref<HTMLImageElement | null>(null);

const initials = computed(() => {
  const parts = props.profile.name.split(" ").filter(Boolean);
  const initialsValue = parts
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return initialsValue || "NA";
});

const onImageError = () => {
  imageError.value = true;
};

const onImageLoad = () => {
  imageLoaded.value = true;
};

onMounted(() => {
  if (imageRef.value?.complete) {
    imageLoaded.value = true;
  }
});
</script>
  