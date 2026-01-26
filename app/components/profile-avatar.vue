<template>
  <div
    class="relative flex items-center justify-center rounded-full bg-purple-800/60 font-semibold text-purple-100 shadow-inner shadow-purple-950/60"
    :class="sizeClass"
    role="img"
    :aria-label="`${name} avatar`"
  >
    <img
      v-if="!imageError"
      ref="imageRef"
      :src="avatarUrl"
      alt=""
      aria-hidden="true"
      class="absolute inset-0 h-full w-full rounded-full object-cover transition-opacity duration-200"
      :class="imageLoaded ? 'opacity-100' : 'opacity-0'"
      loading="lazy"
      @load="onImageLoad"
      @error="onImageError"
    >
    <span
      v-if="!imageLoaded || imageError"
      :class="textClass"
      aria-hidden="true"
    >
      {{ initials }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";

type ProfileAvatarProps = {
  name: string;
  avatarUrl: string;
  sizeClass?: string;
  textClass?: string;
};

const props = withDefaults(defineProps<ProfileAvatarProps>(), {
  sizeClass: "h-24 w-24",
  textClass: "text-4xl",
});

const imageError = ref(false);
const imageLoaded = ref(false);
const imageRef = ref<HTMLImageElement | null>(null);

const initials = computed(() => {
  const parts = props.name.split(" ").filter(Boolean);
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
