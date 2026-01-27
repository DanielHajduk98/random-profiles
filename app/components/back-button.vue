<template>
  <button
    type="button"
    class="inline-flex self-start items-center gap-2 rounded-full text-sm text-slate-300 transition hover:text-slate-100 active:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    @click="handleBack"
  >
    <ArrowLeft class="h-4 w-4 -translate-x-0.5" aria-hidden="true" />
    <span>Back</span>
  </button>
</template>

<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";

const router = useRouter();

const handleBack = () => {
  router.back();
};
</script>
