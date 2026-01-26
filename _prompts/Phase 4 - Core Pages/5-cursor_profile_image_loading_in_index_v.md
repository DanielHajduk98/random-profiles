# Profile image loading in index.vue
_Exported on 1/26/2026 at 19:49:56 GMT+1 from Cursor (2.4.21)_

---

**User**

Take a look at @app/pages/index.vue . Is there a way to preload the profile images or wait till they are loaded when displaying the loader? Suggest multiple solutions, present their tradeoffs and pros.

---

**Cursor**

Here now, loader tied only to data fetch (`pending`), images are lazy-loaded in `ProfileCard`.  
Refs:
```35:65:app/pages/index.vue
          <div
            v-if="pending"
            class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            role="status"
            aria-live="polite"
          >
...
          <ProfileCard
            v-for="profile in profiles"
            :key="profile.id"
            :profile="profile"
            class="animate-fade-in"
          />
```
```14:22:app/components/profile-card.vue
        <img
          v-if="!imageError"
          :src="profile.avatarUrl"
          :alt="`${profile.name} avatar`"
          class="h-24 w-24 rounded-full object-cover"
          loading="lazy"
          @error="onImageError"
        >
```

## Options to preload/wait + tradeoffs

**1) Track image load events, keep loader until all loaded**  
- How: emit `loaded`/`error` from `ProfileCard` on `@load`/`@error`, parent counts. Gate UI with `pending || !allImagesLoaded`.  
- Pros: loader matches “real” content ready.  
- Cons: slow image blocks entire grid; perceived wait grows; more state + plumbing.

**2) Only wait for above‑the‑fold images**  
- How: count first N cards (e.g., first row) and gate loader until those loaded.  
- Pros: fast perceived load; avoids global block; still avoids layout shift up top.  
- Cons: below‑the‑fold may still pop in; extra logic for “first N”.

**3) Use `<link rel="preload" as="image">` for first avatars**  
- How: after `useAsyncData` resolves, call `useHead` with `link: profiles.slice(0, N).map(...)`.  
- Pros: browser starts downloads early; no JS tracking.  
- Cons: adds head churn; preloading too many wastes bandwidth; still no “wait until loaded” unless you add a gate.

**4) Preconnect / dns‑prefetch to avatar host**  
- How: `useHead({ link: [{ rel: "preconnect", href: host }] })`.  
- Pros: small win, low complexity; helps all images.  
- Cons: no guarantee on load time; minor gain if same-origin.

**5) Switch first images to eager load**  
- How: set `loading="eager"` for first N cards (prop or computed), keep others `lazy`.  
- Pros: minimal code; improve above‑fold.  
- Cons: still no “wait”; can hurt LCP on slow networks if too many eager.

**6) Full prefetch via JS `new Image()` + `decode()`**  
- How: in index page, create images for first N URLs, await `img.decode()` or load event.  
- Pros: exact “wait until loaded”; no template change.  
- Cons: heavier JS, no SSR; decode can be inconsistent on cross‑origin.

## Quick recommendation
- If you want strict “show grid only when ready”: option 1, maybe cap to first row.  
- If you want best UX balance: option 2 + option 3 (preload first N) + keep rest lazy.  

If you want, I can sketch the event‑based gating flow or a `useHead` preload snippet.

---

**User**

let's start with preconnect - 4

---

**Cursor**

Added preconnect + dns‑prefetch for the avatar host in `app/pages/index.vue`, so image requests start faster before the grid renders.

If you want to make this dynamic later (different host), we can derive the host from `profiles` and update `useHead` accordingly.

---

**User**

ok, let's go with option 1 now.

---

**Cursor**

Image loader now waits for avatars to settle on client. I wired `ProfileCard` to emit load/error events and count them in `index.vue`, showing the skeleton until all images resolve. I also guarded with `import.meta.client` to avoid SSR mismatch.

