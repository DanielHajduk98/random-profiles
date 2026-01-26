# Unit test scenarios for Vue components
_Exported on 1/26/2026 at 18:26:51 GMT+1 from Cursor (2.4.21)_

---

**User**

Create unit tests for @app/components/profile-card.vue and @app/pages/index.vue. Their main functionality should be tested, e.g.: for @app/components/profile-card.vue it should check if the nuxtLink uses appropriate path or if the img is replaced by initials on image loading error. Suggest more unit test scenarios before continuing.

Do NOT implement any code change in this step, just suggest scenarios and what to cover with unit tests.

---

**Cursor**

Key unit test scenarios to cover (no code changes yet).

### `app/components/profile-card.vue`
- NuxtLink uses `/profile/${profile.id}` and `aria-label` includes profile name.
- Renders avatar `<img>` with `src`, `alt`, `loading="lazy"` when no error.
- `@error` switches to initials, hides image.
- Initials logic:
  - two-word name → first letters, uppercase.
  - single-word name → first letter, uppercase.
  - extra spaces → ignores empty parts.
  - empty/whitespace name → fallback `"NA"`.
- Displays name and bio text.

### `app/pages/index.vue`
- Loading state:
  - `pending=true` shows skeleton grid with `LOADING_CARD_COUNT` items.
  - role/status + aria-live present.
- Error state:
  - `error` shows alert with title.
  - `errorMessage` priority:
    - `ApiClientError.message`
    - `Error.message`
    - fallback `"Unexpected error"`.
- Success state:
  - renders `ProfileCard` per profile; count equals `profiles.length`.
  - passes `profile` prop unchanged.
- `useAsyncData`:
  - calls `getProfiles` with `{ count: PROFILE_COUNT }`.
- `useHead` sets title + description.

If you want me to implement tests next, say the test framework + setup you want (if already in repo, I can detect and follow).

---

**User**

take a look at @test/ folder. What are the best practices for unit testing fullstack nuxt apps?

---

**Cursor**

`test/` has: `api-client.test.ts`, `profile-api.test.ts`, `profile-generator.test.ts`, `profiles-api.test.ts`.

Best practices for fullstack Nuxt unit tests:
- Separate unit vs integration: unit for pure utils/composables; integration for components/pages.
- Mock Nuxt runtime: `useAsyncData`, `useHead`, `useRuntimeConfig`, `useFetch`.
- Prefer `@nuxt/test-utils` + `vitest` for Nuxt-aware helpers.
- Use `mount` for component behavior; `shallowMount` only when needed.
- Test by behavior, not Tailwind classes; assert text, props, events, DOM roles.
- Keep fixtures in `test/fixtures` or `test/utils`; reuse builders.
- Mock network at boundary; avoid real API calls in unit tests.
- Cover error paths and empty states.
- Keep tests fast; no filesystem/network unless integration.
- Use deterministic data (no randomness).

---

**User**

With the best practices in mind, and the test scenarios implement the unit tests for @app/components/profile-card.vue and @app/pages/index.vue . Suggest any change to the already existing tests but do not implement the yet, just focus on profile card and index.vue

what is the difference between happy-dom and jsdom? which one is suggested and recommended the most?

---

**Cursor**

Happy DOM vs JSDOM (short):

- **JSDOM**: most widely used; mature; higher fidelity to browser quirks; heavier/slower.
- **Happy DOM**: faster; lighter; less complete/accurate on edge cases.

Recommended most: **JSDOM** (default for Vitest/Jest; most docs/community coverage). Happy DOM is good when speed matters and your tests don’t rely on subtle DOM behavior.

---

**User**

let's use jsdom then

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

use pnpm

---

**Cursor**

Added Nuxt test setup with jsdom and @nuxt/test-utils, plus new Nuxt-runtime unit tests for `profile-card` and `index` pages under `test/nuxt/`. Updated Vitest config to split unit vs Nuxt projects and keep aliases working; enabled Nuxt test module.

Tests run:
- `pnpm test -- --run`

Recommendations for existing tests (no edits made):
- `test/profile-api.test.ts` + `test/profiles-api.test.ts`: `expectHttpError` uses sync try/catch on async handlers; switch to `await expect(handler(event)).rejects.toMatchObject(...)` or make helper async.
- `test/api-client.test.ts`: add coverage for unknown status code (e.g. 500) mapping to `type: "unknown"` and statusCode, plus non-record error fallback to `Unexpected error`.
- `test/profile-generator.test.ts`: add precedence test for `seed` vs `id` if both provided.

Notes:
- Vitest run emits Vue Router warnings for NuxtLink in `profile-card` tests (no matching route). Can silence by adding a test route or mocking NuxtLink if you want.
- `@nuxt/test-utils` warns about peer `vitest@^3.2.0` while you use `^4.0.18`; tests still pass.

---

**User**

implement the recommendations for existing tests.

Analyze this warning, explain it's root and suggest a solution
The Vitest environment nuxt defines the "transformMode". This options was deprecated in Vitest 4 and will be removed in the next major version. Please, use "viteEnvironment" instead.

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Updated existing tests to use async reject assertions, added api-client unknown/fallback cases, and added a seed-vs-id precedence check in generator. Files touched: `test/profile-api.test.ts`, `test/profiles-api.test.ts`, `test/api-client.test.ts`, `test/profile-generator.test.ts`.

Warning root cause + fix:
- Root: `vitest-environment-nuxt` (via `@nuxt/test-utils`) still uses Vitest 3’s `transformMode`. Vitest 4 deprecates it and warns.
- Fix options:
  - Preferred: upgrade `@nuxt/test-utils` once it ships a Vitest‑4 compatible environment (should stop warning).
  - Short-term: downgrade `vitest` to `^3.2.0` to match peer range.
  - Or accept warning until next major Vitest, but it will break once `transformMode` is removed.

Tests run:
- `pnpm test -- --run`

Note: same warning still appears during tests; NuxtLink router warnings still show in `profile-card` tests.

---

**User**

write short commit message for those changes

---

**Cursor**

Suggested commit message:

`test: harden api tests and add generator precedence`

