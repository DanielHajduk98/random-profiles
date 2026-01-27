<template>
  <div class="relative mb-6">
    <Search
      class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500 z-10"
      aria-hidden="true"
    />
    <label class="sr-only" :for="inputId">
      Search profiles
    </label>
    <input
      :id="inputId"
      :value="modelValue"
      type="search"
      :maxlength="maxlength"
      class="h-14 w-full rounded-xl border border-zinc-800/50 bg-zinc-900/50 pl-12 pr-12 text-white placeholder:text-zinc-500 backdrop-blur-sm transition-colors focus:border-purple-500/50 focus:outline-none"
      :placeholder="placeholder"
      aria-label="Search profiles"
      :autofocus="autofocus"
      @input="handleInput"
    >
    <button
      v-if="modelValue"
      type="button"
      class="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-white"
      aria-label="Clear search"
      @click="handleClear"
    >
      <X class="h-5 w-5" aria-hidden="true" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Search, X } from "lucide-vue-next";
import { MAX_QUERY_LENGTH } from "../utils/search-query";

type SearchInputProps = {
  modelValue?: string;
  maxlength?: number;
  placeholder?: string;
  autofocus?: boolean;
  inputId?: string;
};

withDefaults(defineProps<SearchInputProps>(), {
  modelValue: "",
  maxlength: MAX_QUERY_LENGTH,
  placeholder: "Search by name, role, company, or bio...",
  autofocus: false,
  inputId: "profiles-search-input",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  input: [value: string];
  clear: [];
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const nextValue = target.value;
  emit("update:modelValue", nextValue);
  emit("input", nextValue);
};

const handleClear = () => {
  emit("update:modelValue", "");
  emit("clear");
};
</script>