Refs:
```33:66:app/pages/index.vue
      <div
        v-if="pending || (!error && isClient && !imageLoadComplete)"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        role="status"
        aria-live="polite"
      >
...
          <ProfileCard
            v-for="profile in profiles"
            :key="profile.id"
            :profile="profile"
            class="animate-fade-in"
            @image-load="onImageSettled"
            @image-error="onImageSettled"
          />
```
```72:111:app/pages/index.vue
  const profiles = computed<Profile[]>(() => data.value ?? []);
  const isClient = import.meta.client;
  const loadedImageCount = ref(0);

  const imageLoadComplete = computed(() => {
    if (profiles.value.length === 0) {
      return true;
    }

    return loadedImageCount.value >= profiles.value.length;
  });

  const onImageSettled = () => {
    loadedImageCount.value = Math.min(
      loadedImageCount.value + 1,
      profiles.value.length,
    );
  };

  watch(
    profiles,
    () => {
      loadedImageCount.value = 0;
    },
    { immediate: true },
  );
```
```14:58:app/components/profile-card.vue
        <img
          v-if="!imageError"
          :src="profile.avatarUrl"
          :alt="`${profile.name} avatar`"
          class="h-24 w-24 rounded-full object-cover"
          loading="lazy"
          @load="onImageLoad"
          @error="onImageError"
        >
...
const emit = defineEmits<{
  (event: "imageLoad"): void;
  (event: "imageError"): void;
}>();
...
const onImageError = () => {
  imageError.value = true;
  emit("imageError");
};

const onImageLoad = () => {
  emit("imageLoad");
};
```

If you want “wait only for first row” instead of all 16, say the word and I’ll adjust.

---

**User**

move header  from @app/pages/index.vue into a separate component

---

**Cursor**

Header moved into `app/components/profiles-header.vue` and `index.vue` now uses `<ProfilesHeader />`.

If you want this header to accept props (title/subtitle/search slot), say the word.

---

**User**

move the loader into a separate component

---

**Cursor**

Loader extracted into `app/components/profiles-loader.vue` and `index.vue` now renders it with `:card-count`.

If you want the loader to be smarter (e.g., match card size per breakpoint), I can add props or slots.

---

**User**

move <main> into @app/app.vue so that it wraps nuxtPage

---

**Cursor**

<main> moved to `app.vue` wrapping `<NuxtPage />`, so the gradient background applies to all pages. `index.vue` now just renders its content div.

---

**User**

change the solution to the preloading. We are moving from solution 1 - tracking image load events and keepint the loader until all are loaded. Instead implement a progressive avatar loading for the profiles.

* Render the profile list imedietaly without blocking user interaction
* Show initials placeholder for avatar until the image is loading
* when the avatar image finishes loading successfully, replace the placeholder with a subtle fade-in animation (100-200ms)
* Handle failed avatar loads by keeping the placeholder or falling back to initials.
* Do not introduce a global loader tied to avatar loading.

---

**Cursor**

Switched to progressive avatar loading: list renders right away, initials show until each avatar loads, then avatar fades in; errors keep initials. Removed global image-load gating.

Key changes:
- `app/components/profile-card.vue`: placeholder always present, `imageLoaded` controls fade-in, errors keep initials.
- `app/pages/index.vue`: loader only tied to data `pending`, no avatar tracking.

If you want a slightly longer fade (200ms) or a different easing, say so.

---

**User**

check the @app/components/profile-card.vue the imageLoaded is never changing state to true

---

**Cursor**

Fixed: image now flips to loaded even when it’s already cached before the `@load` listener runs.

Changes in `app/components/profile-card.vue`:
- Removed debug `{{ imageLoaded }}` output.
- Added `ref="imageRef"` and `updateLoadedState()` to detect cached images on mount.
- Reset state when `avatarUrl` changes and re-check after `nextTick`.

If it still doesn’t flip, tell me what the avatar host returns for caching headers and I’ll adjust further.

---

**User**

currently the loaded state seems to be shared between each rendered profile-card instead of each card fetching the image separately. The placeholders are swapped to images only after each one finishes fetching which is not the desired scenario

---

**Cursor**

Adjusted `ProfileCard` to make load state purely per‑instance again: removed the shared/DOM ref check and reset `imageLoaded` only on each card’s `avatarUrl` change. Each card now flips to loaded only when its own `@load` fires.

If cached images stop firing `load` in your browser, tell me and I’ll add a per‑card cached check that doesn’t leak across instances.

---

**User**

Update failing unit tests @/home/donirk/.cursor/projects/home-donirk-Code-random-profiles/terminals/1.txt:198-280 

---

**Cursor**

Updated `test/nuxt/index-page.test.ts` to match current behavior:
- loader count expectation `16`
- `useHead` includes the `link` preconnect + dns‑prefetch

If you want loader count back to 8, I can revert that in `index.vue` and adjust tests accordingly.

