# Linter errors
_Exported on 1/25/2026 at 22:16:23 GMT+1 from Cursor (2.4.21)_

---

**User**

@/home/donirk/.cursor/projects/home-donirk-Code-random-profiles/terminals/1.txt:137-149 fix the linter errors

---

**Cursor**

Fixed lint errors by restoring type-only imports for `Profile` in `profile-card.vue` and `index.vue`, plus cleaned `useHead` indentation. Lints now clean on those files.

If you want to confirm: run `pnpm lint` or `eslint .`.

---

**User**

i still get errors. Might it be wrong linter config?
@/home/donirk/.cursor/projects/home-donirk-Code-random-profiles/terminals/1.txt:23-35 

---

**Cursor**

Updated `eslint.config.mjs` to force the TS parser for `.vue` and `.ts` files, so `import { type ... }` and generics parse correctly. That should clear the “Unexpected token Profile/{” errors.

Run `pnpm lint` again. If it still fails, paste the new error.

---

**User**

@/home/donirk/.cursor/projects/home-donirk-Code-random-profiles/terminals/1.txt:36-63 

---

**Cursor**

Added `vue-eslint-parser` dev dep. Lint should run now. Re-run `pnpm lint`. If it still fails, paste the new error text.

---

**User**

@/home/donirk/.cursor/projects/home-donirk-Code-random-profiles/terminals/1.txt:63-77 

---

**Cursor**

Fixed remaining lint issues:

- `profile-card.vue`: no self-closing `img`, and `v-else` before `class`.
- `profiles.get.ts`: removed unused `error` by using `catch {}`.

Lint should pass now. Re-run `pnpm lint` to confirm.

