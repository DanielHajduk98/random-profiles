# Profile card image loading and placeholder
_Exported on 1/26/2026 at 19:50:28 GMT+1 from Cursor (2.4.21)_

---

**User**

@app/components/profile-card.vue in profile card change the behaviour so that the placeholder initials are displayed during load or there is a loading error. Add a 200ms fade-in animation when loading finishes and the placeholder is replaced with actual image.

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Updated the profile card to keep initials visible while the avatar loads or errors, and fade the image in over 200ms once it finishes loading. This stays in `app/components/profile-card.vue` with a new load state and an opacity transition on the image so the swap feels smooth.

Key logic sits in `app/components/profile-card.vue`:
```10:27:app/components/profile-card.vue
<div
  class="relative flex h-24 w-24 items-center justify-center rounded-full bg-purple-800/60 text-base font-semibold text-purple-100 shadow-inner shadow-purple-950/60"
>
  <img
    v-if="!imageError"
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
  >{{ initials }}</span>
</div>
```

No lints. If you want me to tweak timing or add a blur-up, say the word.

---

**User**

debug the @app/components/profile-card.vue , the @app/components/profile-card.vue:21-22load event is never send, gence the onImageLoad neve changes imageLoaded to true. 

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

