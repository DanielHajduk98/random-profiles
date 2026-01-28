# Code review of main application modules
_Exported on 1/28/2026 at 18:49:30 GMT+1 from Cursor (2.4.21)_

---

**User**

perform code review of the main code in @app  @lib @server @test 
Be detailed about the code quality, risks and tradeofs of it. Notice any areas for improvements.
Do not make any changes to the code.

---

**Cursor**

Reviewed `app`, `lib`, `server`, `test`. No code changes.

## Findings (ordered)
- **High** – `ProfileAvatar` state not reset on prop change. If user navigates between profiles in same page instance, old `imageError`/`imageLoaded` can hide new avatar. Needs watch/reset on `avatarUrl` or `name`.
  
```45:71:app/components/profile-avatar.vue
const imageError = ref(false);
const imageLoaded = ref(false);
const imageRef = ref<HTMLImageElement | null>(null);
...
const onImageError = () => {
  imageError.value = true;
};
...
onMounted(() => {
  if (imageRef.value?.complete) {
    imageLoaded.value = true;
  }
});
```

- **Medium** – API swallows root errors. `profiles` endpoint converts any failure into generic 500 with no logging/context; hurts diagnosis and hides error types.

```47:64:server/api/profiles.get.ts
export default defineEventHandler((event) => {
  const query = getQueryParams(event);
  const validation = validateQueryParams(query);

  try {
    const catalog = getProfileCatalog();
    const profiles = searchProfiles(catalog, {
      query: validation.query,
      count: validation.count,
    });

    return profiles;
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
```

- **Medium** – No server cap on `count`. Client caps query length, but server allows arbitrarily large `count` values. Risk: large slices/fuse search under load.
  
```14:32:server/utils/profile-query-validation.ts
export const parseCountParam = (
  value: unknown,
  defaultCount: number,
): number => {
  if (value === undefined) {
    return defaultCount;
  }
...
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed <= 0) {
    throwBadRequest("count must be a positive integer");
  }

  return parsed;
};
```

- **Medium** – Client/server query constraints mismatch. Client normalizes to 64 chars, server accepts any length. Behavior diverges if API called directly.

```1:12:app/utils/search-query.ts
export const MAX_QUERY_LENGTH = 64;

export const normalizeQuery = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (trimmed.length > MAX_QUERY_LENGTH) {
    return trimmed.slice(0, MAX_QUERY_LENGTH);
  }
```

- **Low** – `useAsyncData` key depends on caller. If caller reuses a `resultsKey` with different params, cache collisions possible. Suggest encoding `count/query` into key or force unique keys.

```32:47:app/composables/use-profiles-results.ts
const { data, pending, error } = await useAsyncData<Profile[]>(
  options.resultsKey,
  async () => {
    if (!shouldFetch.value) {
      return [];
    }

    return getProfiles({
      count: options.count,
      query: normalizedQuery.value || undefined,
    });
  },
  {
    watch: [normalizedQuery],
    default: () => [],
  },
);
```

- **Low** – Layering/coupling: client code imports `#server` utility. Works now (simple function), but blurs boundary and risks future server-only deps.

```1:4:app/utils/api-client/index.ts
import { z, ZodError } from "zod";
import { ProfileSchema, type Profile } from "../../../lib/types/profile-schema";
import { isRecord } from "#server/utils/type-guards";
```

- **Low** – Redundant validation. `generateProfile` already parses schema, then catalog parses again; double work.

```13:26:server/utils/profile-catalog.ts
for (let index = 0; index < PROFILE_CATALOG_SIZE; index += 1) {
  const id = `profile-${index + 1}`;
  const profile = generateProfile({
    id,
    seed: `${PROFILE_CATALOG_SEED}-${index + 1}`,
  });

  if (seenIds.has(profile.id)) {
    throw new Error(`Duplicate profile id generated: ${profile.id}`);
  }

  seenIds.add(profile.id);
  catalog.push(ProfileSchema.parse(profile));
}
```

```32:71:server/utils/profile-generator.ts
export const generateProfile = (
  options: ProfileGeneratorOptions = {},
): Profile => {
...
  const profile = {
    id,
    name,
    email: faker.internet.email({ firstName, lastName }),
    avatarUrl: buildAvatarUrl(id),
    age: faker.number.int({ min: 0, max: 100 }),
    jobTitle: faker.person.jobTitle(),
    company: faker.company.name(),
    phone,
    address: faker.location.streetAddress(),
    bio: faker.person.bio(),
  };

  return ProfileSchema.parse(profile);
};
```

- **Low** – Fuse cache tied to catalog reference. If catalog refresh is added later, cache might go stale unless ref changes; no explicit invalidation.

```24:39:server/utils/profile-search.ts
let cachedFuse: CachedFuse | null = null;

const getFuseInstance = (catalog: Profile[]): Fuse<Profile> => {
  if (cachedFuse?.catalog === catalog) {
    return cachedFuse.fuse;
  }
...
  const fuse = new Fuse(catalog, options);
  cachedFuse = { catalog, fuse };
  return fuse;
};
```

## Tradeoffs / design notes
- In-memory catalog and deterministic generation = fast + predictable tests, but no eviction and memory fixed to `PROFILE_CATALOG_SIZE`. Scaling will need paging or storage.
- `useProfileStore` only caches one profile. Simple, but loses list context; good for perf, limited reuse.
- `faker.seed` is global. Fine for one-time catalog build; risky if you later generate profiles per-request concurrently.

## Test gaps
- No direct tests for search highlight splitting in `search-profile-card.vue`.
- No tests for `use-debounced-callback` cleanup or `use-profiles-results` watch behavior.
- No unit tests for `profile-query-validation` edge cases (huge count, empty strings, non-string q).

## Positives
- Strong schema validation with Zod and consistent types.
- Clear separation between server utilities, API handlers, and UI.
- Tests cover API endpoints and key pages/components (home, search, profile detail, profile card/avatar).

---

**User**

Add missing unit tests

---

**Cursor**

Added unit tests covering gaps in server utils and app composables/components.

- New unit tests: `test/profile-query-validation.test.ts`, `test/profile-search.test.ts`
- New Nuxt tests: `test/nuxt/use-debounced-callback.test.ts`, `test/nuxt/use-profiles-results.test.ts`, `test/nuxt/search-profile-card.test.ts`

Run tests if needed: `npm test` (or `vitest --project unit` / `vitest --project nuxt`).

---

**User**

explain this point: Medium – API swallows root errors. profiles endpoint converts any failure into generic 500 with no logging/context; hurts diagnosis and hides error types

---

**Cursor**

In `server/api/profiles.get.ts`, the `try/catch` wraps the whole handler and ignores the original error. Any thrown error (validation, search, unexpected) is replaced by a new generic 500 with no message or stack, so logs and debugging lose the root cause and error type.

```47:64:server/api/profiles.get.ts
  try {
    const catalog = getProfileCatalog();
    const profiles = searchProfiles(catalog, {
      query: validation.query,
      count: validation.count,
    });

    return profiles;
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
```

So if `getProfileCatalog()` throws or `searchProfiles()` crashes, you only see “Internal Server Error” and no trace of why.

