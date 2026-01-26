<template>
  <div
    class="group relative flex h-full flex-col items-center gap-1 rounded-2xl border border-purple-900/50 bg-slate-950/60 p-6 text-center text-slate-100 shadow-lg shadow-black/40 transform transition duration-200 ease-out focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-400/70 focus-within:ring-offset-2 focus-within:ring-offset-black focus-within:-translate-y-0.5 focus-within:scale-[1.05] hover:-translate-y-0.5 hover:scale-[1.05] hover:border-purple-500/60 hover:shadow-purple-900/40"
  >
    <NuxtLink
      :to="`/profile/${profile.id}`"
      class="absolute inset-0 rounded-2xl focus-visible:outline-none"
      :aria-label="`View profile for ${profile.name}`"
      @click="handleSelect"
    />
    <div class="flex flex-col items-center gap-3">
      <ProfileAvatar
        :name="profile.name"
        :avatar-url="profile.avatarUrl"
        size-class="h-24 w-24"
        text-class="text-4xl"
      />
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
import { type Profile } from "../../lib/types/profile-schema";
import { useProfileStore } from "../stores/profile-store";

type ProfileCardProps = {
  profile: Profile;
};

const props = defineProps<ProfileCardProps>();
const profileStore = useProfileStore();

const handleSelect = () => {
  profileStore.setSelectedProfile(props.profile);
};
</script>
  